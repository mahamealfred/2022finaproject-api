import Models from "../database/models";
import generateRandomPassword from "../helpers/passwordGenerator";
import { decode, encode } from "../helpers/jwtTokenizer";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
//const mailgun = require("mailgun-js");

dotenv.config();

const {  users,districts,schools,students } = Models;

class districtController {
  static async addDistrict(req, res) {
    try {
      if (req.user) {
        return res.status(400).json({
          status: 400,
          message: "User with email already exist please use another!",
        });
      }

      if (req.district) {
        return res.status(400).json({
          status: 400,
          message: "District with this name already exist, please use another!",
        });
      }

      const { provinceName, districtName, email, fullname }= req.body;
      const password = generateRandomPassword();
      const districtId = uuidv4();

      await users.create({
        id: uuidv4(),
        fullname,
        email,
        password,
        isActive: "INACTIVE",
        role: "DistrictUser",
        districtId,
      });

      await districts.create({
        id: districtId,
        name: districtName,
        provincename:provinceName,
      
      });
      const token = await encode({ email });
     
      const mail = nodemailer.createTransport({
        host: "smtp.outlook.com",
       port: 587,
       secure: false,
       auth: {
         user: "mahamealfred@outlook.com", // Your email id
         pass: "Mahame2022", // Your password
       },
     });
      const data = await mail.sendMail({
        from: "mahamealfred@outlook.com",
        to: email,
        subject: "REB-QualityEducation Activation Email.",
        text: `
          Hello, Thanks for registering on our site.
          Please copy and past the address bellow to activate your account.
          http://${process.env.CLIENT_URL}/auth/activate-email/${token}
          `,
        html: `
          <h1>Hello ${fullname},</h1>
          <p>Thanks for registering on our site.</p>
          <p>Please click the link below to activate your account.</p>
          <a href="http://${process.env.CLIENT_URL}/auth/activate-email/${token}">Activate your account.</a>
          <p>Please click the link below to reset your password. Your current password is :</p><h2>${password}</h2>
          <a href="http://${process.env.CLIENT_URL}/auth/reset-password/${token}">Reset your password.</a>
          `,
      });
      try {
        data.sendMail(data, function (error, body){
          console.log(body);
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent successful");
          }
        });
      } catch (error) {
        console.log("something want wrong ");
      }

      return res.status(200).json({
        status: 200,
        message: "District have been created Successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
  static async getAllPrimarySchoolToSpecificDistrict(req, res) {
    try {
      //const schoolId = req.params.id;
      const token = req.headers["token"];
      const Token = await decode(token);
      const userDistrictId = Token.userDistrictdbId;
      const { count, rows: Schools } = await schools.findAndCountAll({
        where: {
          districtId: userDistrictId,
        
        },
        order: [["id", "ASC"]],
        include: [{ model: students}],
      });
      const findLevel=await students.findOne({where:{level:'P6'}})
      if (Schools && findLevel) {
        return res.status(200).json({
          status: 200,
          message: "All Student School in a specific distric",
          count: count,
          data: Schools,
        });
      }
      return res.status(200).json({
        status: 200,
        message: "No Student found",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
    }
  }
  
}

export default districtController;

import Models from "../database/models";
import generateRandomPassword from "../helpers/passwordGenerator";
import { decode, encode } from "../helpers/jwtTokenizer";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
//const mailgun = require("mailgun-js");

dotenv.config();

const { users, districts, schools, students, results } = Models;

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

      const { provinceName, districtName, email, fullname } = req.body;
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
        provincename: provinceName,
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
        data.sendMail(data, function (error, body) {
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
  static async getAllSchoolToSpecificDistrict(req, res) {
    try {
      //const schoolId = req.params.id;
      const token = req.headers["token"];
      const Token = await decode(token);
      const userDistrictId = Token.userDistrictdbId;

      const { rows: Schools } = await schools.findAndCountAll({
        where: {
          districtId: userDistrictId,
        },
        order: [["id", "ASC"]],
        include: [{ model: students }],
      });
      if (Schools) {
        const totalCount = Schools.length;
        return res.status(200).json({
          status: 200,
          message: "All School in a specific district",
          count: totalCount,
          data: Schools,
        });
      }
      return res.status(200).json({
        status: 200,
        message: "No Primary School found in this District",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
    }
  }
   static async getAllSchoolToSpecificDistrict(req, res) {
    try {
      //const schoolId = req.params.id;
      const token = req.headers["token"];
      const Token = await decode(token);
      const userDistrictId = Token.userDistrictdbId;

      const { rows: Schools } = await schools.findAndCountAll({
        where: {
          districtId: userDistrictId,
        },
        order: [["id", "ASC"]],
        include: [{ model: students }],
      });
      if (Schools) {
        const totalCount = Schools.length;
        return res.status(200).json({
          status: 200,
          message: "All School in a specific district",
          totalSchool: totalCount,
          data: Schools,
        });
      }
      return res.status(200).json({
        status: 200,
        message: "No Primary School found in this District",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
    }
  }
  static async getAllStudentToSchoolInSpecificDistrict(req, res) {
    try {
      //const schoolId = req.params.id;
      const token = req.headers["token"];
      const Token = await decode(token);
      const userDistrictId = Token.userDistrictdbId;
      const schoolId=req.params.id;
      const findSchool=await schools.findOne({
        where:{id:schoolId},
        districtId: userDistrictId
      })
      if(findSchool){
        const {rows:findAllStudent}=await students.findAndCountAll({
          where:{schoolId:schoolId},
          order: [["id", "ASC"]],
          include: [{ model: results }],
        })
        if(findAllStudent){
          const totalStudent=findAllStudent.length
          return res.status(200).json({
            status: 200,
            message: "All Student belongs to a School in a specific district",
            totalStudent: totalStudent,
            data: findAllStudent,
          });
        }
        return res.status(200).json({
          status: 200,
          message: "No Student found in specified School",
        });
      }
      return res.status(404).json({
        status: 404,
        message: "Below school not found in this District.",
      });
     
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
    }
  }
  static async getAllDistrict(req, res) {
    try {
      const {count,  rows: districtData } = await districts.findAndCountAll({
        order: [["name", "ASC"]],
        include: [{model:schools}]
      });
      
      if (districtData) {
        const totalDistrict=await districts.count()
        return res.status(200).json({
          status: 200,
          message: "All districts",
          count: totalDistrict,
          data: districtData,
        });
      }
      return res.status(404).json({ status: 404, message: "No district found" });
    } catch (error) {
      res.status(500).json({ status: 500, message: "server error" });
    }
  }

 
  
}

export default districtController;

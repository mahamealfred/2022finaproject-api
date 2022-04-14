import Models from "../database/models";
import bcrypt from "bcrypt";
import { decode, encode } from "../helpers/jwtTokenizer";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import generateRandomPassword from "../helpers/passwordGenerator";
import nodemailer from "nodemailer";
//const mailgun = require("mailgun-js");
dotenv.config();

const { users,districts,schools } = Models;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class authController {
  static async signup(req, res) {
    try {
      if (req.user) {
        return res.status(400).json({
          status: 400,
          message: "User with email already exist please use onther!",
        });
      }

      const { fullname, email, role,districtId } = req.body;
      // const salt = await bcrypt.genSaltSync(10);
      // const hashedPassword = await bcrypt.hashSync(password, salt);
      const password = generateRandomPassword();
      const findDistrict=await districts.findOne({
        where:{id:districtId}
      });
      
      if(findDistrict){
      
        await users.create({
          id: uuidv4(),
          fullname,
          email,
          role,
          isActive: "INACTIVE",
          password,
          districtId,
          schoolId:null
        });
  
      }
      // else if(findSchool && findDistrict){
      //   await users.create({
      //     id: uuidv4(),
      //     fullname,
      //     email,
      //     role,
      //     isActive: "INACTIVE",
      //     password,
      //     districtId,
      //     schoolId,
      //   });
       
      // }
      else{
        return res.status(404).json({
          status: 404,
          message: "Invalid credential,District not found",
        });
      }
     
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
        message: "User have been created Successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!req.user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }
      const dbEmail = req.user.email;
      const dbPasword = req.user.password;
     

      const decreptedPassword = await bcrypt.compare(password, dbPasword);
      if (dbEmail == email) {
        if (dbPasword == password) {
          const userSchooldbId=req.user.schoolId;
          const userDistrictdbId=req.user.districtId
          const dbRole=req.user.role;
          const token = await encode({ email,userSchooldbId,userDistrictdbId,dbRole});
          const decodedToken=await decode(token)
          const userSchoolId=decodedToken.userSchooldbId
          const userDistrictId=decodedToken.userDistrictdbId
          const Email=decodedToken.email
          const role=decodedToken.dbRole
          return res.status(200).json({
            status: 200,
            message: "User logged with Token",
            data: {
              user: Email,
              role:role,
              schoolId:userSchoolId,
              districtId:userDistrictId,
              token,
             
            },
          });
        
        }
      }
      return res.status(400).json({
        status: 400,
        message: "Password is not correct",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Server error" + error.message,
      });
    }
  }

  static async getAllUser(req, res) {
    try {
      const userData = await users.findAll({
        include:[{model:districts},{model:schools}]
      });

      res.status(200).json({
        status: 200,
        message: "all users ",
        data: userData,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  static async getOneUser(req, res) {
    try {
      const modelId = req.params.id;
      const singleUser = await users.findOne({
        where: { id: modelId },
      });
      if (singleUser) {
        res.status(200).json({
          status: 200,
          message: "retrieved one user",
          data: singleUser,
        });
      }
      res.status(404).json({
        status: 404,
        message: "user not  found",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 500, message: error.message });
    }
  }
  static async deleteUser(req, res) {
    try {
      const modelId = req.params.id;
      const found = await users.findOne({
        where: { id: modelId },
      });
      if (found) {
        const deleteUser = await users.destroy({
          where: { id: modelId },
        });
        return res.status(200).json({
          status: 200,
          message: "user deleted ",
          data: deleteUser,
        });
      }
      res.status(404).json({
        status: 404,
        message: "user not found",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "server error" + error.message });
    }
  }
  static async activateAccount(req, res) {
    try {
      const { token } = req.params;
      const { email } = await decode(token);

      // update status to active
      let updatedEmail = await users.update(
        { isActive: "ACTIVE" },
        { where: { email } }
      );

      return res.status(200).json({
        status: 200,
        data: updatedEmail,
        message: "User activated successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  static async forgotPassword(req, res) {
    const { email } = req.body;
    try {
      if (!req.user) {
        return res.status(400).json({
          status: 400,
          message: "User with email does not exist!",
        });
      }
      const user = await users.findOne({ email: email });
      const token = jwt.sign(
        { _id: user._id ,email},
        process.env.RESET_PASSWORD_KEY,
        { expiresIn: "15m" }
      );

      await users.update({ resetlink: token }, { where: { email: email } });

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
          Hello,
          Please copy and past the address bellow too reset your password.
          http://${process.env.CLIENT_URL}/auth/rest-password/${token}
          `,
        html: `
          <h1>Hello ${req.user.fullname},</h1>
          <p>Reset your password.</p>
          <p>Please click the link below to reset your password.</p>
          <a href="http://${process.env.CLIENT_URL}/auth/reset-password/${token}">To reset  your password.</a>
          `,
      });
      try {
        data.sendMail(data, function (error, body) {

          if (error) {
            console.log(error);
          } else {
            console.log("Email sent successful");
          }
        });
      } catch (error) {
        console.log("something went wrong ");
      }
      return res.status(200).json({
        status: 200,
        message: "Message  sent successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
  static async resetPassword(req, res) {
     
    const token = req.params.token;
    const password = req.body.password;
    //const email=to
    const payload = jwt.verify(token, process.env.RESET_PASSWORD_KEY);
    req.user = payload; 
    const email=req.user.email
 try {
   const findUser=await users.findOne({
     where:{resetlink:token}
   })
   if(!findUser){
     res.status(403).json({
       status: 403,
       message:'Invalid Link'
     })
   }
   const saltRounds=10;
   const salt =await bcrypt.genSaltSync(saltRounds)
   const hashedPassword=await bcrypt.hashSync(password, salt)
    const updatedPassword=await users.update({password:hashedPassword},{
      where:{email:{email}},
      returning: true
    })
    res.status(200).json({
      status:200,
      message:"You have reset successful your password",
      data:updatedPassword

    });
    return res.status(401).json({
      status:401,
      message:"Invalid Link, please try again"
    })
   
 } catch (error) {
   return res.status(500).json({
     status:500,
     message:"Server error:" +error.message
   })
 }
  
}

 
}

export default authController;

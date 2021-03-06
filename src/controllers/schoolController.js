import Models from "../database/models";
import generateRandomPassword from "../helpers/passwordGenerator";
import { decode, encode } from "../helpers/jwtTokenizer";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Sequelize } from "sequelize";

const { Op, where, cast, col } = Sequelize;
import bcrypt from "bcrypt";

//const mailgun = require("mailgun-js");

dotenv.config();

const { schools, users, districts,students,results} = Models;

class schoolController {
  static async addSchool(req, res) {
    try {
      if (req.user) {
        return res.status(400).json({
          status: 400,
          message: "User with email already exist please use anther!",
        });
      }

      if (req.school) {
        return res.status(400).json({
          status: 400,
          message: "School with this name already exist, please use anther!",
        });
      }
      const { name, sector, cell, districtId, email, fullname } = req.body;
      const password = generateRandomPassword();
      console.log("school user password:"+password)
      const salt = await bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hashSync(password, salt);
      const schoolId = uuidv4();
      const findDistrict = await districts.findOne({
        where: { id: districtId },
      });
      if (findDistrict) {
        await users.create({
          id: uuidv4(),
          fullname,
          email,
          password:hashedPassword,
          isActive: true,
          role: "SchoolUser",
          schoolId,
          districtId,
        });

        await schools.create({
          id: schoolId,
          name,
          districtId,
          sector,
          cell,
        });
        
        const token = await encode({ email });
        // const mail = nodemailer.createTransport({
        //   host: "smtp.outlook.com",
        //   port: 587,
        //   secure: false,
        //   auth: {
        //     user: "mahamealfred@outlook.com", // Your email id
        //     pass: "Mahame2022", // Your password
        //   },
        // });
        // const data = await mail.sendMail({
        //   from: "mahamealfred@outlook.com",
        //   to: email,
        //   subject: "REB-QualityEducation Activation Email.",
        //   text: `
        //     Hello, Thanks for registering on our site.
        //     Please copy and past the address bellow to activate your account.
        //     http://${process.env.CLIENT_URL}/auth/activate-email/${token}
        //     `,
        //   html: `
        //     <h1>Hello ${fullname},</h1>
        //     <p>Thanks for registering on our site.</p>
        //     <p>Please click the link below to activate your account.</p>
        //     <a href="http://${process.env.CLIENT_URL}/auth/activate-email/${token}">Activate your account.</a>
        //     <p>Please click the link below to reset your password. Your current password is :</p><h2>${password}</h2>
        //     <a href="http://${process.env.CLIENT_URL}/auth/reset-password/${token}">Reset your password.</a>
        //     `,
        // });
        // try {
        //   data.sendMail(data, function (error, body) {
        //     console.log(body);
        //     if (error) {
        //       console.log(error);
        //     } else {
        //       console.log("Email sent successful");
        //     }
        //   });
        // } catch (error) {
        //   console.log("something want wrong ");
        // }
        return res.status(200).json({
          status: 200,
          message: "The School have been Successfuly Added",
        });
      }
      return res.status(404).json({
        status: 404,
        message: "District not found, Please select correct district.",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
  static async addSchoolByDistricUser(req, res) {
    try {
      if (req.user) {
        return res.status(400).json({
          status: 400,
          message: "User with email already exist please use anther!",
        });
      }

      if (req.school) {
        return res.status(400).json({
          status: 400,
          message: "School with this name already exist, please use anther!",
        });
      }
      const { name, sector, cell, email, fullname } = req.body;
      const token = req.headers["token"];
      const Token = await decode(token);
      const DistrictId = Token.userDistrictdbId;
      const password = generateRandomPassword();
      console.log("school user password:"+password)
      const salt = await bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hashSync(password, salt);
      const schoolId = uuidv4();
      const findDistrict = await districts.findOne({
        where: { id: DistrictId },
      });
      if (findDistrict) {
        await users.create({
          id: uuidv4(),
          fullname,
          email,
          password:hashedPassword,
          isActive: true,
          role: "SchoolUser",
          schoolId,
          districtId,
        });

        await schools.create({
          id: schoolId,
          name,
          districtId:DistrictId,
          sector,
          cell,
        });
        
        const token = await encode({ email });
        // const mail = nodemailer.createTransport({
        //   host: "smtp.outlook.com",
        //   port: 587,
        //   secure: false,
        //   auth: {
        //     user: "mahamealfred@outlook.com", // Your email id
        //     pass: "Mahame2022", // Your password
        //   },
        // });
        // const data = await mail.sendMail({
        //   from: "mahamealfred@outlook.com",
        //   to: email,
        //   subject: "REB-QualityEducation Activation Email.",
        //   text: `
        //     Hello, Thanks for registering on our site.
        //     Please copy and past the address bellow to activate your account.
        //     http://${process.env.CLIENT_URL}/auth/activate-email/${token}
        //     `,
        //   html: `
        //     <h1>Hello ${fullname},</h1>
        //     <p>Thanks for registering on our site.</p>
        //     <p>Please click the link below to activate your account.</p>
        //     <a href="http://${process.env.CLIENT_URL}/auth/activate-email/${token}">Activate your account.</a>
        //     <p>Please click the link below to reset your password. Your current password is :</p><h2>${password}</h2>
        //     <a href="http://${process.env.CLIENT_URL}/auth/reset-password/${token}">Reset your password.</a>
        //     `,
        // });
        // try {
        //   data.sendMail(data, function (error, body) {
        //     console.log(body);
        //     if (error) {
        //       console.log(error);
        //     } else {
        //       console.log("Email sent successful");
        //     }
        //   });
        // } catch (error) {
        //   console.log("something want wrong ");
        // }
        return res.status(200).json({
          status: 200,
          message: "The School have been Successfuly Added",
        });
      }
      return res.status(404).json({
        status: 404,
        message: "District not found, Please select correct district.",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
  static async getAllSchool(req, res) {
    try {
      const { count, rows: schoolsData } = await schools.findAndCountAll({
        order: [["name", "ASC"]],
        include: [{model:districts}]
      });
      if (schoolsData) {
        return res.status(200).json({
          status: 200,
          message: "All School",
          count: count,
          data: schoolsData,
        });
      }
      return res.status(404).json({ status: 404, message: "No school found" });
    } catch (error) {
      res.status(500).json({ status: 500, message: "server error" });
    }
  }
  static async getAllSchoolByDistrictUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const DistrictId = Token.userDistrictdbId;
      const { count, rows: schoolsData } = await schools.findAndCountAll({
        where:{districtId:DistrictId},
        order: [["name", "ASC"]],
        include: [{model:districts}]
      });
      if (schoolsData) {
        return res.status(200).json({
          status: 200,
          message: "All School",
          count: count,
          data: schoolsData,
        });
      }
      return res.status(404).json({ status: 404, message: "No school found" });
    } catch (error) {
      res.status(500).json({ status: 500, message:error.message });
    }
  }
  static async getAllSchoolToSpecificDistrict(req, res) {
    try {
      const { count, rows: schoolsData } = await schools.findAndCountAll();
      res.status(200).json({
        status: 200,
        message: "All School",
        count: count,
        data: schoolsData,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: "server error" });
    }
  }

  static async updateSchool(req, res) {
    try {
      const updateSchool = {
        name: req.body.name,
        districtId: req.body.districtId,
        sector: req.body.sector,
        cell: req.body.cell,
      };
      const modelId = req.params.id;
      const found = await schools.findOne({
        where: { id: modelId },
      });
      if (found) {
        const updatedSchool = await schools.update(updateSchool, {
          where: { id: modelId },
          returning: true,
        });
        return res.status(200).json({
          status: 200,
          message: "The school have been successfull updated.",
          data: updatedSchool,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "School not found",
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: error.message});
    }
  }

  static async deleteSchool(req, res) {
    try {
      const modelId = req.params.id;
      const found = await schools.findOne({
        where: { id: modelId },
      });
      if (found) {
        await schools.destroy({
          where: { id: modelId },
        });
        return res.status(200).json({
          status: 200,
          message: "School was deleted successfull!",
        });
      }
      res.status(404).json({
        status: 404,
        message: "School not found",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: "server error" });
    }
  }
  
  static async getSchoolById(req,res){
    try {
      const SchoolId=req.params.id;
      const school=await schools.findOne({
        where:{id:SchoolId}
      });
      if(school){
        return res.status(200).json({
          status:200,
          data:school
        });
      }
      return res.status(400).json({
          status:400,
          message:"School Not Found"
        });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
  static async findOneSchool(req, res) {
    try {
      const modelId = req.params.id;
      const singleSchool = await schools.findOne({
        where: { id: modelId },
        include:[{model:students,include:[{model:results}]}]
      });
      if (!singleSchool) {
        res.status(404).json({
          status: 404,
          message: "School not found ",
        });
      }
     return res.status(200).json({
        status: 200,
        message: "School Information",
        data: singleSchool,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 500, message: "server error" });
    }
  }
  static async search(req, res) {
    try {
      const { searchKey } = req.query;
      const searchQuery = [
        where(cast(col("schools.name"), "varchar"), {
          [Op.like]: `%${searchKey}%`,
        }),
        where(cast(col("schools.sector"), "varchar"), {
          [Op.like]: `%${searchKey}%`,
        }),
       
      ];

      const found = await schools.findAll({
        where: { [Op.or]: searchQuery },
      });

      return res.status(200).json({
        status: 200,
        found,
        message: "Search Complete",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
}

export default schoolController;

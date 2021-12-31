import Models from "../database/models";
import generateRandomPassword from "../helpers/passwordGenerator";
import { decode, encode } from "../helpers/jwtTokenizer";
import sendEmailVerification from "../helpers/sendEmailVerification";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
//const mailgun = require("mailgun-js");

dotenv.config();

const { schools, users } = Models;

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

      const { name, province, district, sector, cell, level, email, fullname } =
        req.body;
      const password = generateRandomPassword();
      const schoolId = uuidv4();

      await users.create({
        id: uuidv4(),
        fullname,
        email,
        password,
        isActive: false,
        role: "SchoolAdmin",
        schoolId,
      });

      await schools.create({
        id: schoolId,
        name,
        province,
        district,
        sector,
        cell,
        level,
      });
      const token = await encode({ email });
      const data = {
        from: "qualityeducationbooster@gmail.com",
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
          `,
      };
      try {
        sgMail.send(data, function (error, body) {
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
        message: "School have been added",
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
      const schoolsData = await schools.findAll();
      res.status(200).json({
        status: 200,
        message: "All School",
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
        province: req.body.province,
        district: req.body.district,
        sector: req.body.sector,
        cell: req.body.cell,
        level: req.body.level,
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
          message: "School updated successfull!",
          data: updatedSchool,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "School not found",
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: "server error" });
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
  static async findOneSchool(req, res) {
    try {
      const modelId = req.params.id;
      const singleSchool = await schools.findOne({
        where: { id: modelId },
      });
      if (!singleSchool) {
        res.status(404).json({
          status: 404,
          message: "School not found ",
        });
      }
      res.status(200).json({
        status: 200,
        message: "School Information",
        data: singleSchool,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 500, message: "server error" });
    }
  }
}

export default schoolController;

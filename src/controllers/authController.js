import Models from "../database/models";
import bcrypt from "bcrypt";
import { decode, encode } from "../helpers/jwtTokenizer";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import generateRandomPassword from "../helpers/passwordGenerator";
//const mailgun = require("mailgun-js");

dotenv.config();

const { users } = Models;
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

      const { fullname, email,role } = req.body;
      // const salt = await bcrypt.genSaltSync(10);
      // const hashedPassword = await bcrypt.hashSync(password, salt);
      const password = generateRandomPassword();
      await users.create({
        id: uuidv4(),
        fullname,
        email,
        role,
        isActive: "INACTIVE",
        password
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
        if (dbPasword==password) {
          const token = await encode({ email });
          return res.status(200).json({
            status: 200,
            message: "User logged with Token",
            data: {
              user: req.user,
              token,
            },
          });
        }
      }
      return res.status(401).json({
        status: 401,
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
      const userData = await users.findAll();

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
        { _id: user._id },
        process.env.RESET_PASSWORD_KEY,
        { expiresIn: "15m" }
      );

      await users.update({ resetlink: token }, { where: { email: email } });
    
      const data = {
        from: "qualityeducationbooster@gmail.com",
        to: email,
        subject: "REB-QualityEducation Activation Email.",
        text: `
          Hello,
          Please copy and past the address bellow to reset your password.
          http://${process.env.CLIENT_URL}/auth/rest-password/${token}
          `,
        html: `
          <h1>Hello ${req.user.fullname},</h1>
          <p>Reset your password.</p>
          <p>Please click the link below to reset your password.</p>
          <a href="http://${process.env.CLIENT_URL}/auth/reset-password/${token}">Reset  your password.</a>
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
   
    try {
      const user = await users.findById(req.params.modelId);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await users.findOne({
            id: user._id,
            resetlink: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        user.password = req.body.password;
        await user.save();
        await token.delete();
      } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
}

export default authController;

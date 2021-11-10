import Models from "../database/models";
import bcrypt from "bcrypt";
import { decode, encode } from "../helpers/jwtTokenizer";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

const mailgun = require("mailgun-js");
const DOMAIN ="sandbox518fbe58df344e2aaea9e7a79460f29b.mailgun.org";
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });



dotenv.config();

const { users } = Models;



class authController {
  static async signup(req,res){
    try {
        if (req.user) {
          return res.status(400).json({
            status: 400,
            message: "User with email already exist, please use onather!",
          });
        }

        const { fullname, email, password } = req.body;
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);
        await users.create({
          fullname,
          email,
          role:"",
          isActive:false,
          password: hashedPassword,
        });
       // const token = await encode({ email });
        const data = {
          from: 'QualityEducationBooster@reb.com',
          to: email,
          subject: 'Hello',
          text: 'Testing some Mailgun awesomness!'
        };
    
        mg.messages().send(data, function (error, body) {
          console.log(body);
          if (error) {
          console.log(error)
          }
         
        });
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
       if (decreptedPassword) {
        const token = await encode({ email });
        return res.status(200).json({
          status: 200,
          mesage: "User logged Successfull!",
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
  

  static async getAllUser(req, res) {
    try {
      const userData = await users.findAll();
     
      res.status(200).json({
        status: 200,
        message: "all users ",
        data: userData ,
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

  }

export default authController;
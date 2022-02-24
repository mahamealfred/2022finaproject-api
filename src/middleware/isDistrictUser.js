import Models from "../database/models";
import { decode } from "../helpers/jwtTokenizer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { users } = Models;

const isDistrictUser = async (req, res, next) => {
  const Token = req.headers["token"];
  if (!Token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(Token, process.env.JWT_SECRET);
    const userDistrictId = decoded.userDistrictdbId;
    req.user = decoded;
    console.log(userDistrictId)
    const email = req.user.email;
    console.log(email)
    const found = await users.findOne({ where: { email: email } });
    if (!found) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    if ( found.districtId==userDistrictId) {
      return next();
    } else {
      return res.status(403).json({
        status: 403,
        message: "Only District User is allowed",
      });
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};
export default isDistrictUser;

import Models from "../database/models";
const { users } = Models;
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isSchoolUser= async (req, res, next) => {
    const schoolId=req.params.id
  const Token = req.headers["token"];
  if (!Token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(Token, process.env.JWT_SECRET);
    req.user = decoded;
    const email=req.user.email
    const found = await users.findOne({ where: { email: email } });
  if (!found) {
    return res.status(404).json({
      status: 404,
      message: "User not found",
    });
  }
  if (found.role == "SchoolUser" && found.schoolId==schoolId) {
    return next();
  } else {
    return res.status(403).json({
      status: 403,
      message: "Only  allowed by School User",
    });
  }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  
};

export default isSchoolUser;
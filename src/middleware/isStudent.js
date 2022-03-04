import Models from "../database/models";
const { students } = Models;
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isStudent = async (req, res, next) => {
  const Token = req.headers["token"];
  if (!Token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(Token, process.env.JWT_SECRET);
    const studentId = decoded.dbStudentId;
    const studentCode=decoded.dbStudentCode;
    req.student = decoded;
    const email = req.student.email;
    const found = await students.findOne({ where: { email: email } });
    if (!found) {
      return res.status(404).json({
        status: 404,
        message: "Student not found",
      });
    }
    if (found.id == studentId && found.studentcode==studentCode) {
      return next();
    } else {
      return res.status(403).json({
        status: 403,
        message: "Only allowed by a Student",
      });
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

export default isStudent;

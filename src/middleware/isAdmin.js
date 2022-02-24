import Models from "../database/models";
import { decode } from "../helpers/jwtTokenizer";
import jwt from "jsonwebtoken";
const { users } = Models;

const isAdmin = async (req, res, next) => {
  const Token = req.headers["token"];
  if (!Token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = await jwt.verify(Token, process.env.JWT_SECRET);
    req.user = decoded;
   const email = req.user.email;
    const found = await users.findOne({ where: { email: email } });
    if (!found) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    if (found.role == "Admin") {
      return next();
    } else {
      return res.status(403).json({
        status: 403,
        message: "Only Admin allowed",
      });
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

export default isAdmin;

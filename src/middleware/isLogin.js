import Models from "../database/models";
import { decode } from "../helpers/jwtTokenizer";
const { users } = Models;

const isLogin = async (req, res,next) => {
  const Token = req.headers["token"];
  if (!Token) {
    return res.status(403).json({
      status: 403,
      message: "please login",
    });
  }
  const payload = await decode(Token);
  const { email } = payload;

  const found = await users.findOne({ where: { email } });
  if (!found) {
    return res.status(404).json({
      status: 404,
      message: "User not found",
    });
  }
req.user=found;
    return next();
};

export default isLogin;
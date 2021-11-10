import Models from "../database/models";
import { encode } from "../helpers/jwtTokenizer";
import studentcoder from '../helpers/studentcoder'
const { schools } = Models;

class schoolController {
  static async addSchool(req, res) {
    try {
     
      const { name,province, district,sector,cell,level } = req.body;
      await schools.create({
        name,
        province,
        district,
        sector,
        cell,
        level,
        
      });
      return res.status(200).json({
        status: 200,
        message: "School have been created",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

//   static async getAl(req, res) {
//     try {
//       const userData = await users.findAll();
//       res.status(200).json({
//         status: 200,
//         message: "all users ",
//         data: userData,
//       });
//     } catch (error) {
//       res.status(500).json({ status: 500, message: error.message });
//     }
//   }

//   static async OneUser(req, res) {
//     try {
//       const modelId = req.params.id;
//       const singleUser = await users.findOne({
//         where: { id: modelId },
//       });
//       if (singleUser) {
//         res.status(200).json({
//           status: 200,
//           message: "retrieved one user",
//           data: singleUser,
//         });
//       }
//       res.status(404).json({
//         status: 404,
//         message: "user not  found",
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ status: 500, message: error.message });
//     }
//   }
//   static async deleteUser(req, res) {
//     try {
//       const modelId = req.params.id;
//       const found = await users.findOne({
//         where: { id: modelId },
//       });
//       if (found) {
//         const deleteUser = await users.destroy({
//           where: { id: modelId },
//         });
//         return res.status(200).json({
//           status: 200,
//           message: "user deleted ",
//           data: deleteUser,
//         });
//       }
//       res.status(404).json({
//         status: 404,
//         message: "user not found",
//       });
//     } catch (error) {
//       res
//         .status(500)
//         .json({ status: 500, message: "server error" + error.message });
//     }
//   }
}

export default schoolController;

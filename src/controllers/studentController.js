import Models from "../database/models";
import bcrypt from "bcrypt";
import { encode } from "../helpers/jwtTokenizer";
import studentcoder from '../helpers/studentcoder'
const { students, schools } = Models;

class studentController {
  static async addStudent(req, res) {
    try {
     
      const { firstname,lastname,email, password,dob,gender,schoolId } = req.body;
      const salt = await bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hashSync(password, salt);
      const studentCode=await studentcoder();
      
      const found = await schools.findOne({
        where: { id: schoolId },
      });
   if(found){
    await students.create({
        firstname,
        lastname,
        studentcode:studentCode,
        email,
        dob,
        gender,
        schoolId,
        password: hashPassword,
      });
      return res.status(201).json({
        status: 201,
        message: "Student have been added successfull!",
      });
   }
   return res.status(404).json({
    status: 404,
    message: " School not found",
  });
     
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  static async updateStudent(req, res) {
   try {
    const { firstname,lastname,dob,gender,schoolId } = req.body;
    const {id}=req.params;
    const found=await students.findOne({
      where: {id},
     });
     if(found){
         const foundSchool=await schools.findOne({
             where:{id:schoolId},
         });
         if(foundSchool){
          const updatedStudent = await students.update({ 
              firstname,
              lastname,
              dob,
              gender,
              schoolId 
             } , {
              where: {id},
              returning: true,
            });
           return res.status(200).json({
              status: 200,
              message: "Student updated successfull!",
              data: updatedStudent,
            });
         }
         return res.status(404).json({
          status: 404,
          message: "School not found"
        });
          
     }
    return res.status(404).json({
      status: 404,
      message: "Student not found"
    });
      
    } catch (error) {
     return res.status(500).json({ status: 500, message:error.message });
    }
  }

  static async deleteStudent(req, res) {
    try {
      const modelId = req.params.id;
      const found = await students.findOne({
        where: { id: modelId },
      });
      if (found) {
        await students.destroy({
          where: { id: modelId },
        });
        return res.status(200).json({
          status: 200,
          message: "Student deleted"
        });
      }
      res.status(404).json({
        status: 404,
        message: "Student not found",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: "server error" });
    }
  }
  static async findOneStudent(req, res) {
    try {
      const modelId = req.params.id;
      const singleStudent = await students.findOne({
        where: { id: modelId },
      });
      if(singleStudent )
      {
        res.status(200).json({
          status: 200,
          message: "retrieved one Student",
          data: singleStudent,
        });
      }
      res.status(404).json({
        status: 404,
        message: "Student not  found",
      });
     
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 500, message: "server error" });
    }
  }

  static async getallStudent(req, res) {
    try {
      const data = await students.findAll({
        include: [
          {
            model: schools,
          },
        ],
      });

      return res.status(200).json({
        status: 200,
        message: "Fetchs student succeffuly",
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
}

}

export default studentController;

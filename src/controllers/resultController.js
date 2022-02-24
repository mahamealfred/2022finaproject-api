import Models from "../database/models";
import { v4 as uuidv4 } from "uuid";

const { results,exams,students} = Models;

class resultController {
  static async addResult(req, res) {
    try {
      const { marks, examId, studentId } = req.body;
      const foundStudent=await students.findOne({
          where:{id:studentId},
      });
      if(foundStudent){
          const findExam=await exams.findOne({
              where:{id:examId},
          });
          if(findExam){
            const createdResult= await results.create({
                id:uuidv4(),
                marks,
                examId,
                studentId
              });
              return res.status(200).json({
                status: 200,
                message: "Result have been added",
                data:createdResult
    
              });
          }
          return res.status(403).json({
            status: 403,
            message: "Exam does not exist!"
            
          });
    }
      return res.status(404).json({
        status: 404,
        message: "Student not found!",
      });
      
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
  static async getAllResult(req, res) {
    try {
      const Results = await results.findAll({
        include: [
            {
              model: exams,
             
            },
            {
                model:students,
            },
          ],
      });
      res.status(200).json({
        status: 200,
        message: "All  Results",
        data: Results,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: "server error" });
    }
  }
  static async getAllPrimaryResultToSpecificSchool(req,res){
    try {
      const schoolId = req.params.id;
      const { count, rows: Students } = await students.findAndCountAll({
        where: {
          schoolId: schoolId,
          level:'S3'
        },
        order: [["id", "ASC"]],
        include: [{ model: results }],
      });
      if (Students) {
        return res.status(200).json({
          status: 200,
          message: "All result for student",
          count: count,
          data: Students,
        });
      }
      return res.status(200).json({
        status: 200,
        message: "No Student found",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
    }
  }

  
 
   static async deleteResult(req, res) {
     try {
       const modelId = req.params.id;
       const found = await results.findOne({
         where: { id: modelId },
       });
       if (found) {
         await results.destroy({
           where: { id: modelId },
         });
         return res.status(200).json({
           status: 200,
           message: "Results deleted"
         });
       }
       res.status(404).json({
         status: 404,
         message: "Results not found",
       });
     } catch (error) {
       res.status(500).json({ status: 500, message:error.message });
     }
   }
   static async findOneResult(req, res) {
     try {
       const modelId = req.params.id;
       const singleResult = await results.findOne({
         where: { id: modelId },
       });
       if(singleResult )
       {
         res.status(200).json({
           status: 200,
           message: "retrieve one question",
           data: singleResult,
         });
       }
       res.status(404).json({
         status: 404,
         message: "Result not  found",
       });
      
     } catch (error) {
       console.log(error);
       res.status(500).json({ status: 500, message: error.message });
     }
    }
 
}

export default resultController;

import Models from "../database/models";
import { v4 as uuidv4 } from "uuid";

const { questions,exams} = Models;

class questionsController {
  static async addQuestion(req, res) {
    try {
        if (req.question) {
            return res.status(400).json({
              status: 400,
              message: "This Question is already exist!",
            });
          }
      const { question, correct_answer, examId, incorrect_answer } = req.body;
      const foundExam=await exams.findOne({
          where:{id: examId},
      });
      if(foundExam){
       const createdQuestion= await questions.create({
            id:uuidv4(),
            question,
            correct_answer,
            incorrect_answer,
            examId
            
          });
          return res.status(200).json({
            status: 200,
            message: "Question have been added",
            data:createdQuestion

          });
      }
      return res.status(200).json({
        status: 200,
        message: "Exam not found,please add an exam!",
      });
      
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
  static async getAllQuestion(req, res) {
    try {
      const Questions = await questions.findAll();
      res.status(200).json({
        status: 200,
        message: "All  Questions",
        data: Questions,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: "server error" });
    }
  }

  static async updateQuestion(req, res) {
    try {
        const { question, correct_answer,incorrect_answer } = req.body;
     const {id}=req.params;
      const found=await questions.findOne({
        where: {id},
       });
       if(found){
         
            const updatedQuestion = await questions.update({ 
                question,
                correct_answer,
                incorrect_answer
               } , {
                where: {id},
                returning: true,
              });
             return res.status(200).json({
                status: 200,
                message: "Question updated successfull!",
                data: updatedQuestion,
              });
           }
      return res.status(404).json({
        status: 404,
        message: "Question not found"
      });
        
      } catch (error) {
       return res.status(500).json({ status: 500, message:error.message });
      }
   }
 
   static async deleteQuestion(req, res) {
     try {
       const modelId = req.params.id;
       const found = await questions.findOne({
         where: { id: modelId },
       });
       if (found) {
         await questions.destroy({
           where: { id: modelId },
         });
         return res.status(200).json({
           status: 200,
           message: "Question deleted"
         });
       }
       res.status(404).json({
         status: 404,
         message: "Question not found",
       });
     } catch (error) {
       res.status(500).json({ status: 500, message:error.message });
     }
   }
   static async findOneQuestion(req, res) {
     try {
       const modelId = req.params.id;
       const singleQuestion = await questions.findOne({
         where: { id: modelId },
       });
       if(singleQuestion )
       {
         res.status(200).json({
           status: 200,
           message: "retrieved one question",
           data: singleQuestion,
         });
       }
       res.status(404).json({
         status: 404,
         message: "Question not  found",
       });
      
     } catch (error) {
       console.log(error);
       res.status(500).json({ status: 500, message: error.message });
     }
   }
 
   static async getallQuestion(req, res) {
     try {
       const data = await questions.findAll({
         include: [
           {
             model: exams,
           },
         ],
       });
 
       return res.status(200).json({
         status: 200,
         message: "Fetch questions successful!",
         data: data,
       });
     } catch (error) {
       return res.status(500).json({
         status: 500,
         message: error.message,
       });
     }
 }
 static async getQuestionByExamId(req,res){
   try {
     const examId= req.params.id
     const allQuestion=await questions.findAll({
       where:{examId:examId}
     })
     if(allQuestion)
     {
       return res.status(200).json({
         status:200,
         message:"All Question",
         data:allQuestion
       })
     }
     return res.status(404).json({
      status: 404,
      message: "No QUESTION FOUND",
      
    });
     
   } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
   }
 }
 
 
}

export default questionsController;

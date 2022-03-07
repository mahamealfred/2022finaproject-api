import Models from "../database/models";
import { v4 as uuidv4 } from "uuid";
import { decode } from "../helpers/jwtTokenizer";

const { exams, questions } = Models;

class examsController {
  static async addExam(req, res) {
    try {
      if (req.exam) {
        return res.status(400).json({
          status: 400,
          message: "Exam with this name already exist, please use onather!",
        });
      } 
      const { name, startDate, subject,level,question, correct_answer, incorrect_answer } = req.body;
      const examId = uuidv4();
      await exams.create({
        id: examId,
        name,
        startDate,
        subject,
        level
      });
      await questions.create({
        id: uuidv4(),
        question,
        incorrect_answer,
        correct_answer,
        examId
      })
      console.log(incorrect_answer)
      return res.status(200).json({
        status: 200,
        message: "Exam have been added",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
  static async getAllExam(req, res) {
    try {
      

      const { count, rows: examsData } = await exams.findAndCountAll({
        
        include: [
          {
            model: questions,
          },
        ],
        order: [['id', 'ASC']],
      });
     return res.status(200).json({
        status: 200,
        message: "All Exam",
        count:count,
        data: examsData,
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: error.message });
    }
  }

  static async updateExam(req, res) {
    try {
      const { name, subject, startDate,level } = req.body;
      const { id } = req.params;
      const found = await exams.findOne({
        where: { id },
      });
      if (found) {
        const updatedExam = await exams.update({ 
          name,
          subject,
          level,
          startDate
         } , {
          where: {id},
          returning: true,
        });
       return res.status(200).json({
          status: 200,
          message: "Exam updated successfull!",
          data: updatedExam,
        });
     }
return res.status(404).json({
  status: 404,
  message: "Exam not found"
});
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 500, message: error.message });
    }
  }

  static async deleteExam(req, res) {
    try {
      const modelId = req.params.id;
      const found = await exams.findOne({
        where: { id: modelId },
      });
      if (found) {
        await exams.destroy({
          where: { id: modelId },
        });
        return res.status(200).json({
          status: 200,
          message: "Exam was deleted successfull!",
        });
      }
      res.status(404).json({
        status: 404,
        message: "Exam not found",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
  static async findOneExam(req, res) {
    try {
      const modelId = req.params.id;
      const singleExam = await exams.findOne({
        where: { id: modelId },
        include:[
          {
            model: questions
          }
        ]
      });
      if (!singleExam) {
        res.status(404).json({
          status: 404,
          message: "Exam not found ",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Exam Information",
        data: singleExam,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 500, message: error.message });
    }
  }
  static async getExamsByLevel(req,res){
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const studentLevel = Token.dbStudentLevel;
      const findExams=await exams.findAll({
        where:{level:studentLevel},
        include:[{model:questions}]
      })
      if(findExams){
        return res.status(200).json({
          status:200,
        message:"All Exams",
        data:findExams
        })
      }
      return res.status(404).json({
        status:404,
      message:"Exams not found",
    
      }) 
    }catch (error) {
      return res.status(500).json({
        status:500,
      message:"Sever error" +error.message
     
    })
  }
}
static async getExamsAndQuestionById(req,res){
  try {
    const examId=req.params.id
    const token = req.headers["token"];
    const Token = await decode(token);
    const studentLevel = Token.dbStudentLevel;
    
    const findExams=await exams.findAll({
      where:{
        id:examId,
        level:studentLevel
      },
      include:[{model:questions}]
    })
    if(findExams){
      return res.status(200).json({
        status:200,
      message:"All Exams",
      data:findExams
      })
    }
    return res.status(404).json({
      status:404,
    message:"Exams not found",
  
    }) 
  }catch (error) {
    return res.status(500).json({
      status:500,
    message:"Sever error" +error.message
   
  })
}
}
}


export default examsController;

import Models from "../database/models";
import { v4 as uuidv4 } from "uuid";
import { decode } from "../helpers/jwtTokenizer";
const { results, exams, students } = Models;
import { Sequelize } from "sequelize";

class resultController {
  static async addResult(req, res) {
    try {

      const { marks,examId } = req.body;
      const token = req.headers["token"];
      const Token = await decode(token);
      const studentId = Token.dbStudentId;
      const createdResult = await results.create({
            id: uuidv4(),
            marks,
            examId,
            studentId:studentId,
          });
          return res.status(200).json({
            status: 200,
            message: "Result have been added",
            data: createdResult,
          });
        }
        
     catch (error) {
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
            model: students,
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
  static async getPrimaryResultBySchoolUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const schoolId = Token.userSchooldbId;
      const ExamId = req.params.id;
      const findResults = await results.findAll({
        where: { examId: ExamId },
        order: [["marks", "DESC"]],
        include: [
          { model: exams },
          {
            model: students,
            where: {
              schoolId: schoolId,
              level: "P6",
            },
          },
        ],
      });

      if (findResults) {
        return res.status(200).json({
          status: 200,
          message: "All result for Primary student",
          data: findResults,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Result found",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
    }
  }
  static async getOrdinaryResultBySchoolUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const schoolId = Token.userSchooldbId;
      const ExamId = req.params.id;
      const findResults = await results.findAll({
        where: { examId: ExamId },
        order: [["marks", "DESC"]],
        include: [
          { model: exams },
          {
            model: students,
            where: {
              schoolId: schoolId,
              level: "S3",
            },
          },
        ],
      });

      if (findResults) {
        return res.status(200).json({
          status: 200,
          message: "All result for Ordinary student",
          data: findResults,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Result found",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
    }
  }

  static async getOrdinaryResultByDistrictUser(req, res) {
    try {
      // const token = req.headers["token"];
      // const Token = await decode(token);
      // const districtlId = Token.userDistrcitdbId;
      const { schoolId, ExamId } = req.query;
      const findResults = await results.findAll({
        where: { examId: ExamId },
        order: [["marks", "DESC"]],
        include: [
          { model: exams },
          {
            model: students,
            where: {
              schoolId: schoolId,
              level: "S3",
            },
          },
        ],
      });

      if (findResults) {
        return res.status(200).json({
          status: 200,
          message: "All result for Ordinary student",
          data: findResults,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Result found",
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
          message: "Results deleted",
        });
      }
      res.status(404).json({
        status: 404,
        message: "Results not found",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
  static async getPercentageResultsOfAllStudentsBySchoolUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const userSchoolId = Token.userSchooldbId;
      const Results = await results.findAll({
        attributes: [[Sequelize.fn("sum", Sequelize.col("marks")), "total"],
                     [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],],
       
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          {
            model: students,
            where: { schoolId: userSchoolId, level: "P6" },
            attributes: []
          },
        ],
      });
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "students Percentage",
          data: Results,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Data Found",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
  static async getPercentageResultBasedOnGenderBySchoolUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const userSchoolId = Token.userSchooldbId;
      const Results = await results.findAll({
        attributes: [[Sequelize.fn("sum", Sequelize.col("marks")), "total"],
                     [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],],
        group: ["student.id"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          {
            model: students,
            where: { schoolId: userSchoolId, level: "P6" },
            attributes: [
              "gender",
            ],
          },
        ],
      });
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "students Percentage",
          data: Results,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Data Found",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
  static async getPercentageMarksOfPrimaryStudentsInSpecificSchool(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const userSchoolId = Token.userSchooldbId;
      const Results = await results.findAll({
        attributes: [
          "examId",
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("examId")), "AssessmentCount"],
        ],
        group: ["examId", "exam.id"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          { model: exams, attributes: [[Sequelize.col("name"), "Name"]] },
          {
            model: students,
            where: { schoolId: userSchoolId, level: "P6" },
            attributes: [],
          },
        ],
        // }]
      });
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "student with total",
          data: Results,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Data Found",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Server error :" + error.message,
      });
    }
  }
  static async getPercentageResultBasedOnGenderInOrdinaryBySchoolUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const userSchoolId = Token.userSchooldbId;
      const Results = await results.findAll({
        attributes: [[Sequelize.fn("sum", Sequelize.col("marks")), "total"],
                     [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],],
        group: ["student.id"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          {
            model: students,
            where: { schoolId: userSchoolId, level: "S3" },
            attributes: [
              "gender",
            ],
          },
        ],
      });
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "students Percentage",
          data: Results,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Data Found",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  static async getPercentageMarksOfOrdinaryStudentsInSpecificSchool(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const userSchoolId = Token.userSchooldbId;
      const Results = await results.findAll({
        attributes: [
          "examId",
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("examId")), "AssessmentCount"],
        ],
        group: ["examId", "exam.id"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          { model: exams, attributes: [[Sequelize.col("name"), "Name"]] },
          {
            model: students,
            where: { schoolId: userSchoolId, level: "S3" },
            attributes: [],
          },
        ],
        // }]
      });
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "student with total",
          data: Results,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Data Found",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Server error :" + error.message,
      });
    }
  }

  //Admin
  static async getPercentageResultBasedOnGenderInPrimary(req, res) {
    try {
      
      const Results = await results.findAll({
        attributes: [[Sequelize.fn("sum", Sequelize.col("marks")), "total"],
                     [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],],
        group: ["student.id"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          {
            model: students,
            where: {  level: "P6" },
            attributes: [
              [Sequelize.col("gender"), "gender"],
            ],
          },
        ],
      
      });

      console.log('data..:',Results[0])
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "students Percentage",
          data: Results,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Data Found",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  static async findOneResult(req, res) {
    try {
      const modelId = req.params.id;
      const singleResult = await results.findOne({
        where: { id: modelId },
      });
      if (singleResult) {
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
  static async getMyResult(req, res) {
    try {
      const examId = req.params.id;
      const token = req.headers["token"];
      const payload = await decode(token);
      const studentId = payload.dbStudentId;
      const foundExam = await results.findOne({
        where: { examId: examId, studentId: studentId },
      });
      if (foundExam) {
        const StudentResult = await results.findOne({
          where: {
            studentId: studentId,
          },
          order: [["id", "ASC"]],
          include: [{ model: exams }],
        });
        if (StudentResult) {
          return res.status(200).json({
            status: 200,
            message: "Student Result ",
            result: StudentResult,
          });
        }
        return res.status(200).json({
          status: 200,
          message: "No Result found",
        });
      }
      return res.status(404).json({
        status: 404,
        message: "Result for Exam bellow not found",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
    }
  }
}

export default resultController;

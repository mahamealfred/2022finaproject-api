import Models from "../database/models";
import { v4 as uuidv4 } from "uuid";
import { decode } from "../helpers/jwtTokenizer";
const { results, exams, students, schools, districts } = Models;
import { Sequelize } from "sequelize";

class resultController {
  static async addResult(req, res) {
    try {
      const { marks, examId } = req.body;
      const token = req.headers["token"];
      const Token = await decode(token);
      const studentId = Token.dbStudentId;
      const createdResult = await results.create({
        id: uuidv4(),
        marks,
        examId,
        studentId: studentId,
      });
      return res.status(200).json({
        status: 200,
        message: "Result have been added",
        data: createdResult,
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
  static async getPrimaryLevelResult(req, res) {
    try {
      const Results = await results.findAll({
        include: [
          {
            model: exams,
          },
          {
            model: students,
            where:{level:"P6"}
          },
        ],
      });
      res.status(200).json({
        status: 200,
        message: "All Primary Level  Results",
        data: Results,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: "server error" });
    }
  }
  static async getOrdinaryLevelResult(req, res) {
    try {
      const Results = await results.findAll({
        include: [
          {
            model: exams,
          },
          {
            model: students,
            where:{level:"S3"}
          },
        ],
      });
      res.status(200).json({
        status: 200,
        message: "All Primary Level  Results",
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
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
        ],

        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          {
            model: students,
            where: { schoolId: userSchoolId, level: "P6" },
            attributes: [],
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
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("studentId")), "studentCount"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
        ],
        group: ["student.gender"],
        raw: true,
        order: Sequelize.literal("total ASC"),
        include: [
          {
            model: students,
            where: { schoolId: userSchoolId, level: "P6" },
            attributes: ["gender"],
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
  static async getPercentageResultBasedOnGenderByDistrictUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const DistrictId = Token.userDistrictdbId;
      const findSchool=await schools.findOne({
        where:{districtId:DistrictId}
      })
     
      if (findSchool) {
        req.school = findSchool
       
     }
     let schlId=req.school.id 
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("studentId")), "studentCount"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
        ],
        group: ["student.gender"],
        raw: true,
        order: Sequelize.literal("total ASC"),
        include: [
          {
            model: students,
            where: { schoolId: schlId, level: "P6" },
            attributes: ["gender"],
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
  static async getPrimaryPercentageResultBasedOnGenderByAdmin(req, res) {
    try {
      const SchoolId = req.params.id;
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("studentId")), "studentCount"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
        ],
        group: ["student.gender"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          {
            model: students,
            where: { schoolId: SchoolId, level: "P6" },
            attributes: ["gender"],
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
  static async getOrdinaryPercentageResultBasedOnGenderByAdmin(req, res) {
    try {
      const SchoolId = req.params.id;
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("studentId")), "studentCount"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
        ],
        group: ["student.gender"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          {
            model: students,
            where: { schoolId: SchoolId, level: "S3" },
            attributes: ["gender"],
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
  static async getPercentageMarksOfOrdinaryLevelStudentsInSpecificSchoolByAdmin(req, res) {
    try {
      
      const SchoolId = req.params.id;
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
            where: { schoolId: SchoolId, level: "S3" },
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
  static async getPercentageMarksOfPrimaryStudentsInSpecificSchoolByAdmin(req, res) {
    try {
    
      const SchoolId = req.params.id;
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
            where: { schoolId:SchoolId, level: "P6" },
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
  static async getPercentageResultBasedOnGenderInOrdinaryBySchoolUser(
    req,
    res
  ) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const userSchoolId = Token.userSchooldbId;
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("studentId")), "studentCount"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
        ],
        group: ["student.gender"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          {
            model: students,
            where: { schoolId: userSchoolId, level: "S3" },
            attributes: ["gender"],
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
  static async getPercentageResultBasedOnGenderInPrimaryByDistrictUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const DistrictId = Token.userDistrictdbId;
      const findSchool=await schools.findAll({
        where:{districtId:DistrictId}
      })
     
      if (findSchool) {
        req.school = findSchool
       
     }
     let schlId=[]
     for(const i in req.school){
       schlId=req.school[i].id
      console.log("schoolss ...",req.school[i].id);
     }
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
          [Sequelize.fn("COUNT", Sequelize.col("studentId")), "studentCount"],
          [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
        ],
        group: [[Sequelize.col("student.gender"), "gender"]],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: {
          model: students,
          where: {schoolId:schlId, level: "P6" },
          attributes: ["gender"],
        },
      });
      // console.log('data..:',Results[0].total)
      console.log("female data..:", Results[0]["student.gender"]);
      console.log("female data..:", Results[1]["student.gender"]);
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "Students Percentage",
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
  static async getPercentageResultBasedOnGenderInOrdinaryByDistrictUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const DistrictId = Token.userDistrictdbId;
      const findSchool=await schools.findAll({
        where:{districtId:DistrictId}
      })
     
      if (findSchool) {
        req.school = findSchool
       
     }
     let schlId=[]
     for(const i in req.school){
       schlId=req.school[i].id
      console.log("schoolss ...",req.school[i].id);
     }
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
          [Sequelize.fn("COUNT", Sequelize.col("studentId")), "studentCount"],
          [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
        ],
        group: [[Sequelize.col("student.gender"), "gender"]],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: {
          model: students,
          where: {schoolId:schlId, level: "S3" },
          attributes: ["gender"],
        },
      });
      // console.log('data..:',Results[0].total)
      console.log("female data..:", Results[0]["student.gender"]);
      console.log("female data..:", Results[1]["student.gender"]);
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "Students Percentage",
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
  //Admin
  static async getPercentageResultBasedOnGenderInPrimary(req, res) {
    try {
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
          [Sequelize.fn("COUNT", Sequelize.col("studentId")), "studentCount"],
          [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
        ],
        group: [[Sequelize.col("student.gender"), "gender"]],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: {
          model: students,
          where: { level: "P6" },
          attributes: ["gender"],
        },
      });
      // console.log('data..:',Results[0].total)
      console.log("female data..:", Results[0]["student.gender"]);
      console.log("female data..:", Results[1]["student.gender"]);
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "Students Percentage",
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
  static async getPercentageResultBasedOnGenderInOrdinaryLevel(req, res) {
    try {
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
          [Sequelize.fn("COUNT", Sequelize.col("studentId")), "studentCount"],
          [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
        ],
        group: [[Sequelize.col("student.gender"), "gender"]],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: {
          model: students,
          where: { level: "S3" },
          attributes: ["gender"],
        },
      });
      // console.log('data..:',Results[0].total)
      console.log("female data..:", Results[0]["student.gender"]);
      //console.log("female data..:", Results[1]["student.gender"]);
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "Students Percentage Rseult based on Gender",
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
  static async getPercentageResultOfPriamryStudentsInAllAssessment(req, res) {
    try {
      const Results = await results.findAll({
        attributes: [
          "examId",
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
          [Sequelize.fn("COUNT", Sequelize.col("examId")), "AssessmentCount"],
        ],
        group: ["examId", "exam.id"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          { model: exams, attributes: [[Sequelize.col("name"), "Name"]] },
          {
            model: students,
            where: { level: "P6" },
            attributes: [],
          },
        ],
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
  static async getPercentageResultOfPriamryStudentsInAllAssessmentByDistrictUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const DistrictId = Token.userDistrictdbId;
      const findSchool=await schools.findAll({
        where:{districtId:DistrictId}
      })
     
      if (findSchool) {
        req.school = findSchool
       
     }
     let schlId=[]
     for(const i in req.school){
       schlId=req.school[i].id
      
     }
   
      const Results = await results.findAll({
        attributes: [
          "examId",
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
          [Sequelize.fn("COUNT", Sequelize.col("examId")), "AssessmentCount"],
        ],
        group: ["examId", "exam.id"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          { model: exams, attributes: [[Sequelize.col("name"), "Name"]] },
          {
            model: students,
            where: {schoolId:schlId, level: "P6" },
            attributes: [],
          },
        ],
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
  static async getPercentageResultOfOrdinaryStudentsInAllAssessmentByDistrictUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const DistrictId = Token.userDistrictdbId;
      const findSchool=await schools.findAll({
        where:{districtId:DistrictId}
      })
     
      if (findSchool) {
        req.school = findSchool
       
     }
     let schlId=[]
     for(const i in req.school){
       schlId=req.school[i].id
      
     }
   
      const Results = await results.findAll({
        attributes: [
          "examId",
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
          [Sequelize.fn("COUNT", Sequelize.col("examId")), "AssessmentCount"],
        ],
        group: ["examId", "exam.id"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          { model: exams, attributes: [[Sequelize.col("name"), "Name"]] },
          {
            model: students,
            where: {schoolId:schlId, level: "S3" },
            attributes: [],
          },
        ],
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
  static async getPercentageResultOfOrdinaryStudentsInAllAssessment(req, res) {
    try {
      const Results = await results.findAll({
        attributes: [
          "examId",
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
          [Sequelize.fn("COUNT", Sequelize.col("examId")), "AssessmentCount"],
        ],
        group: ["examId", "exam.id"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          { model: exams, attributes: [[Sequelize.col("name"), "Name"]] },
          {
            model: students,
            where: { level: "S3" },
            attributes: [],
          },
        ],
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
  static async getPrimarySchoolPerformanceByDistrictUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const DistrictId = Token.userDistrictdbId;
      const findSchool=await schools.findAll({
        where:{districtId:DistrictId}
      })
     
      if (findSchool) {
        req.school = findSchool
       
     }
     let schlId=[]
     for(const i in req.school){
       schlId=req.school[i].id
      
     }
      const Results = await students.findAll({
        where: {schoolId:schlId, level: "P6" },
        attributes: [],

        raw: true,
        group: ["schoolId", "school.id"],
        include: [
          {
            model: results,
            attributes: [
              [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
              [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
            ],
            raw: true,
            order: Sequelize.literal("total ASCE"),
          },
          {
            model: schools,
            where:{districtId:DistrictId},
            attributes: ["name"],
          },
        ],
      });
      console.log("results..", Results[0]["school.name"]);

      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "School Performance",
          data: Results,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Data Found",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
    }
  }
  static async getOrdinaryLevelSchoolPerformanceByDistrictUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const DistrictId = Token.userDistrictdbId;
      const findSchool=await schools.findAll({
        where:{districtId:DistrictId}
      })
     
      if (findSchool) {
        req.school = findSchool
       
     }
     let schlId=[]
     for(const i in req.school){
       schlId=req.school[i].id
      
     }
      const Results = await students.findAll({
        where: {schoolId:schlId, level: "S3" },
        attributes: [],

        raw: true,
        group: ["schoolId", "school.id"],
        include: [
          {
            model: results,
            attributes: [
              [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
              [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
            ],
            raw: true,
            order: Sequelize.literal("total ASCE"),
          },
          {
            model: schools,
            where:{districtId:DistrictId},
            attributes: ["name"],
          },
        ],
      });
      console.log("results..", Results[0]["school.name"]);

      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "School Performance",
          data: Results,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Data Found",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
    }
  }
  static async getTopPrimarySchool(req, res) {
    try {
      const Results = await students.findAll({
        where: { level: "P6" },
        attributes: [],

        raw: true,
        group: ["schoolId", "school.id"],
        include: [
          {
            model: results,
            attributes: [
              [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
              [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
            ],
            raw: true,
            order: Sequelize.literal("avarage DESC"),
          },
          {
            model: schools,

            attributes: ["name"],
          },
        ],
      });
      console.log("results..", Results[0]["school.name"]);

      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "School Performance",
          data: Results,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Data Found",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
    }
  }
  
  static async getTopOrdinarySchool(req, res) {
    try {
      const Results = await students.findAll({
        where: { level: "S3" },
        attributes: [],

        raw: true,
        group: ["schoolId", "school.id"],
        include: [
          {
            model: results,
            attributes: [
              [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
              [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
            ],
            raw: true,
            order: Sequelize.literal("total ASC"),
          },
          {
            model: schools,

            attributes: ["name"],
          },
        ],
      });
      console.log("results..", Results[0]["school.name"]);

      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "Schools Performance",
          data: Results,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Data Found",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
    }
  }
  static async getDifferentInPerformanceForPrimaryStudentByAdmin(req, res) {
    try {
      const SchoolId=req.params.id;
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
        ],
        raw: true,
        order: Sequelize.literal("avarage ASC"),
        group: [ "studentId","student.id"],
        include: [
          {
            model: students,
            where: { level: "P6" ,schoolId:SchoolId},
            attributes: [],
            raw: true,    
          },
         
        ],
      });
      console.log("results..", Results);

      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "Assessment result Performance",
          data: Results,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Data Found",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
    }
  }
  static async getDifferentInPerformanceForOrdinaryLevlStudentByAdmin(req, res) {
    try {
      const SchoolId=req.params.id;
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("AVG", Sequelize.col("marks")), "avarage"],
        ],
        raw: true,
        order: Sequelize.literal("total DESC"),
        group: [ "studentId","student.id"],
        include: [
          {
            model: students,
            where: { level: "S3" ,schoolId:SchoolId},
            attributes: [],
            raw: true,    
          },
         
        ],
      });
      console.log("results..", Results);

      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "Assessment result Performance In ordinary Levl",
          data: Results,
        });
      }
      return res.status(404).json({
        status: 404,
        message: "No Data Found",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "server error:" + error.message });
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
  static async getPrimaryLevelStudentsResultByDistrictUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const DistrictId = Token.userDistrictdbId;
      const findSchool=await schools.findAll({
        where:{districtId:DistrictId}
      })
     
      if (findSchool) {
        req.school = findSchool
       
     }
     let schlId=[]
     for(const i in req.school){
       schlId=req.school[i].id
      
     }
   
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
        ],
        group: ["student.id"],
        raw: true,
        order: Sequelize.literal("total ASC"),
        include: [
          {
            model: students,
            where: { schoolId:schlId,level: "P6" },
            attributes: ["id",'firstname','lastname'],
          },
        ],
      });
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "All primary Students Percentage",
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
  static async getOrdinaryLevelStudentsResultByDistrictUser(req, res) {
    try {
      const token = req.headers["token"];
      const Token = await decode(token);
      const DistrictId = Token.userDistrictdbId;
      const findSchool=await schools.findAll({
        where:{districtId:DistrictId}
      })
     
      if (findSchool) {
        req.school = findSchool
       
     }
     let schlId=[]
     for(const i in req.school){
       schlId=req.school[i].id
      
     }
   
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
        ],
        group: ["student.id"],
        raw: true,
        order: Sequelize.literal("total ASC"),
        include: [
          {
            model: students,
            where: { schoolId:schlId,level: "S3" },
            attributes: ["id",'firstname','lastname'],
          },
        ],
      });
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "All Ordinary Students Percentage",
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

  static async getPrimaryLevelStudentsResult(req, res) {
    try {
     
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
        ],
        group: ["student.id"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          {
            model: students,
            where: { level: "P6" },
            attributes: ["id",'firstname','lastname','studentcode','gender','level'],
          },
        ],
      });
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "All primary Students Percentage",
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
  static async getOrdinaryLevelStudentsResult(req, res) {
    try {
     
      const Results = await results.findAll({
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("marks")), "total"],
          [Sequelize.fn("COUNT", Sequelize.col("marks")), "AssessmentCount"],
        ],
        group: ["student.id"],
        raw: true,
        order: Sequelize.literal("total DESC"),
        include: [
          {
            model: students,
            where: { level: "S3" },
            attributes: ["id",'firstname','lastname','studentcode','gender','level'],
          },

        ],
      });
      if (Results) {
        console.log(Results);
        return res.status(200).json({
          status: 200,
          message: "All Ordinary Level Students Percentage",
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
}

export default resultController;

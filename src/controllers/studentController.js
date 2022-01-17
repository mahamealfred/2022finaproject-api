import Models from "../database/models";
import bcrypt from "bcrypt";
import { encode } from "../helpers/jwtTokenizer";
import studentcoder from "../helpers/studentcoder";
import generateRandomPassword from "../helpers/passwordGenerator";
import { v4 as uuidv4 } from "uuid";
import CheckStudent from "../middleware/CheckStudent";
const { students, schools } = Models;

class studentController {
  static async addStudent(req, res) {
    try {
      const { firstname, lastname, email,dob, gender, level,schoolId} = req.body;
     // const salt = await bcrypt.genSaltSync(10);
     // const hashPassword = await bcrypt.hashSync(password, salt);
      const studentCode = await studentcoder();
      const password = generateRandomPassword();
      const found = await schools.findOne({
        where: { id: schoolId },
      });
      if (req.student) {
        return res.status(400).json({
          status: 400,
          message: "Student with email already exist please use onather!",
        });
      }
      if (found) {
        await students.create({
          id: uuidv4(),
          firstname,
          lastname,
          studentcode: studentCode,
          email,
          dob,
          gender,
          level,
          schoolId,
          password,
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
      const { firstname,lastname,email,dob,level}=req.body;
      const modelId= req.params.id;
     
      const found = await students.findOne({
        where: { id: modelId},
      });
     
      if (found) {
        
          const updatedStudent = await students.update({
            firstname,
            lastname,
            email,
            dob,
            level,
           
          }, {
            where: { id: modelId },
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
        message: "Student not found",
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: "server  error"+error.message });
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
          message: "Student deleted",
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
      if (singleStudent) {
       return res.status(200).json({
          status: 200,
          message: "retrieved one Student",
          data: singleStudent,
        });
      }
     return res.status(404).json({
        status: 404,
        message: "Student not  found",
      });
    } catch (error) {
      console.log(error);
    return  res.status(500).json({ status: 500, message: "server error" });
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

  static async getAllprimaryStudent(req, res) {
    try {
    
      const TotalStudent = await students.findAll({
        where: { level: "P6" },
      });
      const TotalCount = await students.count({
        where: { level: "P6" },
      });
      if (TotalStudent) {
       return res.status(200).json({
          status: 200,
          message: "retrieved All Primary Students",
          count:TotalCount,
          data: TotalStudent,
          
        });
      }
     return res.status(404).json({
        status: 404,
        message: "Student not  found",
      });
    } catch (error) {
      console.log(error);
     return res.status(500).json({ status: 500, message: "server error" });
    }
}
static async getAllOrdinaryLevelStudent(req, res) {
  try {
  
    const TotalStudent = await students.findAll({
      where: { level: "S3" },
    });
    const TotalCount = await students.count({
      where: { level: "S3" },
    });
    if (TotalStudent) {
    return  res.status(200).json({
        status: 200,
        message: "retrieved All Ordinary Level Students",
        count:TotalCount,
        data: TotalStudent,
        
      });
    }
   return  res.status(404).json({
      status: 404,
      message: "Student not  found",
    });
  } catch (error) {
    console.log(error);
   return res.status(500).json({ status: 500, message: "server error" });
  }
}
static async getAllOrdinaryLevelMaleStudent(req, res) {
  try {
  
    const { count, rows: Students } = await students.findAndCountAll({
      where: {
        gender: 'male',
        level:'S3',
      },
      order: [['id', 'ASC']],
      
    });
  
    if (Students) {
    return  res.status(200).json({
        status: 200,
        message: "retrieved All Male Ordinary Level Students",
        count:count,
        data: Students,
        
      });
    }
   return  res.status(404).json({
      status: 404,
      message: "Student not  found",
    });
  } catch (error) {
    console.log(error);
   return res.status(500).json({ status: 500, message: "server error" });
  }
}

static async getAllOrdinaryLevelFemaleStudent(req, res) {
  try {
  
    const { count, rows: Students } = await students.findAndCountAll({
      where: {
        gender: 'female',
        level:'S3',
      },
      order: [['id', 'ASC']],
      
    });
  
    if (Students) {
    return  res.status(200).json({
        status: 200,
        message: "retrieved All Female Ordinary Level Students",
        count:count,
        data: Students,
        
      });
    }
   return  res.status(404).json({
      status: 404,
      message: "Student not  found",
    });
  } catch (error) {
    console.log(error);
   return res.status(500).json({ status: 500, message: "server error" });
  }
}

static async getAllPrimaryLevelFemaleStudent(req, res) {
  try {
  
    const { count, rows: Students } = await students.findAndCountAll({
      where: {
        gender: 'female',
        level:'P6',
      },
      order: [['id', 'ASC']],
      
    });
  
    if (Students) {
    return  res.status(200).json({
        status: 200,
        message: "retrieved All Female Primary Level Students",
        count:count,
        data: Students,
        
      });
    }
   return  res.status(404).json({
      status: 404,
      message: "Student not  found",
    });
  } catch (error) {
    console.log(error);
   return res.status(500).json({ status: 500, message: "server error" });
  }
}

static async getAllPrimaryLevelMaleStudent(req, res) {
  try {
  
    const { count, rows: Students } = await students.findAndCountAll({
      where: {
        gender: 'male',
        level:'P6',
      },
      order: [['id', 'ASC']],
      
    });
  
    if (Students) {
    return  res.status(200).json({
        status: 200,
        message: "retrieved All Male Primary Level Students",
        count:count,
        data: Students,
        
      });
    }
   return  res.status(404).json({
      status: 404,
      message: "Student not  found",
    });
  } catch (error) {
    console.log(error);
   return res.status(500).json({ status: 500, message: "server error" });
  }
}

}

export default studentController;

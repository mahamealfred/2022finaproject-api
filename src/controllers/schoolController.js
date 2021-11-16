import Models from "../database/models";

const { schools } = Models;

class schoolController {
  static async addSchool(req, res) {
    try {
        if (req.school) {
            return res.status(400).json({
              status: 400,
              message: "School with this name already exist, please use onather!",
            });
          }
      const { name, province, district, sector, cell, level } = req.body;
      await schools.create({
        name,
        province,
        district,
        sector,
        cell,
        level
      });
      return res.status(200).json({
        status: 200,
        message: "School have been added",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
  static async getAllSchool(req, res) {
    try {
      const schoolsData = await schools.findAll();
      res.status(200).json({
        status: 200,
        message: "All School",
        data: schoolsData,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: "server error" });
    }
  }

  static async updateSchool(req, res) {
    try {
      const updateSchool = {
        name: req.body.name,
        province: req.body.province,
        district: req.body.district,
        sector: req.body.sector,
        cell: req.body.cell,
        level: req.body.level,
      };
     const modelId=req.params.id
     const found = await schools.findOne({
      where: { id: modelId },
    });
     if(found){
      const updatedSchool = await schools.update(updateSchool, {
        where: {id: modelId},
        returning: true,
      });
     return res.status(200).json({
        status: 200,
        message: "School updated successfull!",
        data: updatedSchool,
      });
     }
    return res.status(404).json({
      status: 404,
      message: "School not found"
    });
      
    } catch (error) {
     return res.status(500).json({ status: 500, message: "server error" });
    }
  }

  static async deleteSchool(req, res) {
    try {
      const modelId = req.params.id;
      const found = await schools.findOne({
        where: { id: modelId },
      });
      if (found) {
        await schools.destroy({
          where: { id: modelId },
        });
        return res.status(200).json({
          status: 200,
          message: "School was deleted successfull!",
        });
      }
      res.status(404).json({
        status: 404,
        message: "School not found",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: "server error" });
    }
  }
  static async findOneSchool(req, res) {
    try {
      const modelId = req.params.id;
      const singleSchool = await schools.findOne({
        where: { id: modelId },
      });
      if(!singleSchool){
        res.status(404).json({
            status: 404,
            message: "School not found ",
            
          });
      }
      res.status(200).json({
        status: 200,
        message: "School Information",
        data: singleSchool,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 500, message: "server error" });
    }
  }
}

export default schoolController;

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      questions.belongsTo(models.exams, {
        foreignKey: "examId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  questions.init(
    {
      question: DataTypes.STRING,
      correct_answer: DataTypes.STRING,
      incorrect_answer: {
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue("incorrect_answer"));
        },
        set: function (value) {
          return this.setDataValue("incorrect_answer", JSON.stringify(value));
        },
      },
      examId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "questions",
    }
  );
  return questions;
};

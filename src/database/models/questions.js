'use strict';
const {
  Model
} = require('sequelize');
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
        foreignKey:'examId',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
    }
  };
  questions.init({
    question: DataTypes.STRING,
    options: DataTypes.ARRAY(DataTypes.STRING),
    answer: DataTypes.INTEGER,
    examId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'questions',
  });
  return questions;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class exams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      exams.hasMany(models.questions,{
        foreignKey:'examId',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
      exams.hasMany(models.results,{
        foreignKey:'examId',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
    }
  };
  exams.init({
    name: DataTypes.STRING,
    subject: DataTypes.STRING,
    startDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'exams',
  });
  return exams;
};
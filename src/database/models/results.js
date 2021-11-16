'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class results extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      results.belongsTo(models.students, {
        foreignKey:'studentId',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
       results.belongsTo(models.exams, {
        foreignKey:'examId',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
     
    }
  };
  results.init({
    marks: DataTypes.FLOAT,
    examId: DataTypes.INTEGER,
    studentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'results',
  });
  return results;
};
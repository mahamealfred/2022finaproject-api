'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class students extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      students.belongsTo(models.schools, {
        foreignKey:'schoolId',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
      students.hasMany(models.results,{
        foreignKey:'studentId',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
     
    
  }
  };
  students.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    studentcode: DataTypes.STRING,
    password: DataTypes.STRING,
    dob: DataTypes.DATE,
    gender: DataTypes.STRING,
    schoolId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'students',
  });
  return students;
};
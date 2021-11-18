'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class schools extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      schools.hasMany(models.students,{
        foreignKey:'schoolId',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
      schools.hasMany(models.users,{
        foreignKey:'schoolId',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
    }
    
  };
  schools.init({
    name: DataTypes.STRING,
    province: DataTypes.STRING,
    district: DataTypes.STRING,
    sector: DataTypes.STRING,
    cell: DataTypes.STRING,
    level: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'schools',
  });
  return schools;
};
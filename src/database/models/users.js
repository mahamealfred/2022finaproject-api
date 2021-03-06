"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.belongsTo(models.schools, {
        foreignKey: "schoolId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      users.belongsTo(models.districts, {
        foreignKey: "districtId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  users.init(
    {
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      schoolId: DataTypes.STRING,
      districtId:DataTypes.STRING,
      role: DataTypes.STRING,
      resetlink: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};

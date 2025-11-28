import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Planet = sequelize.define("Planet", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true },
  description: { type: DataTypes.STRING },
});

export default Planet;

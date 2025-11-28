import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import { User } from "./User";
import  Planet  from "./Planet";

const Proposal = sequelize.define("Proposal", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  status: {
    type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
    defaultValue: "PENDING",
  }
});

// FK relationships
Proposal.belongsTo(User, { foreignKey: "creatorId" });
Proposal.belongsTo(Planet, { foreignKey: "planetId" });

export default Proposal;

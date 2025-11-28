import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import Proposal from "./Proposal";
import { User } from "./User";

const Vote = sequelize.define("Vote", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  vote: { type: DataTypes.ENUM("YES", "NO") }
});

// FK
Vote.belongsTo(Proposal, { foreignKey: "proposalId" });
Vote.belongsTo(User, { foreignKey: "userId" });

export default Vote;

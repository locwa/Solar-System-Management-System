import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import bcrypt from 'bcrypt';


interface UserAttributes {
UserID: number;
Username: string;
Password: string;
FullName: string;
Role: 'Citizen' | 'PlanetaryLeader' | 'GalacticLeader';
IsGalacticLeader: boolean;
}


interface UserCreationAttributes extends Optional<UserAttributes, 'UserID'> {}


export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
public UserID!: number;
public Username!: string;
public Password!: string;
public FullName!: string;
public Role!: 'Citizen' | 'PlanetaryLeader' | 'GalacticLeader';
public IsGalacticLeader!: boolean;


// helper
public async checkPassword(password: string) {
return bcrypt.compare(password, this.Password);
}
}


User.init({
UserID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
Username: { type: DataTypes.STRING, allowNull: false, unique: true },
Password: { type: DataTypes.STRING, allowNull: false },
FullName: { type: DataTypes.STRING, allowNull: false },
Role: { type: DataTypes.ENUM('Citizen','PlanetaryLeader','GalacticLeader'), allowNull: false, defaultValue: 'Citizen' },
IsGalacticLeader: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, { sequelize, modelName: 'User' });

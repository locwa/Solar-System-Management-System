import { Sequelize, Options } from 'sequelize';
import config from './config.json';

interface DbConfig {
  username?: string;
  password?: string;
  database: string;
  host?: string;
  port?: number;
  dialect: Options["dialect"];
  url?: string;
  dialectOptions?: {
    ssl?: {
      require?: boolean;
      rejectUnauthorized?: boolean;
    };
  };
}

interface Config {
  development: DbConfig;
  test: DbConfig;
  production: DbConfig;
  [key: string]: DbConfig; // Allow dynamic indexing
}

const env = process.env.NODE_ENV || 'development';
const dbConfig: DbConfig = (config as Config)[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username || '',
  dbConfig.password || '',
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    logging: false,
  }
);

export default sequelize;

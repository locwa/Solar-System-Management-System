// config/database.ts
import { Sequelize } from 'sequelize';

let sequelize: Sequelize | null = null;

export default function getSequelize(): Sequelize {
  if (!sequelize) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false,
    });
  }

  return sequelize;
}
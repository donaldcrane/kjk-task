import { Sequelize } from "sequelize-typescript";
import { Post } from "../posts/posts.entity";
import { User } from "src/auth/user.entity";
import * as dotenv from "dotenv";

dotenv.config();

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: "postgres",
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });

      sequelize.addModels([Post, User]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

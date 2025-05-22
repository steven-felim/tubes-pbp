import express, { json } from "express";
import { postRouter } from "./routers/PostRouter";
import { authRouter } from "./routers/AuthRouter";
import { Sequelize } from "sequelize-typescript";
import { User } from "./models/User";
import { Category } from "./models/Category"; 
import { Thread } from "./models/Thread";
import { Post } from "./models/Post";
import { Session } from "./models/Session";


import config from "./config/config.json";
import { SequelizeOptions } from "sequelize-typescript";
import { userRouter } from "./routers/UserRouter";

const sequelize = new Sequelize({
  ...config.development,
  models: [User, Category, Thread, Post, Session],
} as SequelizeOptions);

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err: Error) => {
    console.error('Unable to connect to the database:', err);
  });

const app = express();
app.use(json());

// middlewares

// post require auth
app.use("/user", userRouter);
app.use("/", authRouter);
app.use("/category", authRouter);
app.use("/thread", authRouter);
app.use("/post", postRouter);
app.use("/post", postRouter, authRouter);

app.listen(3000, () => {
  console.log("App started at port 3000");
});

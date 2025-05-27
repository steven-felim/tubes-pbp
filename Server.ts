import express, { json } from "express";
import { postRouter } from "./routers/PostRouter";
import { authRouter } from "./routers/AuthRouter";
import { Sequelize } from "sequelize-typescript";
import { User } from "./models/User";
import { Category } from "./models/Category"; 
import { Thread } from "./models/Thread";
import { Post } from "./models/Post";
import { Session } from "./models/Session";
import { ThreadCategory } from "./models/ThreadCategory";
import config from "./config/config.json";
import { SequelizeOptions } from "sequelize-typescript";
import { userRouter } from "./routers/UserRouter";
import { threadRouter } from "./routers/ThreadRouter";
import { categoryRouter } from "./routers/CategoryRouter";
import cors from "cors";

const sequelize = new Sequelize({
  ...config.development,
  models: [User, Category, Thread, ThreadCategory, Post, Session],
} as SequelizeOptions);

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err: Error) => {
    console.error('Unable to connect to the database:', err);
  });

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(json());

// Perbaikan route yang benar
app.use("/api", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/threads", threadRouter);
app.use("/api/posts", postRouter);
app.use("/api", authRouter);


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err.message);
  res.status(400).json({ message: err.message });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
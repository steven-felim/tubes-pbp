import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// In-memory users list for testing
export const users: User[] = [
  {
    id: uuidv4(),
    name: "alice",
    email: "alice@example.com",
    password: "password123",
  },
  {
    id: uuidv4(),
    name: "bob",
    email: "bob@example.com",
    password: "qwerty456",
  },
  {
    id: uuidv4(),
    name: "charlie",
    email: "charlie@example.com",
    password: "letmein789",
  },
];

// Adjust your DB config here
// const sequelize = new Sequelize({
//   dialect: "sqlite", // or "postgres", etc.
//   storage: "./database.sqlite", // update as needed
//   models: [User],
// });

// async function seed() {
//   await sequelize.sync();

//   const users = [
//     {
//       id: uuidv4(),
//       username: "alice",
//       email: "alice@example.com",
//       password: "password123",
//     },
//     {
//       id: uuidv4(),
//       username: "bob",
//       email: "bob@example.com",
//       password: "qwerty456",
//     },
//     {
//       id: uuidv4(),
//       username: "charlie",
//       email: "charlie@example.com",
//       password: "letmein789",
//     },
//   ];

//   await User.bulkCreate(users);
//   console.log("Users seeded.");
//   await sequelize.close();
// }

// seed().catch((err) => {
//   console.error("Error seeding users:", err);
// });
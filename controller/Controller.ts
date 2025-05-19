import express, { Request, Response } from "express";
import { login, authenticate, logout } from "./Authorization"; 
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Route to log in and create a session
app.post("/login", login);

// Protected route that requires authorization
app.get("/protected", authenticate, (req: Request, res: Response) => {
  res.json({ message: "This is protected data.", user: req.user });
});

// Route to log out and delete the session
app.post("/logout", authenticate, logout);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
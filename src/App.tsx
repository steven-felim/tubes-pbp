// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Threads from "./pages/Threads";
import ThreadDetail from "./pages/ThreadDetail";
import CreatePost from "./pages/CreatePost";
import CreateThread from "./pages/CreateThread";
import CreateCategory from "./pages/CreateCategory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/threads" element={<Threads />} />
        <Route path="/threads/:id" element={<ThreadDetail />} />
        <Route path="/create-thread" element={<CreateThread />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/create-category" element={<CreateCategory />} />
        {/* Add any additional routes here */}
      </Routes>
    </Router>
  );
}

export default App;

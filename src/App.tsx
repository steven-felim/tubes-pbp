// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Threads from "./pages/Threads";
import ThreadDetail from "./pages/ThreadDetail";
import CreateThread from "./pages/CreateThread";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/me" element={<Profile />} />
        <Route path="/threads" element={<Threads />} />
        <Route path="/threads/:id" element={<ThreadDetail />} />
        <Route path="/ask" element={<CreateThread />} />
        {/* Add any additional routes here */}
      </Routes>
    </Router>
  );
}

export default App;

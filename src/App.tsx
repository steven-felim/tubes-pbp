import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import Threads from "./pages/Threads";
import ThreadDetail from "./pages/ThreadDetail";
import CreateThread from "./pages/CreateThread";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/me" element={<Profile />} />
        <Route path="/me/edit" element={<EditProfile />} />
        <Route path="/me/password" element={<ChangePassword />} />
        <Route path="/threads" element={<Threads />} />
        <Route path="/threads/:threadId" element={<ThreadDetail />} />
        <Route path="/ask" element={<CreateThread />} />
      </Routes>
    </Router>
  );
}

export default App;
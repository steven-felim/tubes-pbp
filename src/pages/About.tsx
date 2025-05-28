import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface TeamMember {
  name: string;
  nim: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Erwin Dosantos Wowa",
    nim: "1122049",
    description: "Focuses on UI/UX and React components. Responsible for wiring up APIs to the user interface.",
  },
  {
    name: "Steven Felim",
    nim: "1123002",
    description: "Focuses on APIs and models. Jumps into any part of the codebase that needs attention — from UI tweaks to backend fixes.",
  },
  {
    name: "Devan Lubianto",
    nim: "1119016",
    description: " ",
  },
];

const About: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);


  return (
    <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-white text-xl font-semibold">
                ForumKode
              </Link>
            </div>
            <div className="flex space-x-4">
              {isLoggedIn && (
                <Link to="/ask" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Ask Question</Link>
              )}
              <Link to="/about" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">About</Link>
              {isLoggedIn && (
                <Link to="/me" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
              )}
              {!isLoggedIn && (
                <Link to="/SignIn" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">SignIn</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
          About ForumKode
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
          ForumKode is a community-driven platform built for developers, by developers. Whether you're a seasoned engineer or just starting out, you can ask questions, share knowledge, and learn from others in the world of software development and IT.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700">
            We created ForumKode to provide a helpful, respectful, and collaborative environment for developers of all skill levels. Our goal is to make tech knowledge more accessible and build a space where asking questions is encouraged and helping others is rewarding.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600 mt-2">{member.nim}</p>
                <p className="text-sm text-gray-500 mt-1">{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What's Next?</h2>
          <p className="text-gray-700">
            We're constantly improving ForumKode. In the future, we plan to add features like live Q&A sessions, advanced reputation systems, and integrations with developer tools. Stay tuned!
          </p>
        </section>
      </main>
    </div>
  );
};

export default About;

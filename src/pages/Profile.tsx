import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

type Thread = {
  id: string;
  title: string;
  createdAt: string;
};

type Post = {
  id: string;
  content: string;
  threadId: string;
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  threads?: Thread[];
  posts?: Post[];
};

const Profile = () => {
  const { userId: paramUserId } = useParams<{ userId?: string }>();
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      if (!token) return;
      const res = await fetch("http://localhost:3000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const endpoint = paramUserId ? `http://localhost:3000/api/${paramUserId}` : `http://localhost:3000/api/me`;

        const res = await fetch(endpoint, { headers });
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setViewedUser(data);

        if (!paramUserId) {
          setCurrentUser(data);
        }

      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("User not found or an error occurred.");
      }
    };

    fetchProfileUser();
  }, [paramUserId]);

  const isCurrentUser = currentUser && viewedUser && currentUser.id === viewedUser.id;
  
  const handleSignOut = async () => {
    await fetch("http://localhost:3000/api/signout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDelete = async () => {
    const password = prompt("Enter your password to confirm deletion:");
    if (!password) return;

    const res = await fetch("http://localhost:3000/api/me", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      localStorage.removeItem("token");
      alert("Account deleted.");
      navigate("/");
    } else {
      const msg = await res.text();
      alert("Failed to delete account: " + msg);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!viewedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{viewedUser.name}</h2>
          <p className="text-gray-700 mb-1"><strong>Email:</strong> {viewedUser.email}</p>
          {viewedUser.createdAt && (
            <p className="text-gray-500 text-sm">
              Joined on {new Date(viewedUser.createdAt).toLocaleDateString()}
            </p>
          )}

          {isCurrentUser && (
            <div className="mt-6 flex space-x-4">
              <Link to="/me/edit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Edit Profile
              </Link>
              <Link to="/me/password" className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Change Password
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
              >
                Delete Account
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Profile;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Handle update profile logic here (e.g., API call)
  };

  const handleSignOut = async () => {
    try {
      // Optional: Call your API to clear cookies/sessions
      await fetch("/api/signout", {
        method: "POST", // Adjust to your backend's method
        credentials: "include", // If using cookies for auth
      });

      // Clear client-side token
      localStorage.removeItem("token");

      // Optionally navigate to login or home page after sign out
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setEmail(data.email || "");
          // Optional: store bio or other fields too
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
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
              <Link to="/ask" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                Ask Question
              </Link>
              <Link to="/about" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link to="/me" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="ml-4 px-8 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition flex items-center justify-center"
            >
              Sign Out
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProfile;

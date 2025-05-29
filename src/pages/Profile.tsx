import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:3000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setName(data.name);
          setEmail(data.email);
        } else {
          console.error("Failed to fetch profile:", await res.text());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await fetch("http://localhost:3000/api/signout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("token");

      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-white text-xl font-semibold">ForumKode</Link>
            <div className="flex space-x-4">
              <Link to="/ask" className="text-white hover:text-blue-400">Ask</Link>
              <Link to="/about" className="text-white hover:text-blue-400">About</Link>
              <Link to="/me" className="text-white hover:text-blue-400">Profile</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">My Profile</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-lg"><strong>Name:</strong> {name}</p>
          <p className="text-lg"><strong>Email:</strong> {email}</p>
          <div className="mt-6 flex space-x-4">
            <Link to="/me/edit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Edit Profile
            </Link>
            <Link to="/me/password" className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              Change Password
            </Link>
            <button
              type="button"
              onClick={() => {
                const password = prompt("Are you sure you want to delete your account? Please enter your password to confirm:");
                if (password) {
                    fetch("http://localhost:3000/api/me", {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    })
                    .then(async (res) => {
                      if (res.ok) {
                        localStorage.removeItem("token");
                        alert("Account deleted successfully.");
                        navigate("/");
                      } else {
                        const errorMsg = await res.text();
                        alert("Failed to delete account: " + errorMsg);
                      }
                    })
                    .catch((error) => {
                      alert("Error deleting account: " + error);
                    });
                }
              }}
              className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
            >
              Delete Account
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="ml-4 px-8 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition flex items-center justify-center"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

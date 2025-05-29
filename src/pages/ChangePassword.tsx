import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      const res = await fetch("http://localhost:3000/api/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (res.ok) {
        alert("Password updated successfully.");
        navigate("/me");
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      console.error("Error changing password:", err);
      alert("Error changing password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">Change Password</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <div className="mb-4">
            <label className="block mb-1">Current Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">New Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Update Password
          </button>
          <Link
            to="/me"
            className="ml-4 px-8 py-3 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 transition flex items-center justify-center"
        >
            Cancel
        </Link>
        </form>
      </main>
    </div>
  );
};

export default ChangePassword;

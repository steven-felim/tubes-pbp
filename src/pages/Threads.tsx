import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

type Thread = {
  id: number;
  title: string;
  content: string;
};

const AllThreads = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = ["Web Development", "Data Science", "Mobile Development", "DevOps"];

  useEffect(() => {
    // Fetch threads from API (example)
    // fetchThreads(selectedCategory).then(setThreads);
    setThreads([/* Simulated thread data */]);
  }, [selectedCategory]);

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
              <Link to="/ask" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Ask Question</Link>
              <Link to="/about" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">About</Link>
              <Link to="/me" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">All Threads</h2>

        <div className="mb-6">
          <label className="block text-gray-700">Filter by Category</label>
          <select
            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {threads.map((thread) => (
            <div key={thread.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">
                <Link to={`/thread/${thread.id}`}>{thread.title}</Link>
              </h3>
              <p className="mt-2 text-gray-600">{thread.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllThreads;

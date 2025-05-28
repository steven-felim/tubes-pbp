import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Category {
  name: string;
}

interface Thread {
  id: number;
  title: string;
  content: string;
  categories?: Category[];
}

const AllThreads = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get<Category[]>("http://localhost:3000/api/categories");
        setCategories(categoryRes.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const url = selectedCategoryId
          ? `http://localhost:3000/api/threads/category/${selectedCategoryId}`
          : `http://localhost:3000/api/threads`;
        const res = await axios.get<Thread[]>(url);
        setThreads(res.data);
      } catch (err) {
        console.error("Error fetching threads:", err);
      }
    };

    fetchThreads();
  }, [selectedCategoryId]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-white text-xl font-semibold">ForumKode</Link>
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">All Threads</h2>

        {/* Filter Dropdown */}
        <div className="mb-6">
          <label className="block text-gray-700">Filter by Category</label>
          <select
            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Thread List */}
        <div className="space-y-6">
          {threads.map((thread) => (
            <div key={thread.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">
                <Link to={`/threads/${thread.id}`}>{thread.title}</Link>
              </h3>
              <p className="mt-2 text-gray-600">{thread.content}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {thread.categories?.map((cat) => (
                  <span
                    key={cat.name}
                    className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
              <Link
                to={`/threads/${thread.id}`}
                className="mt-4 text-blue-600 hover:text-blue-800 block"
              >
                View Question
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllThreads;

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchData = async () => {
      try {
        const [catRes, threadRes] = await Promise.all([
          axios.get<Category[]>("http://localhost:3000/api/categories"),
          axios.get<Thread[]>("http://localhost:3000/api/threads"),
        ]);

        // Limit to max 4 categories and 3 threads
        setCategories(catRes.data.slice(0, 4));
        setThreads(threadRes.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
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
                <Link to="/ask" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                  Ask Question
                </Link>
              )}
              <Link to="/about" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              {isLoggedIn && (
                <Link to="/me" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">
            Welcome to ForumKode
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-lg mx-auto">
            A place to share knowledge, ask questions, and help others. Join the community of passionate developers!
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {!isLoggedIn && (
              <Link
                to="/signup"
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            )}
            <Link
              to="/threads"
              className="px-8 py-3 border border-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Explore Topics
            </Link>
          </div>
        </div>
      </main>

      {/* Categories Section */}
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Popular Categories</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.name} className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Questions Section */}
      <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Featured Questions</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {threads.map((thread) => (
            <div key={thread.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">{thread.title}</h3>
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
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} ForumKode. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

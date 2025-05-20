import { Link } from "react-router-dom";

const Home = () => {
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
            <Link
              to="/signup"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
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
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900">Web Development</h3>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900">Data Science</h3>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900">Mobile Development</h3>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900">DevOps</h3>
          </div>
        </div>
      </section>

      {/* Featured/Popular Questions */}
      <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Featured Questions</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900">
              How to create a responsive navbar in React?
            </h3>
            <p className="mt-2 text-gray-600">I'm trying to create a navbar in React that is responsive. Can someone help?</p>
            <Link
              to="/question/1"
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              View Question
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900">
              Best practices for API security
            </h3>
            <p className="mt-2 text-gray-600">What are the best practices for securing RESTful APIs?</p>
            <Link
              to="/question/2"
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              View Question
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900">
              How do I optimize large-scale React apps?
            </h3>
            <p className="mt-2 text-gray-600">What are some performance optimization techniques for React applications?</p>
            <Link
              to="/question/3"
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              View Question
            </Link>
          </div>
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

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                MyApp
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/features"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Features
              </Link>
              <Link
                to="/about"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/signin"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to MyApp
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-600">
            The best solution for all your needs. Join thousands of satisfied users today.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/features"
              className="px-8 py-3 bg-white text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} MyApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
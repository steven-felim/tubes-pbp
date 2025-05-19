import { useState } from "react";
import { Link } from "react-router-dom";

const CreateThread = () => {
  const [threadTitle, setThreadTitle] = useState("");
  const [threadContent, setThreadContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = ["Web Development", "Data Science", "Mobile Development", "DevOps"]; // Categories can be fetched from the backend

interface CategoryChangeHandler {
    (category: string): void;
}

const handleCategoryChange: CategoryChangeHandler = (category) => {
    setSelectedCategories((prevCategories) =>
        prevCategories.includes(category)
            ? prevCategories.filter((cat) => cat !== category)
            : [...prevCategories, category]
    );
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Handle form submission to create a thread
};

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-white text-xl font-semibold">ForumKode</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Create a New Thread</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700">Thread Title</label>
            <input
              type="text"
              id="title"
              value={threadTitle}
              onChange={(e) => setThreadTitle(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700">Thread Content</label>
            <textarea
              id="content"
              value={threadContent}
              onChange={(e) => setThreadContent(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md"
              rows={5}
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Select Categories</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((category) => (
                <div key={category}>
                  <input
                    type="checkbox"
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <label htmlFor={category} className="ml-2">{category}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Create Thread
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateThread;

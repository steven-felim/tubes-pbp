import { useState } from "react";
import { Link } from "react-router-dom";

const CreateThread = () => {
  const [threadTitle, setThreadTitle] = useState("");
  const [threadContent, setThreadContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const categories = ["General", "Web Development", "Data Science", "Mobile Development", "DevOps"];

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalCategories = [...selectedCategories];
    if (newCategory.trim() && !finalCategories.includes(newCategory.trim())) {
      finalCategories.push(newCategory.trim());
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          title: threadTitle,
          content: threadContent,
          categoryIds: finalCategories,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create thread");
      }

      const result = await response.json();
      console.log("Thread created:", result);

      // Optionally redirect or show success message
      setThreadTitle("");
      setThreadContent("");
      setSelectedCategories([]);
      setNewCategory("");
      alert("Thread created successfully!");
    } catch (err) {
      console.error("Error creating thread:", err);
      alert("Failed to create thread.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-white text-xl font-semibold">
              ForumKode
            </Link>
            <div className="flex space-x-4">
              <Link to="/ask" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Ask Question</Link>
              <Link to="/about" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">About</Link>
              <Link to="/me" className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
            </div>
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
            <label className="block text-gray-700">Select Existing Categories</label>
            <div className="mt-2 flex flex-wrap gap-4">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="newCategory" className="block text-gray-700">Add New Category (optional)</label>
            <input
              type="text"
              id="newCategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md"
              placeholder="e.g. Game Development"
            />
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

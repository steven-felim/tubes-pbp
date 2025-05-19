import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

type Post = {
  id: number;
  content: string;
};

type Thread = {
  title: string;
  content: string;
  posts: Post[];
};

const ThreadDetail = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    // Fetch thread and posts by ID
    // fetchThreadById(threadId).then(setThread);
    setThread({
      title: "How to build a responsive navbar?",
      content: "Looking for suggestions on building a responsive navbar with React...",
      posts: [
        { id: 1, content: "You can use CSS Flexbox for the layout." },
        { id: 2, content: "Try using the Tailwind CSS grid system." },
      ],
    });
  }, [threadId]);

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Handle comment submission logic
};

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar and other components */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {thread && (
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">{thread.title}</h2>
              <p className="mt-2 text-gray-600">{thread.content}</p>
            </div>

            <div className="space-y-4">
              {thread.posts.map((post) => (
                <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
                  <p>{post.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="mt-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={4}
                placeholder="Write your comment..."
                required
              ></textarea>
              <button
                type="submit"
                className="mt-4 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Comment
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};


export default ThreadDetail;

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

type Post = {
  id: number;
  content: string;
  name?: string;
  replies?: Post[];
};

type Thread = {
  title: string;
  content: string;
  name?: string;
  replies: Post[];
};

const ThreadDetail = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [thread, setThread] = useState<Thread | null>(null);
  const [comment, setComment] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);

  useEffect(() => {
    setThread({
      title: "How to build a responsive navbar?",
      content: "Looking for suggestions on building a responsive navbar with React...",
      name: "John Doe",
      replies: [
        {
          id: 1,
          content: "You can use CSS Flexbox for the layout.",
          name: "Alice",
          replies: [
            {
              id: 2,
              content: "Agreed! Especially with Tailwind, it’s simple.",
              name: "Bob",
              replies: [
                {
                  id: 3,
                  content: "Tailwind's 'flex' classes are so handy!",
                  name: "Charlie",
                },
              ],
            },
          ],
        },
        {
          id: 4,
          content: "Consider using a library like React Router for navigation.",
          name: "Dave",
          replies: [],
        },
        {
          id: 5,
          content: "Don't forget about accessibility features!",
          name: "Eve",
          replies: [],
        }
      ],
    });
  }, [threadId]);

  const handleCommentSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    parentId: number | null = null
  ): void => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }

    console.log("Submitted comment:", comment, "Replying to:", parentId);
    setComment("");
    setReplyToId(null);
  };

  const renderPost = (replies: Post[], depth = 0): React.JSX.Element[] => {
    return replies.map((post) => (
      <div
        key={post.id}
        className="bg-white p-4 rounded-lg shadow-md mt-2"
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <p className="font-semibold text-gray-800">{post.name || "Unknown User"}</p>
        <p className="text-gray-700">{post.content}</p>

        {isLoggedIn && (
          <button
            onClick={() => setReplyToId(post.id)}
            className="text-blue-600 text-sm mt-2 hover:underline"
          >
            Reply
          </button>
        )}

        {replyToId === post.id && isLoggedIn && (
          <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="mt-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
            ></textarea>
            <div className="mt-1">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Submit Reply
              </button>
              <button
                type="button"
                onClick={() => {
                  setReplyToId(null);
                  setComment("");
                }}
                className="ml-2 text-sm text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {post.replies && renderPost(post.replies, depth + 1)}
      </div>
    ));
  };

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {thread && (
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">{thread.title}</h2>
              {thread.name && (
                <p className="text-sm text-gray-500">Posted by {thread.name}</p>
              )}
              <p className="mt-2 text-gray-600">{thread.content}</p>
            </div>

            <div className="space-y-4">
              {thread.replies.map((post) => renderPost([post]))}
            </div>

            {isLoggedIn ? (
              replyToId === null && (
                <form onSubmit={(e) => handleCommentSubmit(e)} className="mt-6">
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
              )
            ) : (
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-2">Want to reply or comment?</p>
                <Link
                  to="/signup"
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Sign Up to Join the Discussion
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ThreadDetail;

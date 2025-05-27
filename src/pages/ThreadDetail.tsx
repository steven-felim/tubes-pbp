import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

type Post = {
  id: string;
  content: string;
  userId?: string;
  name?: string;
  refId?: string;
  threadId?: string;
};

type PostWithReplies = Post & { replies: PostWithReplies[] };

type Thread = {
  title: string;
  content: string;
  name?: string;
  replies: PostWithReplies[];
};


const ThreadDetail = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [thread, setThread] = useState<Thread | null>(null);
  const [comment, setComment] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const threadId = "thread-123";

    const flatPosts = [
      {
        id: "1",
        content: "You can use CSS Flexbox for the layout.",
        userId: "user-1",
        name: "Alice",
        refId: "thread", // means top-level comment
        threadId,
      },
      {
        id: "2",
        content: "Agreed! Especially with Tailwind, it’s simple.",
        userId: "user-2",
        name: "Bob",
        refId: "1", // reply to post ID 1
        threadId,
      },
      {
        id: "3",
        content: "Tailwind's 'flex' classes are so handy!",
        userId: "user-3",
        name: "Charlie",
        refId: "2", // reply to post ID 2
        threadId,
      },
      {
        id: "4",
        content: "Consider using a library like React Router for navigation.",
        userId: "user-4",
        name: "Dave",
        refId: "thread", // top-level
        threadId,
      },
      {
        id: "5",
        content: "Don't forget about accessibility features!",
        userId: "user-5",
        name: "Eve",
        refId: "thread", // top-level
        threadId,
      },
    ];
    
    // Convert flat structure to nested
    const buildNestedPosts = (
      posts: Post[],
      parentId: string
    ): PostWithReplies[] => {
      return posts
        .filter((post) => post.refId === parentId)
        .map((post) => ({
          ...post,
          replies: buildNestedPosts(posts, post.id),
        }));
    };

    const nestedPosts = buildNestedPosts(flatPosts, "thread");

    setThread({
      title: "How to build a responsive navbar?",
      content: "Looking for suggestions on building a responsive navbar with React...",
      name: "John Doe",
      replies: nestedPosts,
    });
  }, [threadId]);


  const handleCommentSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    parentId: string | null = null
  ) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }

    if (!comment.trim()) return;

    const newPost: PostWithReplies = {
      id: Date.now().toString(),
      content: comment,
      name: "Current User", // Replace with actual user name
      userId: "current-user-id", // Replace with actual user ID
      refId: parentId ?? "thread",
      threadId: threadId ?? "",
      replies: [],
    };

    const addReply = (posts: PostWithReplies[]): PostWithReplies[] => {
      return posts.map((p) => {
        if (p.id === parentId) {
          return { ...p, replies: [...p.replies, newPost] };
        } else {
          return { ...p, replies: addReply(p.replies) };
        }
      });
    };

    setThread((prev) => {
      if (!prev) return prev;

      if (!parentId) {
        return { ...prev, replies: [...prev.replies, newPost] };
      } else {
        return { ...prev, replies: addReply(prev.replies) };
      }
    });

    setComment("");
    setReplyToId(null);
  };


  const handleEdit = (postId: string, currentContent: string) => {
    setEditingPostId(postId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = (postId: string) => {
    const updateReplies = (posts: PostWithReplies[]): PostWithReplies[] => {
      return posts.map((p) => {
        if (p.id === postId) {
          return { ...p, content: editContent };
        } else {
          return { ...p, replies: updateReplies(p.replies) };
        }
      });
    };

    setThread((prev) =>
      prev ? { ...prev, replies: updateReplies(prev.replies) } : prev
    );
    setEditingPostId(null);
    setEditContent("");
  };

  const handleDelete = (postId: string) => {
    const deletePost = (posts: PostWithReplies[]): PostWithReplies[] => {
      return posts
        .filter((p) => p.id !== postId)
        .map((p) => ({ ...p, replies: deletePost(p.replies) }));
    };

    setThread((prev) =>
      prev ? { ...prev, replies: deletePost(prev.replies) } : prev
    );
  };

  const renderPost = (posts: PostWithReplies[], depth = 0): React.JSX.Element[] => {
    return posts.map((post) => (
      <div
        key={post.id}
        className="bg-white p-4 rounded-lg shadow-md mt-2"
        style={{ marginLeft: depth * 20 }}
      >
        <p className="font-semibold text-gray-800">{post.name || "Unknown User"}</p>

        {/* Editable area */}
        {editingPostId === post.id ? (
          <>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
            <div className="mt-1">
              <button
                onClick={() => handleSaveEdit(post.id)}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingPostId(null);
                  setEditContent("");
                }}
                className="ml-2 text-sm text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700">{post.content}</p>

            {isLoggedIn && (
              <div className="flex gap-3 mt-2 text-sm">
                <button
                  onClick={() => setReplyToId(post.id)}
                  className="text-blue-600 hover:underline"
                >
                  Reply
                </button>
                <button
                  onClick={() => handleEdit(post.id, post.content)}
                  className="text-yellow-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}

        {/* Reply form */}
        {replyToId === post.id && isLoggedIn && (
          <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="mt-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
            />
            <div className="mt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
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

        {/* Nested replies */}
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
                <Link
                  to="/ask"
                  className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Ask Question
                </Link>
              )}
              <Link
                to="/about"
                className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </Link>
              {isLoggedIn && (
                <Link
                  to="/me"
                  className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                >
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

            <div className="space-y-4">{renderPost(thread.replies)}</div>

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
                  />
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

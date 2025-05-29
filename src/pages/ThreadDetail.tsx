import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

type Post = {
  id: string;
  content: string;
  userId?: string;
  name?: string;
  refId?: string;
  threadId?: string;
  createdAt?: string;
  updatedAt?: string;
};

type PostWithReplies = Post & { replies: PostWithReplies[] };

type Thread = {
  title: string;
  content: string;
  userId?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  replies: PostWithReplies[];
};

const ThreadDetail = () => {
  const { threadId } = useParams();

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  const [thread, setThread] = useState<Thread | null>(null);
  const [comment, setComment] = useState("");
  const [replyToPostId, setReplyToPostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const [isEditingThread, setIsEditingThread] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editThreadContent, setEditThreadContent] = useState("");

  const fetchThreadAndPosts = async () => {
    try {
      const threadRes = await fetch(`http://localhost:3000/api/threads/${threadId}`);
      const threadData = await threadRes.json();

      const postRes = await fetch(`http://localhost:3000/api/threads/${threadId}/posts`);
      const postData = await postRes.json();

      if (!Array.isArray(postData)) {
        throw new Error("Post data is not an array");
      }

      const buildNestedPosts = (posts: Post[], parentId: string | null): PostWithReplies[] =>
        posts
          .filter((p) => (parentId === null ? p.refId === threadId : p.refId === parentId))
          .map((p) => ({
            ...p,
            replies: buildNestedPosts(posts, p.id),
          }));

      const nestedReplies = buildNestedPosts(postData, null);

      setThread({
        title: threadData.title,
        content: threadData.content,
        name: threadData.name ?? "Anonymous",
        userId: threadData.userId,
        createdAt: threadData.createdAt, 
        updatedAt: threadData.updatedAt, 
        replies: nestedReplies,
      });

    } catch (err) {
      console.error("Error fetching thread or posts:", err);
      setThread(null);
    }
  };

  useEffect(() => {
    if (threadId) fetchThreadAndPosts();
  }, [threadId]);

  const handleThreadDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(`http://localhost:3000/api/threads/${threadId}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error("Failed to delete thread");

      navigate("/");
    } catch (err) {
      console.error("Thread delete error:", err);
    }
  };

  const handleThreadUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/api/threads/${threadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ title: editTitle, content: editThreadContent }),
      });

      if (!res.ok) throw new Error("Failed to update thread");

      setIsEditingThread(false);
      await fetchThreadAndPosts();
    } catch (err) {
      console.error("Thread update error:", err);
    }
  };

  const handleCommentSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    replyTo: string | null
  ) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }

    if (!comment.trim()) return;

    if (!threadId) {
      console.error("No threadId found in URL params.");
      return;
    }
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/api/threads/${threadId}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          threadId: threadId,
          content: comment.trim(),
          refId: replyTo ? replyTo : threadId,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to post comment: ${errorText}`);
      }

      setComment("");
      setReplyToPostId(null);

      await fetchThreadAndPosts();

    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleEdit = (postId: string, currentContent: string) => {
    setEditingPostId(postId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/api/threads/${threadId}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (!res.ok) throw new Error("Failed to update post");

      setEditingPostId(null);
      setEditContent("");
      await fetchThreadAndPosts();

    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/api/threads/${threadId}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error("Failed to delete post");

      await fetchThreadAndPosts();

    } catch (err) {
      console.error("Delete error:", err);
    }
  };
  
  const renderPost = (posts: PostWithReplies[], depth = 0): React.JSX.Element[] => {
    return posts.map((post) => (
      <div
        key={post.id}
        className="bg-white p-4 rounded-lg shadow-md mt-2"
        style={{ marginLeft: depth * 20 }}
      >
        {post.userId ? (
          <Link
        to={`/user/${post.userId}`}
        className="font-semibold text-blue-600 hover:underline"
          >
        {post.name || "Unknown User"}
          </Link>
        ) : (
          <p className="font-semibold text-gray-800">{post.name || "Unknown User"}</p>
        )}
        <p className="text-sm text-gray-500">
          Posted on {post.createdAt && new Date(post.createdAt).toLocaleDateString()}
          {post.updatedAt && post.createdAt && post.updatedAt !== post.createdAt && (
        <span className="italic text-gray-400">
          {" "} (edited on {new Date(post.updatedAt).toLocaleDateString()})
        </span>
          )}
        </p>

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
            <button onClick={() => setReplyToPostId(post.id)} className="text-blue-600 hover:underline">
          Reply
            </button>
            {post.userId === currentUserId && (
          <>
            <button onClick={() => handleEdit(post.id, post.content)} className="text-yellow-600 hover:underline">
              Edit
            </button>
            <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline">
              Delete
            </button>
          </>
            )}
          </div>
        )}
          </>
        )}

        {!thread && (
          <p className="text-red-500 text-center mt-8">
        Failed to load thread or posts. Check console for details.
          </p>
        )}

        {/* Reply form */}
        {replyToPostId === post.id && isLoggedIn && (
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
          setReplyToPostId(null);
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {thread && (
          <>
            <div className="mb-6">
              {isEditingThread ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-3xl font-bold text-gray-900 mb-2 border p-2 rounded"
                  />
                  <textarea
                    value={editThreadContent}
                    onChange={(e) => setEditThreadContent(e.target.value)}
                    rows={4}
                    className="w-full border p-2 rounded mb-2"
                  />
                  <button
                    onClick={handleThreadUpdate}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingThread(false)}
                    className="ml-2 text-sm text-gray-500 hover:underline"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-gray-900">{thread.title}</h2>
                  <p className="text-sm text-gray-500">
                    Posted by {thread.name} on{" "}
                    {thread.createdAt && new Date(thread.createdAt).toLocaleDateString()}
                    {thread.updatedAt && thread.createdAt && thread.updatedAt !== thread.createdAt && (
                      <span className="italic text-gray-400">
                        {" "} (edited on {new Date(thread.updatedAt).toLocaleDateString()})
                      </span>
                    )} 
                  </p>
                  <p className="mt-2 text-gray-600">{thread.content}</p>

                  {/* Show edit button only for the original poster */}
                  {thread.userId && currentUserId && thread.userId === currentUserId && (
                    <div className="mt-2 space-x-4">
                      <button
                        onClick={() => {
                          setEditTitle(thread.title);
                          setEditThreadContent(thread.content);
                          setIsEditingThread(true);
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Edit Thread
                      </button>
                      <button
                        onClick={handleThreadDelete}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete Thread
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="space-y-4">{renderPost(thread.replies)}</div>

            {isLoggedIn ? (
              replyToPostId === null && (
                <form onSubmit={(e) => handleCommentSubmit(e, null)} className="mt-6">
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
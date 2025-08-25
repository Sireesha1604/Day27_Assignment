import { useEffect, useState } from "react";

export default function PostsWithComments() {
  const [posts, setPosts] = useState([]);
  const [postId, setPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [err, setErr] = useState(null);

  // Load posts on mount
  useEffect(() => {
    setLoadingPosts(true);
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load posts");
        return r.json();
      })
      .then(setPosts)
      .catch((e) => setErr(e.message))
      .finally(() => setLoadingPosts(false));
  }, []);

  // Load comments when a post is selected
  useEffect(() => {
    if (!postId) { setComments([]); return; }
    const ctrl = new AbortController();
    setLoadingComments(true);
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load comments");
        return r.json();
      })
      .then(setComments)
      .catch((e) => { if (e.name !== "AbortError") setErr(e.message); })
      .finally(() => setLoadingComments(false));
    return () => ctrl.abort();
  }, [postId]);

  if (loadingPosts) return <p style={{ padding: 16 }}>Loading posts…</p>;
  if (err) return <p style={{ padding: 16, color: "crimson" }}>Error: {err}</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Posts</h2>
      <ul>
        {posts.slice(0, 20).map((p) => (
          <li key={p.id}>
            <button onClick={() => setPostId(p.id)}>{p.title}</button>
          </li>
        ))}
      </ul>

      <h3>Comments</h3>
      {loadingComments && <p>Loading comments…</p>}
      {!loadingComments && comments.map((c) => (
        <article key={c.id} style={{ borderTop: "1px solid #eee", padding: "8px 0" }}>
          <strong>{c.name}</strong> — <em>{c.email}</em>
          <p>{c.body}</p>
        </article>
      ))}
      {!loadingComments && postId && comments.length === 0 && <p>No comments.</p>}
    </div>
  );
}

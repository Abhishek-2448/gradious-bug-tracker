import { useState } from "react";
import client from "../../api/axiosInstance.js";
import { useFetch } from "../../hooks/useFetch.js";
import Status from "../../components/Status.jsx";

function CommentSection({ bugId }) {
  const { data: comments, loading, error, reload } = useFetch(`/bugs/${bugId}/comments`);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setPostError(null);
    setPosting(true);
    try {
      await client.post(`/bugs/${bugId}/comments`, { text });
      setText("");
      reload();
    } catch (err) {
      setPostError(err.response?.data?.message || "Could not post comment");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="card">
      <h3>Comments</h3>
      <Status loading={loading} error={error} />
      {comments && comments.length === 0 && <p className="muted">No comments yet.</p>}

      {comments?.map((comment) => (
        <div className="comment" key={comment._id}>
          <strong>{comment.authorName}</strong>
          <small className="muted"> {new Date(comment.createdAt).toLocaleString()}</small>
          <p>{comment.text}</p>
        </div>
      ))}

      <form className="form" onSubmit={onSubmit}>
        <textarea rows="3" placeholder="Add a comment..." value={text} onChange={(e) => setText(e.target.value)} />
        {postError && <p className="error">{postError}</p>}
        <div className="actions">
          <button type="submit" disabled={posting || !text.trim()}>{posting ? "Posting..." : "Post comment"}</button>
        </div>
      </form>
    </div>
  );
}

export default CommentSection;

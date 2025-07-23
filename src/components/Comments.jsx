import React, { useState, useEffect } from "react";
import { Spinner } from ".";
import { callJsonRpc } from "../api/twocents";
import maleImg from "../assets/male.png";
import femaleImg from "../assets/female.png";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await callJsonRpc("/v1/comments/get", {
          post_uuid: postId,
        });
        setComments(res.comments || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (comments.length === 0)
    return <p className="text-red-600">No comments for this post</p>;

  const topLevel = comments.filter((c) => c.reply_parent_uuid === postId);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 mt-4 flex flex-col gap-8">
      <h3 className="text-xl font-bold">Comments</h3>
      {topLevel.map((comment) => (
        <CommentItem
          key={comment.uuid}
          comment={comment}
          allComments={comments}
          depth={0}
        />
      ))}
    </div>
  );
};

const CommentItem = ({ comment, allComments, depth }) => {
  const replies = allComments.filter(
    (c) => c.reply_parent_uuid === comment.uuid
  );

  const genderText =
    comment.author_meta?.gender === "M"
      ? "Male"
      : comment.author_meta?.gender === "F"
      ? "Female"
      : "Other";
  const genderImage =
    comment.author_meta?.gender === "M"
      ? maleImg
      : comment.author_meta?.gender === "F"
      ? femaleImg
      : null;

  return (
    <div
      className="border-l-2 border-primary-gray pl-4"
      style={{ marginLeft: depth * 16 }}
    >
      <div className="py-2">
        <div className="flex items-center gap-4">
          <img
            src={genderImage}
            alt="Author"
            className="w-[48px] h-[48px] rounded-full"
          />
          <div>
            <p>
              <strong>Age:</strong> {comment.author_meta?.age}
            </p>
            <p>
              <strong>Gender:</strong> {genderText}
            </p>
            <p>
              <strong>Bio:</strong> {comment.author_meta?.bio}
            </p>
          </div>
        </div>
        <p className="mt-2 text-gray-800">{comment.text}</p>
      </div>

      {replies.length > 0 && (
        <div className="mt-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.uuid}
              comment={reply}
              allComments={allComments}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;

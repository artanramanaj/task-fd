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

  const getNestedComments = (parentUuid) => {
    const nested = [];
    comments.forEach((c) => {
      if (c.reply_parent_uuid === parentUuid) {
        nested.push(c);
      }
    });
    return nested;
  };

  if (loading) return <Spinner />;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (comments.length === 0) return <p>No comments for this post</p>;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 mt-4 flex flex-col items-start gap-8">
      {comments.map((comment) => {
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
            : otherImg;

        const replies = getNestedComments(comment.uuid);

        return (
          <div
            key={comment.uuid}
            className="w-full flex flex-col items-start gap-1 py-2 border-l-2 border-primary-gray px-4"
          >
            {/* main comment */}
            <div className="w-full flex flex-col items-center border-b-[1px] border-primary-gray pb-4 md:flex-row md:justify-between md:items-start">
              <div className="flex flex-col gap-2 md:gap-4">
                <div className="flex flex-col items-center gap-2 md:flex-row">
                  <img
                    src={genderImage}
                    alt="Author"
                    className="w-[64px] h-[64px] rounded-full"
                  />
                  <AuthorMeta comment={comment} genderText={genderText} />
                </div>
                <AuthorDetails comment={comment} />
              </div>
            </div>
            <p className="mt-2 text-left text-gray-800">{comment.text}</p>

            {replies.length > 0 && (
              <div className="pl-16 py-4 w-full">
                {replies.map((reply) => (
                  <CommentItem key={reply.uuid} comment={reply} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const CommentItem = ({ comment }) => {
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
      : otherImg;

  return (
    <div className="w-full flex flex-col items-start gap-1 py-2 border-l-2 border-primary-gray px-4">
      <div className="w-full flex flex-col items-center border-b-[1px] border-primary-gray pb-4 md:flex-row md:justify-between md:items-start">
        <div className="flex flex-col gap-2 md:gap-4">
          <div className="flex flex-col items-center gap-2 md:flex-row">
            <img
              src={genderImage}
              alt="Author"
              className="w-[64px] h-[64px] rounded-full"
            />
            <AuthorMeta comment={comment} genderText={genderText} />
          </div>
          <AuthorDetails comment={comment} />
        </div>
      </div>
      <p className="mt-2 text-left text-gray-800">{comment.text}</p>
    </div>
  );
};

const AuthorMeta = ({ comment, genderText }) => (
  <div className="flex flex-col items-center gap-1 md:items-start">
    <h3>
      <span className="font-bold mr-2">Age:</span>
      {comment.author_meta?.age}
    </h3>
    <h3>
      <span className="font-bold mr-2">Gender:</span>
      {genderText}
    </h3>
  </div>
);

const AuthorDetails = ({ comment }) => (
  <div className="flex flex-col gap-1 items-center md:items-start">
    <DetailItem label="Bio" value={comment.author_meta?.bio} />
    <DetailItem label="Balance" value={comment.author_meta?.balance} />
    <DetailItem label="Arena" value={comment.author_meta?.arena} />
    <DetailItem
      label="Subscription type"
      value={comment.author_meta?.subscription_type}
    />
  </div>
);

const DetailItem = ({ label, value }) => (
  <p className="text-center md:text-start">
    <span className="font-bold mr-2">{label}:</span>
    {value}
  </p>
);

export default Comments;

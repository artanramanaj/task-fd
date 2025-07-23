import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import maleImg from "../assets/male.png";
import femaleImg from "../assets/female.png";
import moment from "moment";
import { FaArrowUp, FaComment, FaEye, FaFlag } from "react-icons/fa";
import { Spinner } from ".";
import { callJsonRpc } from "../api/twocents";

const SinglePost = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await callJsonRpc("/v1/posts/get", {
          post_uuid: postId,
        });
        setPost(result.post || null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <Spinner />;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!post) return <p>No post found.</p>;

  const genderImage = post.author_meta.gender === "M" ? maleImg : femaleImg;
  const genderText = post.author_meta.gender === "M" ? "Male" : "Female";

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 mt-4 flex flex-col items-start gap-4">
      <PostHeader />
      <PostContent />
      <PostStats />
    </div>
  );

  function PostHeader() {
    return (
      <div className="w-full flex flex-col items-center   border-b-[1px] border-primary-gray pb-4 md:flex-row md:justify-between md:items-start">
        <div className="flex flex-col gap-2 md:gap-4">
          <div className="flex flex-col items-center gap-2 md:flex-row">
            <img
              src={genderImage}
              alt="Author"
              className="w-[64px] h-[64px] object-cover rounded-full"
            />
            <AuthorMeta post={post} genderText={genderText} />
          </div>
          <AuthorDetails post={post} />
        </div>
        <PostDates post={post} />
      </div>
    );
  }

  function AuthorMeta() {
    return (
      <div className="flex flex-col items-center gap-1 md:items-start">
        <h3>
          <span className="font-bold mr-2">Age:</span>
          {post.author_meta.age}
        </h3>
        <h3>
          <span className="font-bold mr-2">Gender:</span>
          {genderText}
        </h3>
      </div>
    );
  }

  function AuthorDetails() {
    return (
      <div className="flex flex-col gap-1 items-center md:items-start">
        <DetailItem label="Bio" value={post.author_meta.bio} />
        <DetailItem label="Balance" value={post.author_meta.balance} />
        <DetailItem label="Arena" value={post.author_meta.arena} />
        <DetailItem
          label="Subscription type"
          value={post.author_meta.subscription_type}
        />
      </div>
    );
  }

  function DetailItem({ label, value }) {
    return (
      <p className="text-center md:text-start">
        <span className="font-bold mr-2">{label}:</span>
        {value}
      </p>
    );
  }

  function PostDates() {
    return (
      <div className="flex flex-col gap-2 mt-2 md:mt-0">
        <DetailItem
          label="Created At"
          value={moment(post.created_at).format("MMMM Do YYYY")}
        />
        <DetailItem
          label="Updated At"
          value={moment(post.updated_at).format("MMMM Do YYYY")}
        />
      </div>
    );
  }

  function PostContent() {
    return (
      <div className="w-full flex flex-col items-center gap-4 border-b-[1px] border-primary-gray pb-4 md:items-start">
        <p className="text-orange-500 md:self-end">{post.topic}</p>
        <h2 className="text-center md:text-start">{post.title}</h2>
        <p className="text-center md:text-start">{post.text}</p>
      </div>
    );
  }

  function PostStats() {
    return (
      <div className="w-full flex flex-col items-center gap-2  text-sm text-gray-500 md:justify-between md:flex-row md:gap-0">
        <StatItem icon={<FaArrowUp />} value={post.upvote_count} />
        <StatItem icon={<FaComment />} value={post.comment_count} />
        <StatItem icon={<FaEye />} value={post.view_count} />
        <StatItem icon={<FaFlag />} value={post.report_count} />
      </div>
    );
  }
};

function StatItem({ icon, value }) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <p>{value}</p>
    </div>
  );
}

export default SinglePost;

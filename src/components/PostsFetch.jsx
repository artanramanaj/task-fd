import React, { useState, useEffect } from "react";
import { callJsonRpc } from "../api/twocents";
import maleImg from "../assets/male.png";
import femaleImg from "../assets/female.png";
import moment from "moment";
import {
  FaArrowUp,
  FaArrowDown,
  FaComment,
  FaEye,
  FaFlag,
} from "react-icons/fa";
import { Spinner } from ".";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  const genderImage = post.author_meta.gender === "M" ? maleImg : femaleImg;
  const genderText = post.author_meta.gender === "M" ? "Male" : "Female";

  return (
    <Link
      to={`/post/${post.uuid}`}
      className="bg-white shadow-xl rounded-2xl p-8 mt-4 flex flex-col items-start gap-4"
    >
      <PostHeader
        post={post}
        genderImage={genderImage}
        genderText={genderText}
      />
      <PostContent post={post} />
      <PostStats post={post} />
    </Link>
  );
};

const PostHeader = ({ post, genderImage, genderText }) => (
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

const AuthorMeta = ({ post, genderText }) => (
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

const AuthorDetails = ({ post }) => (
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

const DetailItem = ({ label, value }) => (
  <p className="text-center md:text-start">
    <span className="font-bold mr-2">{label}:</span>
    {value}
  </p>
);

const PostDates = ({ post }) => (
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

const PostContent = ({ post }) => (
  <div className="w-full flex flex-col items-center gap-4 border-b-[1px] border-primary-gray pb-4 md:items-start">
    <p className="text-orange-500 md:self-end">{post.topic}</p>
    <h2 className="text-center md:text-start">{post.title}</h2>
    <p className="text-center md:text-start">{post.text}</p>
  </div>
);

const PostStats = ({ post }) => (
  <div className="w-full flex flex-col items-center gap-2  text-sm text-gray-500 md:justify-between md:flex-row md:gap-0">
    <StatItem
      icon={
        post.upvote_count.toString()[0] === "-" ? (
          <FaArrowDown />
        ) : (
          <FaArrowUp />
        )
      }
      value={post.upvote_count}
    />
    <StatItem icon={<FaComment />} value={post.comment_count} />
    <StatItem icon={<FaEye />} value={post.view_count} />
    <StatItem icon={<FaFlag />} value={post.report_count} />
  </div>
);

const StatItem = ({ icon, value }) => (
  <div className="flex items-center gap-1">
    {icon}
    <p>{value}</p>
  </div>
);

export default function PostsFetch({ filter, filterLabel }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await callJsonRpc("/v1/posts/arena", {
          filter,
        });
        console.log("check the results", result);
        setPosts(result.posts || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filter]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <>
      <div className="min-h-screen">
        <h2>{filterLabel} Posts</h2>
        {posts.length === 0 ? (
          <div className="bg-white shadow-xl rounded-2xl p-8 mt-4 text-center">
            <h3 className="text-primary-red">There are no posts to display</h3>
          </div>
        ) : (
          posts.map((post, index) => (
            <PostCard key={`post-${index}`} post={post} />
          ))
        )}
      </div>
    </>
  );
}

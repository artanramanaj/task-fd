import React from "react";
import { SinglePost, Comments } from "../components";
import { useParams } from "react-router-dom";

const SinglePostPage = () => {
  const { id: postId } = useParams();
  return (
    <div className="container min-h-screen">
      <SinglePost postId={postId} />
      <Comments postId={postId} />
    </div>
  );
};

export default SinglePostPage;

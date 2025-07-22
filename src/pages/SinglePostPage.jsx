import React from "react";
import { SinglePost } from "../components";
import { useParams } from "react-router-dom";
const SinglePostPage = () => {
  const { id: postId } = useParams();
  return (
    <div className="container min-h-screen">
      <SinglePost postId={postId} />
    </div>
  );
};

export default SinglePostPage;

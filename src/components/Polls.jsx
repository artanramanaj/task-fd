import React from "react";

const Polls = ({ postId }) => {
  const [polls, setPolls] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await callJsonRpc("/v1/polls/get", {
          post_uuid: postId,
        });
        console.log("check the result", result);
        setPolls(result.post || null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [postId]);
  if (loading) return <Spinner />;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  return <div>polls</div>;
};

export default Polls;

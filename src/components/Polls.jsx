import React, { useState, useEffect } from "react";
import { Spinner } from ".";
import { callJsonRpc } from "../api/twocents";

const Polls = ({ postId }) => {
  const [pollResult, setPollResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      setError(null);
      try {
        const { results } = await callJsonRpc("/v1/polls/get", {
          post_uuid: postId,
        });
        console.log("Poll result:", results);
        setPollResult(results || {});
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [postId]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!pollResult || Object.keys(pollResult).length === 0)
    return <p className="text-red-600">No poll results available.</p>;

  const totalVotes = Object.values(pollResult).reduce(
    (sum, item) => sum + (item?.votes || 0),
    0
  );

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Poll Results</h3>
      <div className="space-y-3">
        {Object.entries(pollResult).map(([option, data], index) => {
          const votes = data?.votes || 0;
          const avgBalance = data?.average_balance || 0;
          const percentage = totalVotes
            ? Math.round((votes / totalVotes) * 100)
            : 0;

          return (
            <div
              key={index}
              className="border rounded p-3 shadow relative overflow-hidden bg-primary-gray"
            >
              <div
                className="absolute top-0 left-0 h-full bg-primary-blue opacity-30 animated-fill"
                style={{ "--target-width": `${percentage}%` }}
              ></div>

              <div className="relative z-10">
                <p className="font-semibold text-lg">
                  Option: {Number(option) + 1}
                </p>
                <p>
                  {percentage}% ({votes} vote{votes !== 1 ? "s" : ""})
                </p>
                <p>Avg Net Worth: ${avgBalance}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Polls;

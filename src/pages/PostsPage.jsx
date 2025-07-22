import React, { useState } from "react";
import { PostsFetch } from "../components";

const Posts = () => {
  const [filter, setFilter] = useState("controversial");
  const [filterLabel, setFilterLabel] = useState("Controversial");

  const filterOptions = [
    { value: "newToday", label: "New Today" },
    { value: "topToday", label: "Top Today" },
    { value: "topAllTime", label: "Top All Time" },
    { value: "controversial", label: "Controversial" },
  ];

  const handleFilterChange = (e) => {
    const selectedOption = filterOptions.find(
      (option) => option.value === e.target.value
    );
    setFilter(e.target.value);
    setFilterLabel(selectedOption.label);
  };

  return (
    <div className="container">
      <div className="mb-4">
        <label
          htmlFor="post-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Filter Posts
        </label>
        <select
          id="post-filter"
          value={filter}
          onChange={handleFilterChange}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <PostsFetch filter={filter} filterLabel={filterLabel} />
    </div>
  );
};

export default Posts;

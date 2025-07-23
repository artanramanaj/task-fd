import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className="bg-primary-blue py-8">
      <div className="container flex-center-row ">
        <p className="text-white"> {year}</p>
      </div>
    </div>
  );
};

export default Footer;

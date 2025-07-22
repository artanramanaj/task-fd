import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Header, Footer } from "../components";
const HomeLayout = () => {
  return (
    <>
      <Header />
      <div>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
export default HomeLayout;

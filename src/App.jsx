import React, { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { HomeLayout, PostsPage, SinglePostPage } from "./pages";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    // errorElement: <Error />,
    children: [
      {
        index: true,
        element: <PostsPage />,
      },
      {
        path: "post/:id",
        element: <SinglePostPage />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

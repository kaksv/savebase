import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Pages/Footer";
const SharedDashboardLayout = () => {
  return (
    <>
      <Suspense fallback={<div>loading ....</div>}>
        <Outlet />
        <Footer />
      </Suspense>
    </>
  );
};

export default SharedDashboardLayout;

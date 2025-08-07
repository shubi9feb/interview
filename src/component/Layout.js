import React from "react";
import Header from "../component/Header";
import Sidebar from "../component/sidebar";

const Layout = ({ children }) => {
  return (
    <section>
      <Header />
      <Sidebar />
      <main className="p-4 sm:ml-64">
        {/* Main content area */}
        {children}
      </main>
    </section>
  );
};

export default Layout;

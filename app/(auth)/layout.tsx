import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid h-screen w-screen place-content-center">
      {children}
    </div>
  );
};

export default Layout;

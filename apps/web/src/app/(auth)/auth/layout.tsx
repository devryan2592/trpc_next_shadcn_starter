import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-primary/5">
      {/* Add your layout components and structure here */}
      {children}
    </div>
  );
};

export default Layout;

import React from "react";
import Header from "../components/Header";
type pros = {
  children: React.ReactNode;
};

export default function layout({ children }: pros) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

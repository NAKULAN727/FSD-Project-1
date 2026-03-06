import React from "react";
import { Link } from "react-router-dom";

const Tag = ({ name }) => {
  return (
    <Link
      to={`/tags?filter=${name}`}
      className="inline-block px-2 py-0.5 text-xs font-medium text-slate-600 bg-blue-50 hover:bg-blue-100 rounded-[3px] border border-transparent hover:border-blue-300 transition-colors cursor-pointer select-none"
    >
      {name}
    </Link>
  );
};

export default Tag;

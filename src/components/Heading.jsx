import React from 'react'

const Heading = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-white text-3xl font-bold">{title}</h1>
      {subtitle && (
        <p className="text-gray-400 mt-2">{subtitle}</p>
      )}
    </div>
  );
};

export default Heading;

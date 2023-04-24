import React from 'react';

const Button = ({ onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center min-w-fit bg-blue-500 text-white font-bold py-2 px-4 rounded hover:brightness-110"
    >
      {children}
    </button>
  );

export default Button;

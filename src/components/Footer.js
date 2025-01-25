import React from 'react';
import { CardFooter } from "./ui/card";

const Footer = () => {
  return (
    <CardFooter className="justify-center text-sm text-gray-600">
      <p>
        Made by{' '}
        <a
          href="https://nkasmanoff.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Noah Kasmanoff
        </a>
      </p>
    </CardFooter>
  );
};

export default Footer; 
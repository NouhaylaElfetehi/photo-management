import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 absolute bottom-0 w-full">
      <p>&copy; {new Date().getFullYear()} PhotoManager. Tous droits réservés.</p>
    </footer>
  );
};

export default Footer;

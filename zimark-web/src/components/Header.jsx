import { useState, useEffect } from "react";
import { HiMenu, HiX, HiShoppingCart } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ cartCount }) {
  const navigate = useNavigate();

  const backgrounds = [
    "https://images.pexels.com/photos/34385118/pexels-photo-34385118.jpeg",
    "https://images.pexels.com/photos/34955542/pexels-photo-34955542.jpeg",
    "https://images.pexels.com/photos/33716616/pexels-photo-33716616.jpeg",
  ];

  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-screen h-[300px] flex items-center justify-center border-b-2 border-blue-400 bg-center bg-cover transition-all duration-700"
      style={{ backgroundImage: `url(${backgrounds[index]})` }}
    >
      <div className="w-full h-full bg-black/50 flex flex-col justify-between p-5">
        {/* Desktop Navbar */}
        <ul className="hidden md:flex gap-10 text-white text-lg font-semibold self-end mr-10 items-center">
          <Link
            to="/"
            className="border-b-4 border-transparent hover:border-blue-400 cursor-pointer transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/cart"
            className="relative border-b-4 border-transparent hover:border-blue-400 cursor-pointer transition duration-300"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </ul>

        {/* Mobile Navbar */}
        <div className="flex md:hidden justify-between items-center">
          <h2
            className="text-2xl font-bold text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            Zimark Shop
          </h2>

          <button onClick={() => setOpen(!open)} className="text-white text-3xl">
            {open ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {open && (
          <ul className="md:hidden flex flex-col gap-4 text-white text-xl font-semibold bg-black/70 p-5 rounded mt-3 w-fit self-end mr-5">
            <Link
              to="/"
              className="border-b-2 border-transparent hover:border-blue-400 cursor-pointer transition duration-300"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/cart"
              className="border-b-2 border-transparent hover:border-blue-400 cursor-pointer transition duration-300 relative"
              onClick={() => setOpen(false)}
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/about"
              className="border-b-2 border-transparent hover:border-blue-400 cursor-pointer transition duration-300"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="border-b-2 border-transparent hover:border-blue-400 cursor-pointer transition duration-300"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
          </ul>
        )}

        {/* Centered Title (Desktop) */}
        <div className="hidden md:flex w-full items-center justify-center">
          <h2 className="text-3xl font-bold text-white text-center mb-10 border-b-4 border-blue-400 w-1/4">
            Zimark Shop
          </h2>
        </div>
      </div>
    </div>
  );
}

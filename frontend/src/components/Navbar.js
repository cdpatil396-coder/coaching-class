import { useState } from "react";

import { Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import {
  FaGraduationCap,
  FaBars,
  FaTimes
} from "react-icons/fa";

const safeParseUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
};

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  const user = safeParseUser();

  return (

    <motion.nav

      initial={{ y: -100 }}

      animate={{ y: 0 }}

      transition={{ duration: 0.7 }}

      className="
        sticky
        top-0
        z-50
        bg-white/80
        backdrop-blur-lg
        shadow-lg
        border-b
        border-white/20
      "
    >

      <div className="
        container
        mx-auto
        flex
        justify-between
        items-center
        px-6
        py-4
      ">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >

          <div className="
            bg-gradient-to-r
            from-blue-600
            to-indigo-700
            text-white
            p-3
            rounded-xl
            shadow-lg
            text-2xl
          ">

            <FaGraduationCap />

          </div>

          <div>

            <h1 className="
              text-xl
              md:text-2xl
              font-extrabold
              bg-gradient-to-r
              from-blue-700
              to-indigo-700
              bg-clip-text
              text-transparent
            ">

              Swami Coaching Classes

            </h1>

            <p className="
              text-xs
              md:text-sm
              text-gray-500
            ">

              10th & 12th Preparation | MH-CET

            </p>

          </div>

        </Link>

        {/* Desktop Menu */}

        <div className="
          hidden
          md:flex
          items-center
          gap-8
          font-semibold
        ">

          <Link
            to="/"
            className="
              hover:text-blue-700
              transition
            "
          >
            Home
          </Link>

          <Link
            to="/about"
            className="
              hover:text-blue-700
              transition
            "
          >
            About
          </Link>

          <Link
            to="/courses"
            className="
              hover:text-blue-700
              transition
            "
          >
            Courses
          </Link>

          <Link
            to="/admission"
            className="
              hover:text-blue-700
              transition
            "
          >
            Admission
          </Link>

          <Link
            to="/contact"
            className="
              hover:text-blue-700
              transition
            "
          >
            Contact
          </Link>

          {/* Dynamic Auth */}

          {token ? (

            <div className="
              flex
              items-center
              gap-4
            ">

              <Link
                to={user?.role === "admin" ? "/admin" : "/dashboard"}
                className="
                  text-blue-700
                  font-bold
                "
              >

                {user?.name}

              </Link>

              {user?.role === "admin" && (

                <Link
                  to="/admin"
                  className="
                    bg-red-500
                    text-white
                    px-4
                    py-2
                    rounded-xl
                    hover:bg-red-600
                    transition
                  "
                >

                  Admin Panel

                </Link>

              )}

            </div>

          ) : (

            <>

              <Link
                to="/register"
                className="
                  hover:text-blue-700
                  transition
                "
              >
                Register
              </Link>

              <Link
                to="/login"
                className="
                  hover:text-blue-700
                  transition
                "
              >
                Login
              </Link>

            </>

          )}

        </div>

        {/* Mobile Button */}

        <button

          onClick={() => setMenuOpen(!menuOpen)}

          className="
            md:hidden
            text-2xl
            text-blue-700
          "
        >

          {menuOpen ? <FaTimes /> : <FaBars />}

        </button>

      </div>

      {/* Mobile Menu */}

      <AnimatePresence>

        {menuOpen && (

          <motion.div

            initial={{
              opacity: 0,
              y: -20
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            exit={{
              opacity: 0,
              y: -20
            }}

            className="
              md:hidden
              bg-white
              shadow-xl
              px-6
              py-6
              space-y-5
              font-semibold
            "
          >

            <Link
              to="/"
              className="block hover:text-blue-700"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/about"
              className="block hover:text-blue-700"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>

            <Link
              to="/courses"
              className="block hover:text-blue-700"
              onClick={() => setMenuOpen(false)}
            >
              Courses
            </Link>

            <Link
              to="/admission"
              className="block hover:text-blue-700"
              onClick={() => setMenuOpen(false)}
            >
              Admission
            </Link>

            <Link
              to="/contact"
              className="block hover:text-blue-700"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Dynamic Mobile Auth */}

            {token ? (

              <div className="space-y-4">

                <Link
                  to={user?.role === "admin" ? "/admin" : "/dashboard"}
                  className="
                    block
                    text-blue-700
                    font-bold
                  "
                  onClick={() => setMenuOpen(false)}
                >

                  {user?.name}

                </Link>

                {user?.role === "admin" && (

                  <Link
                    to="/admin"
                    className="
                      block
                      bg-red-500
                      text-white
                      px-4
                      py-3
                      rounded-xl
                      text-center
                    "
                    onClick={() => setMenuOpen(false)}
                  >

                    Admin Panel

                  </Link>

                )}

              </div>

            ) : (

              <>

                <Link
                  to="/register"
                  className="block hover:text-blue-700"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  className="block hover:text-blue-700"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>

              </>

            )}

          </motion.div>

        )}

      </AnimatePresence>

    </motion.nav>

  );
}

export default Navbar;

import { motion } from "framer-motion";
import { useState } from "react";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaAward
} from "react-icons/fa";

function About() {

  const [showMore, setShowMore] = useState(false);

  const stats = [
    {
      icon: <FaUserGraduate />,
      number: "500+",
      title: "Students Enrolled"
    },
    {
      icon: <FaChalkboardTeacher />,
      number: "20+",
      title: "Expert Teachers"
    },
    {
      icon: <FaAward />,
      number: "95%",
      title: "Success Rate"
    }
  ];

  return (

    <div className="
      bg-gradient-to-br
      from-slate-50
      via-blue-50
      to-indigo-100
      min-h-screen
      overflow-hidden
    ">

      {/* Hero Section */}

      <motion.div

        initial={{ opacity: 0, y: 80 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.8 }}

        className="
          text-center
          py-24
          px-6
        "
      >

        <h1 className="
          text-5xl
          md:text-6xl
          font-extrabold
          mb-6
          bg-gradient-to-r
          from-blue-700
          to-indigo-700
          bg-clip-text
          text-transparent
        ">

          About Us

        </h1>

        <p className="
          text-lg
          md:text-2xl
          text-gray-600
          max-w-3xl
          mx-auto
          leading-9
        ">

          Building Bright Futures Through
          Quality Education & Personal Guidance

        </p>

      </motion.div>

      {/* Main About Section */}

      <div className="
        container
        mx-auto
        px-6
        py-10
      ">

        <div className="
          grid
          md:grid-cols-2
          gap-16
          items-center
        ">

          {/* Left Image */}

          <motion.div

            initial={{ opacity: 0, x: -80 }}

            whileInView={{ opacity: 1, x: 0 }}

            transition={{ duration: 0.8 }}

            className="relative"
          >

            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="Coaching"
              className="
                rounded-3xl
                shadow-2xl
                object-cover
                w-full
                hover:scale-105
                transition-all
                duration-500
              "
            />

          </motion.div>

          {/* Right Content */}

          <motion.div

            initial={{ opacity: 0, x: 80 }}

            whileInView={{ opacity: 1, x: 0 }}

            transition={{ duration: 0.8 }}

          >

            <h2 className="
              text-4xl
              font-bold
              text-gray-800
              mb-8
            ">

              Welcome to
              <span className="text-blue-700">
                {" "}Swami Coaching Classes
              </span>

            </h2>

            <p className="
              text-gray-600
              leading-9
              mb-6
              text-lg
            ">

              Swami Coaching Classes is one of the trusted
              institutes for 10th & 12th Board preparation
              along with MH-CET guidance.

            </p>

            <p className="
              text-gray-600
              leading-9
              mb-6
              text-lg
            ">

              We focus on conceptual learning,
              regular practice tests, doubt-solving,
              and individual student attention.

            </p>

            <p className="
              text-gray-600
              leading-9
              text-lg
            ">

              Our mission is to provide quality education
              using modern teaching methods and experienced faculty.

            </p>

            {/* Learn More Button */}

            <motion.button

              whileHover={{
                scale: 1.05
              }}

              whileTap={{
                scale: 0.95
              }}

              onClick={() => setShowMore(!showMore)}

              className="
                mt-10
                bg-gradient-to-r
                from-blue-600
                to-indigo-700
                text-white
                px-8
                py-4
                rounded-2xl
                shadow-xl
                hover:shadow-blue-300
                transition-all
                duration-300
              "
            >

              {showMore ? "Show Less" : "Learn More"}

            </motion.button>

            {/* Expanded Information */}

            {showMore && (

              <motion.div

                initial={{ opacity: 0, y: 40 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.6 }}

                className="
                  mt-10
                  bg-white/80
                  backdrop-blur-lg
                  p-8
                  rounded-3xl
                  shadow-2xl
                  border
                  border-white/30
                "
              >

                <h3 className="
                  text-3xl
                  font-bold
                  text-blue-700
                  mb-6
                ">

                  About Swami Coaching Classes

                </h3>

                <p className="
                  text-gray-700
                  leading-9
                  text-lg
                  mb-5
                ">

                  Swami Coaching Classes was founded by
                  <span className="font-bold text-blue-700">
                    {" "}Dinesh Sir
                  </span>
                  {" "}with the mission of providing
                  quality education and personal guidance
                  to every student.

                </p>

                <p className="
                  text-gray-700
                  leading-9
                  text-lg
                  mb-5
                ">

                  We specialize in Mathematics coaching,
                  board exam preparation, regular tests,
                  doubt solving sessions, and complete
                  MH-CET guidance for 10th & 12th students.

                </p>

                <p className="
                  text-gray-700
                  leading-9
                  text-lg
                  mb-5
                ">

                  Our teaching focuses on conceptual learning,
                  discipline, confidence building, and
                  excellent academic performance.

                </p>

                <div className="
                  mt-8
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-700
                  text-white
                  p-6
                  rounded-2xl
                  text-center
                  shadow-xl
                ">

                  <h2 className="
                    text-2xl
                    md:text-3xl
                    font-bold
                    italic
                  ">

                    "आजची तयारी उद्याचे यश"

                  </h2>

                </div>

              </motion.div>

            )}

          </motion.div>

        </div>

      </div>

      {/* Statistics Section */}

      <div className="
        container
        mx-auto
        px-6
        py-24
      ">

        <div className="
          grid
          md:grid-cols-3
          gap-10
        ">

          {stats.map((item, index) => (

            <motion.div

              key={index}

              initial={{ opacity: 0, y: 80 }}

              whileInView={{ opacity: 1, y: 0 }}

              transition={{
                duration: 0.7,
                delay: index * 0.2
              }}

              whileHover={{
                scale: 1.05
              }}

              className="
                bg-white/80
                backdrop-blur-lg
                rounded-3xl
                shadow-2xl
                hover:shadow-blue-200
                transition-all
                duration-500
                border
                border-white/30
                p-10
                text-center
              "
            >

              <div className="
                w-24
                h-24
                mx-auto
                rounded-full
                bg-gradient-to-r
                from-blue-600
                to-indigo-700
                flex
                items-center
                justify-center
                text-white
                text-4xl
                shadow-xl
                mb-8
              ">

                {item.icon}

              </div>

              <h2 className="
                text-5xl
                font-extrabold
                text-gray-800
                mb-4
              ">

                {item.number}

              </h2>

              <p className="
                text-gray-600
                text-lg
              ">

                {item.title}

              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </div>

  );
}

export default About;
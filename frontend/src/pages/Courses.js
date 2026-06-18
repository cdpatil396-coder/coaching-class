import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import {
  FaBookOpen,
  FaCalculator,
  FaFlask,
  FaAtom
} from "react-icons/fa";

function Courses() {

  const navigate = useNavigate();

  const courses = [
    {
      title: "Class 10 Mathematics",
      description:
        "Complete SSC Board Mathematics preparation with conceptual learning and problem solving.",
      icon: <FaCalculator />
    },
    {
      title: "Class 10 Science",
      description:
        "Detailed preparation for Physics, Chemistry & Biology with regular tests.",
      icon: <FaFlask />
    },
    {
      title: "Class 12 Mathematics",
      description:
        "Advanced Mathematics coaching for HSC Board students with expert guidance.",
      icon: <FaCalculator />
    },
    {
      title: "Class 12 Science",
      description:
        "Comprehensive preparation for Physics, Chemistry & Biology subjects.",
      icon: <FaAtom />
    },
    {
      title: "English Grammar & Writing",
      description:
        "Improve grammar, vocabulary, writing skills and board exam preparation.",
      icon: <FaBookOpen />
    },
    {
      title: "MH-CET Preparation",
      description:
        "Focused preparation for Maharashtra CET exams with expert guidance.",
      icon: <FaBookOpen />
    }
  ];

  return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-slate-50
      via-blue-50
      to-indigo-100
      py-24
      px-6
    ">

      {/* Heading */}

      <motion.div

        initial={{ opacity: 0, y: 60 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.8 }}

        className="text-center mb-20"
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

          Our Courses

        </h1>

        <p className="
          text-gray-600
          text-lg
          md:text-2xl
          max-w-3xl
          mx-auto
          leading-9
        ">

          Quality Coaching For 10th, 12th &
          MH-CET Students

        </p>

      </motion.div>

      {/* Courses Grid */}

      <div className="
        container
        mx-auto
        grid
        md:grid-cols-2
        gap-10
      ">

        {courses.map((course, index) => (

          <motion.div

            key={index}

            initial={{ opacity: 0, y: 80 }}

            whileInView={{ opacity: 1, y: 0 }}

            transition={{
              duration: 0.7,
              delay: index * 0.2
            }}

            whileHover={{
              scale: 1.04
            }}

            className="
              bg-white/80
              backdrop-blur-lg
              border
              border-white/30
              rounded-3xl
              shadow-2xl
              hover:shadow-blue-200
              transition-all
              duration-500
              p-10
              relative
              overflow-hidden
            "
          >

            {/* Background Glow */}

            <div className="
              absolute
              top-0
              right-0
              w-40
              h-40
              bg-blue-100
              rounded-full
              blur-3xl
              opacity-40
            ">

            </div>

            {/* Icon */}

            <div className="
              relative
              w-24
              h-24
              rounded-2xl
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

              {course.icon}

            </div>

            {/* Content */}

            <h2 className="
              text-3xl
              font-bold
              text-gray-800
              mb-5
              relative
            ">

              {course.title}

            </h2>

            <p className="
              text-gray-600
              leading-8
              text-lg
              relative
            ">

              {course.description}

            </p>

            {/* Button */}

            <motion.button

              whileHover={{
                scale: 1.05
              }}

              whileTap={{
                scale: 0.95
              }}

              onClick={() => navigate("/login")}

              className="
                mt-8
                bg-gradient-to-r
                from-blue-600
                to-indigo-700
                text-white
                px-6
                py-3
                rounded-2xl
                shadow-lg
                hover:shadow-blue-300
                transition-all
                duration-300
              "
            >

              Enroll Now

            </motion.button>

          </motion.div>

        ))}

      </div>

    </div>

  );
}

export default Courses;
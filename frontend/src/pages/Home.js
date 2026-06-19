import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import {
  FaChalkboardTeacher,
  FaLaptopCode,
  FaAward
} from "react-icons/fa";

import Testimonials from "../components/Testimonials";
import Teachers from "../components/Teachers";
import HeroSlider from "../components/HeroSlider";

function Home() {

  const navigate = useNavigate();

  const openAdmission = () => {

    const alreadySubmitted =
    localStorage.getItem("admissionSubmitted");

    const token =
    localStorage.getItem("token");

    if (!alreadySubmitted) {
      navigate("/admission");
      return;
    }

    navigate(token ? "/dashboard" : "/login");

  };

  const features = [
    {
      icon: <FaChalkboardTeacher />,
      title: "Expert Teachers",
      text: "Experienced faculty focused on conceptual learning."
    },
    {
      icon: <FaLaptopCode />,
      title: "Smart Classes",
      text: "Modern digital classrooms with interactive teaching."
    },
    {
      icon: <FaAward />,
      title: "Best Results",
      text: "Consistent excellent results in board examinations."
    }
  ];

  return (

    <div className="overflow-hidden">

      {/* Hero Slider */}

      <HeroSlider />

      {/* Welcome Section */}

      <motion.div

        initial={{ opacity: 0, y: 80 }}

        whileInView={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.8 }}

        className="
          relative
          bg-gradient-to-r
          from-blue-700
          via-indigo-700
          to-blue-800
          text-white
          py-24
          px-6
        "
      >

        <div className="
          absolute
          inset-0
          bg-black/20
        ">

        </div>

        <div className="
          relative
          container
          mx-auto
          text-center
          z-10
        ">

          <motion.h1

            initial={{ opacity: 0, y: -50 }}

            whileInView={{ opacity: 1, y: 0 }}

            transition={{ duration: 1 }}

            className="
              text-4xl
              md:text-6xl
              font-extrabold
              mb-6
              leading-tight
            "
          >

            Welcome to <br />

            <span className="text-yellow-300">
              Swami Coaching Classes
            </span>

          </motion.h1>

          <motion.p

            initial={{ opacity: 0 }}

            whileInView={{ opacity: 1 }}

            transition={{ delay: 0.4, duration: 1 }}

            className="
              text-lg
              md:text-2xl
              mb-10
              text-blue-100
            "
          >

            Best Coaching Classes for
            10th & 12th Students | MH-CET

          </motion.p>

          {/* Admission Button */}

          <motion.button

            whileHover={{
              scale: 1.08
            }}

            whileTap={{
              scale: 0.95
            }}

            onClick={openAdmission}

            className="
              bg-yellow-400
              text-black
              px-8
              py-4
              rounded-2xl
              font-bold
              shadow-2xl
              hover:bg-yellow-300
              transition-all
              duration-300
            "
          >

            Admission Open

          </motion.button>

        </div>

      </motion.div>

      {/* Features Section */}

      <div className="
        bg-gradient-to-br
        from-slate-50
        via-blue-50
        to-indigo-100
        py-24
      ">

        <div className="container mx-auto px-6">

          <div className="text-center mb-16">

            <h2 className="
              text-4xl
              md:text-5xl
              font-bold
              text-gray-800
              mb-4
            ">

              Why Choose Us?

            </h2>

            <p className="text-gray-600 text-lg">

              Quality Education With Modern Teaching

            </p>

          </div>

          <div className="
            grid
            md:grid-cols-3
            gap-10
          ">

            {features.map((item, index) => (

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
                  p-10
                  text-center
                  shadow-2xl
                  hover:shadow-blue-200
                  transition-all
                  duration-500
                  border
                  border-white/30
                "
              >

                {/* Icon */}

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

                <h3 className="
                  text-3xl
                  font-bold
                  text-gray-800
                  mb-4
                ">

                  {item.title}

                </h3>

                <p className="
                  text-gray-600
                  leading-8
                ">

                  {item.text}

                </p>

              </motion.div>

            ))}

          </div>

        </div>

      </div>

      {/* Teachers Section */}

      <Teachers />

      {/* Testimonials Section */}

      <Testimonials />

    </div>

  );
}

export default Home;

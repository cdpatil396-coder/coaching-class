import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

function Testimonials() {

  const data = [
    {
      name: "Sonali",
      text: "Best coaching institute with amazing teachers and excellent guidance.",
      course: "Class 12th"
    },
    {
      name: "Priya",
      text: "Improved my marks significantly. The teachers are very supportive.",
      course: "class 10th"
    },
    {
      name: "Rahul",
      text: "Modern classrooms and regular tests helped me succeed.",
      course: "class 10th"
    }
  ];

  return (

    <div className="py-24 bg-gradient-to-br from-indigo-100 via-white to-blue-100">

      {/* Heading */}

      <div className="text-center mb-16">

        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Student Testimonials
        </h1>

        <p className="text-gray-600 text-lg">
          What Our Students Say About Us
        </p>

      </div>

      {/* Cards */}

      <div className="container mx-auto grid md:grid-cols-3 gap-10 px-6">

        {data.map((item, index) => (

          <motion.div
            key={index}

            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.2 }}

            whileHover={{
              scale: 1.05,
              rotate: 1
            }}

            className="
              bg-white/70
              backdrop-blur-lg
              border border-white/30
              rounded-3xl
              p-8
              shadow-2xl
              hover:shadow-blue-200
              transition-all
              duration-500
            "
          >

            {/* Quote Icon */}

            <div className="text-blue-600 text-4xl mb-6">

              <FaQuoteLeft />

            </div>

            {/* Review */}

            <p className="text-gray-700 leading-8 mb-6 italic">
              "{item.text}"
            </p>

            {/* User Info */}

            <div>

              <h3 className="text-2xl font-bold text-gray-800">
                {item.name}
              </h3>

              <p className="text-blue-600 font-medium">
                {item.course}
              </p>

            </div>

          </motion.div>

        ))}

      </div>

    </div>

  );
}

export default Testimonials;
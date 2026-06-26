import { motion } from "framer-motion";
import { FaChalkboardTeacher } from "react-icons/fa";

function Teachers() {

  const teachers = [
       {
      name: "Dinesh Sir",
      subject: "Mathematics",
      experience: "8+ Years Experience"
    }, 
    {
      name: "Rajesh Sharma",
      subject: "Physics",
      experience: "10+ Years Experience"
    },
    {
      name: "Patil Madam",
      subject: "Chemistry",
      experience: "6+ Years Experience"
    }
  ];

  return (

    <div className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      {/* Heading */}

      <div className="text-center mb-16">

        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Our Expert Teachers
        </h1>

        <p className="text-gray-600 text-lg">
          Experienced Faculty For 10th & 12th Board Preparation
        </p>

      </div>

      {/* Teacher Cards */}

      <div className="container mx-auto grid md:grid-cols-3 gap-10 px-6">

        {teachers.map((teacher, index) => (

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
              hover:shadow-indigo-200
              transition-all
              duration-500
              border border-white/30
              p-10
              text-center
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
              shadow-lg
              mb-6
            ">

              <FaChalkboardTeacher />

            </div>

            {/* Teacher Info */}

            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              {teacher.name}
            </h2>

            <p className="text-blue-700 font-semibold text-xl mb-4">
              {teacher.subject}
            </p>

            <div className="
              inline-block
              bg-blue-100
              text-blue-700
              px-5
              py-2
              rounded-full
              text-sm
              font-medium
              mb-6
            ">

              {teacher.experience}

            </div>

            <p className="text-gray-600 leading-8">
              Dedicated to helping students achieve excellent
              board exam results through conceptual learning
              and regular practice.
            </p>

          </motion.div>

        ))}

      </div>

    </div>

  );
}

export default Teachers;
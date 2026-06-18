import { motion } from "framer-motion";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";

function Contact() {

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

          Contact Us

        </h1>

        <p className="
          text-gray-600
          text-lg
          md:text-2xl
          max-w-3xl
          mx-auto
          leading-9
        ">

          Get In Touch With Swami Coaching Classes

        </p>

      </motion.div>

      {/* Main Section */}

      <div className="
        container
        mx-auto
        grid
        md:grid-cols-2
        gap-16
        items-start
      ">

        {/* Left Contact Info */}

        <motion.div

          initial={{ opacity: 0, x: -80 }}

          whileInView={{ opacity: 1, x: 0 }}

          transition={{ duration: 0.8 }}

          className="space-y-8"
        >

          {/* Phone */}

          <div className="
            bg-white/80
            backdrop-blur-lg
            rounded-3xl
            shadow-2xl
            border
            border-white/30
            p-8
            flex
            items-center
            gap-6
            hover:shadow-blue-200
            transition-all
            duration-500
          ">

            <div className="
              w-20
              h-20
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-700
              flex
              items-center
              justify-center
              text-white
              text-3xl
              shadow-xl
            ">

              <FaPhoneAlt />

            </div>

            <div>

              <h2 className="
                text-2xl
                font-bold
                text-gray-800
                mb-2
              ">

                Phone Number

              </h2>

              <p className="text-gray-600 text-lg">
                +91 98xxxxxxxxx
              </p>

            </div>

          </div>

          {/* Email */}

          <div className="
            bg-white/80
            backdrop-blur-lg
            rounded-3xl
            shadow-2xl
            border
            border-white/30
            p-8
            flex
            items-center
            gap-6
            hover:shadow-blue-200
            transition-all
            duration-500
          ">

            <div className="
              w-20
              h-20
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-700
              flex
              items-center
              justify-center
              text-white
              text-3xl
              shadow-xl
            ">

              <FaEnvelope />

            </div>

            <div>

              <h2 className="
                text-2xl
                font-bold
                text-gray-800
                mb-2
              ">

                Email Address

              </h2>

              <p className="text-gray-600 text-lg">
                swamicoaching@gmail.com
              </p>

            </div>

          </div>

          {/* Address */}

          <div className="
            bg-white/80
            backdrop-blur-lg
            rounded-3xl
            shadow-2xl
            border
            border-white/30
            p-8
            flex
            items-center
            gap-6
            hover:shadow-blue-200
            transition-all
            duration-500
          ">

            <div className="
              w-20
              h-20
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-700
              flex
              items-center
              justify-center
              text-white
              text-3xl
              shadow-xl
            ">

              <FaMapMarkerAlt />

            </div>

            <div>

              <h2 className="
                text-2xl
                font-bold
                text-gray-800
                mb-2
              ">

                Address

              </h2>

              <p className="text-gray-600 text-lg">
                Maharashtra, India
              </p>

            </div>

          </div>

        </motion.div>

        {/* Contact Form */}

        <motion.div

          initial={{ opacity: 0, x: 80 }}

          whileInView={{ opacity: 1, x: 0 }}

          transition={{ duration: 0.8 }}

          className="
            bg-white/80
            backdrop-blur-lg
            rounded-3xl
            shadow-2xl
            border
            border-white/30
            p-10
            hover:shadow-blue-200
            transition-all
            duration-500
          "
        >

          <h2 className="
            text-4xl
            font-bold
            text-gray-800
            mb-8
          ">

            Send Message

          </h2>

          <form className="space-y-6">

            <input
              type="text"
              placeholder="Your Name"
              className="
                w-full
                border
                border-gray-200
                p-4
                rounded-2xl
                outline-none
                focus:ring-2
                focus:ring-blue-500
                text-lg
              "
            />

            <input
              type="email"
              placeholder="Your Email"
              className="
                w-full
                border
                border-gray-200
                p-4
                rounded-2xl
                outline-none
                focus:ring-2
                focus:ring-blue-500
                text-lg
              "
            />

            <textarea
              rows="5"
              placeholder="Your Message"
              className="
                w-full
                border
                border-gray-200
                p-4
                rounded-2xl
                outline-none
                focus:ring-2
                focus:ring-blue-500
                text-lg
              "
            />

            <motion.button

              whileHover={{
                scale: 1.05
              }}

              whileTap={{
                scale: 0.95
              }}

              className="
                w-full
                bg-gradient-to-r
                from-blue-600
                to-indigo-700
                text-white
                py-4
                rounded-2xl
                text-lg
                font-bold
                shadow-xl
                hover:shadow-blue-300
                transition-all
                duration-300
              "
            >

              Send Message

            </motion.button>

          </form>

        </motion.div>

      </div>

    </div>

  );
}

export default Contact;
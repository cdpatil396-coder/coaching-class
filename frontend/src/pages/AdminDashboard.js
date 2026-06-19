
import { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import API_URL from "../apiConfig";

import {
  FaUserGraduate,
  FaUsers,
  FaBookOpen,
  FaChalkboardTeacher,
  FaTrash,
  FaEdit,
  FaSignOutAlt
} from "react-icons/fa";

function AdminDashboard() {

  const navigate = useNavigate();

  const [admissions, setAdmissions] =
  useState([]);

  /* Edit States */

  const [editingStudent, setEditingStudent] =
  useState(null);
  const [selectedBatch, setSelectedBatch] =
  useState("10th");

  const [formData, setFormData] =
  useState({
    studentName: "",
    phone: "",
    email: "",
    studentClass: "",
    course: "",
    address: ""
  });

  const batchClasses = [
    "10th",
    "11th",
    "12th"
  ];

  const courseSections = [
    "Mathematics",
    "Science",
    "English"
  ];

  const getBatchAdmissions = (batch) =>
    admissions.filter((student) =>
      student.studentClass === batch
    );

  const getCourseAdmissions = (
    batch,
    course
  ) =>
    admissions.filter((student) =>
      student.studentClass === batch &&
      student.course === course
    );

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

    window.location.reload();

  };

  useEffect(() => {

    fetchAdmissions();

  }, []);

  /* Fetch Admissions */

  const fetchAdmissions =
  async () => {

    try {

      const token =
      localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/admissions`,
        {
          headers: {
            Authorization:
            `Bearer ${token}`
          }
        }
      );

      setAdmissions(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  /* Delete Student */

  const deleteStudent =
  async (id) => {

    const confirmDelete =
    window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {

      const token =
      localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/admissions/${id}`,
        {
          headers: {
            Authorization:
            `Bearer ${token}`
          }
        }
      );

      fetchAdmissions();

    } catch (error) {

      console.log(error);

    }

  };

  /* Edit Student */

  const editStudent = (student) => {

    setEditingStudent(student._id);

    setFormData({

      studentName:
      student.studentName,

      phone:
      student.phone,

      email:
      student.email || "",

      studentClass:
      student.studentClass,

      course:
      student.course,

      address:
      student.address

    });

  };

  /* Update Student */

  const updateStudent =
  async () => {

    try {

      const token =
      localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/admissions/${editingStudent}`,
        formData,
        {
          headers: {
            Authorization:
            `Bearer ${token}`
          }
        }
      );

      setEditingStudent(null);

      fetchAdmissions();

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-slate-100
      via-blue-50
      to-indigo-100
      p-6
      md:p-10
    ">

      {/* Heading */}

      <motion.div

        initial={{
          opacity: 0,
          y: -50
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        transition={{
          duration: 0.7
        }}

        className="
          mb-12
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-5
        "
      >

        <div>

          <h1 className="
            text-4xl
            md:text-5xl
            font-extrabold
            bg-gradient-to-r
            from-blue-700
            to-indigo-700
            bg-clip-text
            text-transparent
            mb-3
          ">

            Admin Dashboard

          </h1>

          <p className="
            text-gray-600
            text-lg
          ">

            Welcome to Swami Coaching Classes Admin Panel

          </p>

        </div>

        <button
          onClick={logout}
          className="
            inline-flex
            items-center
            justify-center
            gap-3
            bg-red-500
            hover:bg-red-600
            text-white
            px-6
            py-3
            rounded-xl
            font-bold
            shadow-lg
            transition
          "
        >
          <FaSignOutAlt />
          Logout
        </button>

      </motion.div>

      {/* Dashboard Cards */}

      <div className="
        grid
        md:grid-cols-3
        gap-8
        mb-14
      ">

        <motion.div

          whileHover={{
            scale: 1.03
          }}

          className="
            bg-gradient-to-r
            from-blue-600
            to-indigo-700
            text-white
            rounded-3xl
            shadow-2xl
            p-8
          "
        >

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-lg
                mb-2
              ">
                Total Admissions
              </p>

              <h2 className="
                text-5xl
                font-bold
              ">
                {admissions.length}
              </h2>

            </div>

            <FaUserGraduate className="
              text-6xl
              opacity-80
            " />

          </div>

        </motion.div>

        <motion.div

          whileHover={{
            scale: 1.03
          }}

          className="
            bg-gradient-to-r
            from-green-500
            to-emerald-600
            text-white
            rounded-3xl
            shadow-2xl
            p-8
          "
        >

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-lg
                mb-2
              ">
                Total Courses
              </p>

              <h2 className="
                text-5xl
                font-bold
              ">
                4
              </h2>

            </div>

            <FaBookOpen className="
              text-6xl
              opacity-80
            " />

          </div>

        </motion.div>

        <motion.div

          whileHover={{
            scale: 1.03
          }}

          className="
            bg-gradient-to-r
            from-pink-500
            to-rose-600
            text-white
            rounded-3xl
            shadow-2xl
            p-8
          "
        >

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-lg
                mb-2
              ">
                Expert Teachers
              </p>

              <h2 className="
                text-5xl
                font-bold
              ">
                5
              </h2>

            </div>

            <FaChalkboardTeacher className="
              text-6xl
              opacity-80
            " />

          </div>

        </motion.div>

      </div>

      {/* Batch Icons */}

      <div className="
        grid
        md:grid-cols-3
        gap-6
        mb-8
      ">

        {batchClasses.map((batch) => {

          const batchAdmissions =
          getBatchAdmissions(batch);

          const isActive =
          selectedBatch === batch;

          return (

            <motion.button
              key={batch}
              type="button"
              whileHover={{
                y: -4
              }}
              whileTap={{
                scale: 0.98
              }}
              onClick={() =>
                setSelectedBatch(batch)
              }
              className={`
                text-left
                rounded-3xl
                shadow-xl
                p-6
                border
                transition
                ${isActive
                  ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white border-blue-500"
                  : "bg-white text-gray-900 border-blue-100 hover:border-blue-300"}
              `}
            >

              <div className="
                flex
                items-center
                justify-between
                gap-4
              ">

                <div className="
                  flex
                  items-center
                  gap-4
                ">

                  <div className={`
                    w-16
                    h-16
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    text-3xl
                    ${isActive
                      ? "bg-white/20"
                      : "bg-blue-50 text-blue-700"}
                  `}>
                    <FaUsers />
                  </div>

                  <div>

                    <p className={`
                      text-sm
                      font-semibold
                      ${isActive
                        ? "text-blue-100"
                        : "text-gray-500"}
                    `}>
                      Click to view
                    </p>

                    <h3 className="
                      text-3xl
                      font-bold
                    ">
                      {batch} Batch
                    </h3>

                  </div>

                </div>

                <span className={`
                  text-4xl
                  font-extrabold
                  ${isActive
                    ? "text-white"
                    : "text-blue-700"}
                `}>
                  {batchAdmissions.length}
                </span>

              </div>

            </motion.button>

          );

        })}

      </div>

      {/* Selected Batch Course Lists */}

      <div className="
        bg-white
        rounded-3xl
        shadow-2xl
        border
        border-blue-100
        overflow-hidden
        mb-14
      ">

        <div className="
          bg-gradient-to-r
          from-slate-900
          to-blue-800
          text-white
          p-6
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-3
        ">

          <div>

            <p className="text-blue-100 font-semibold">
              Section Wise Student List
            </p>

            <h2 className="
              text-3xl
              font-bold
            ">
              {selectedBatch} Batch Students
            </h2>

          </div>

          <div className="
            flex
            items-center
            gap-3
            text-lg
            font-bold
          ">
            <FaUserGraduate />
            {getBatchAdmissions(selectedBatch).length} Students
          </div>

        </div>

        <div className="
          grid
          lg:grid-cols-3
          gap-6
          p-6
        ">

          {courseSections.map((course) => {

            const courseAdmissions =
            getCourseAdmissions(
              selectedBatch,
              course
            );

            return (

              <div
                key={course}
                className="
                  border
                  border-gray-100
                  rounded-2xl
                  bg-gray-50
                  overflow-hidden
                "
              >

                <div className="
                  bg-white
                  p-5
                  border-b
                  border-gray-100
                  flex
                  items-center
                  justify-between
                ">

                  <div className="
                    flex
                    items-center
                    gap-3
                  ">

                    <div className="
                      w-11
                      h-11
                      rounded-xl
                      bg-blue-100
                      text-blue-700
                      flex
                      items-center
                      justify-center
                      text-xl
                    ">
                      <FaBookOpen />
                    </div>

                    <h3 className="
                      text-xl
                      font-bold
                      text-gray-900
                    ">
                      {course}
                    </h3>

                  </div>

                  <span className="
                    bg-blue-700
                    text-white
                    rounded-full
                    px-3
                    py-1
                    text-sm
                    font-bold
                  ">
                    {courseAdmissions.length}
                  </span>

                </div>

                <div className="p-5 space-y-4">

                  {courseAdmissions.length ? (

                    courseAdmissions.map((student) => (

                      <div
                        key={student._id}
                        className="
                          bg-white
                          rounded-2xl
                          border
                          border-gray-100
                          p-4
                          shadow-sm
                        "
                      >

                        <h4 className="
                          font-bold
                          text-gray-900
                          mb-1
                        ">
                          {student.studentName}
                        </h4>

                        <p className="text-sm text-gray-600">
                          {student.phone}
                        </p>

                        <p className="text-sm text-gray-500">
                          {student.email}
                        </p>

                        <p className="
                          text-sm
                          text-blue-700
                          font-semibold
                          mt-2
                        ">
                          {student.course}
                        </p>

                      </div>

                    ))

                  ) : (

                    <p className="
                      text-gray-500
                      text-sm
                      py-6
                    ">
                      No {course} students in {selectedBatch} batch yet.
                    </p>

                  )}

                </div>

              </div>

            );

          })}

        </div>

      </div>

      {/* Admissions Table */}

      <div className="
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-x-auto
      ">

        <div className="
          bg-gradient-to-r
          from-blue-600
          to-indigo-700
          text-white
          p-6
        ">

          <h2 className="
            text-3xl
            font-bold
          ">

            Student Admissions

          </h2>

        </div>

        <table className="
          w-full
          text-left
        ">

          <thead className="
            bg-blue-50
          ">

            <tr>

              <th className="p-5">
                #
              </th>

              <th className="p-5">
                Name
              </th>

              <th className="p-5">
                Phone
              </th>

              <th className="p-5">
                Email
              </th>

              <th className="p-5">
                Class
              </th>

              <th className="p-5">
                Course
              </th>

              <th className="p-5">
                Address
              </th>

              <th className="p-5">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {admissions.map((item, index) => (

              <tr
                key={item._id}
                className="
                  border-b
                  hover:bg-blue-50
                "
              >

                <td className="p-5">
                  {index + 1}
                </td>

                <td className="p-5">
                  {item.studentName}
                </td>

                <td className="p-5">
                  {item.phone}
                </td>

                <td className="p-5">
                  {item.email}
                </td>

                <td className="p-5">
                  {item.studentClass}
                </td>

                <td className="p-5">
                  {item.course}
                </td>

                <td className="p-5">
                  {item.address}
                </td>

                <td className="
                  p-5
                  flex
                  gap-3
                ">

                  <button

                    onClick={() =>
                      editStudent(item)
                    }

                    className="
                      bg-blue-500
                      text-white
                      px-4
                      py-2
                      rounded-xl
                      hover:bg-blue-600
                      transition
                    "
                  >

                    <FaEdit />

                  </button>

                  <button

                    onClick={() =>
                      deleteStudent(item._id)
                    }

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

                    <FaTrash />

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Edit Modal */}

      {editingStudent && (

        <div className="
          fixed
          inset-0
          bg-black/50
          flex
          items-center
          justify-center
          z-50
        ">

          <div className="
            bg-white
            p-8
            rounded-3xl
            w-full
            max-w-lg
          ">

            <h2 className="
              text-3xl
              font-bold
              mb-6
            ">

              Edit Student

            </h2>

            <input
              type="text"
              placeholder="Student Name"
              value={formData.studentName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  studentName:
                  e.target.value
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-4
              "
            />

            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone:
                  e.target.value
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-4
              "
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email:
                  e.target.value
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-4
              "
            />

            <select
              value={formData.studentClass}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  studentClass:
                  e.target.value
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-4
              "
            >
              <option value="">
                Select Class
              </option>
              <option value="10th">
                10th
              </option>
              <option value="11th">
                11th
              </option>
              <option value="12th">
                12th
              </option>
            </select>

            <input
              type="text"
              placeholder="Course"
              value={formData.course}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  course:
                  e.target.value
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-4
              "
            />

            <textarea
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address:
                  e.target.value
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-6
              "
            />

            <div className="
              flex
              gap-4
            ">

              <button

                onClick={updateStudent}

                className="
                  bg-blue-600
                  text-white
                  px-6
                  py-3
                  rounded-xl
                "
              >

                Update

              </button>

              <button

                onClick={() =>
                  setEditingStudent(null)
                }

                className="
                  bg-gray-400
                  text-white
                  px-6
                  py-3
                  rounded-xl
                "
              >

                Cancel

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default AdminDashboard;

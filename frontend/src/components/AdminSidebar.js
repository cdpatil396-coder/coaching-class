import { Link } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUserGraduate,
  FaMoneyBillWave,
  FaFilePdf,
  FaPoll,
  FaMoon
} from "react-icons/fa";

function AdminSidebar() {

  return (

    <div className="
      w-72
      min-h-screen
      bg-gradient-to-b
      from-blue-700
      to-indigo-900
      text-white
      p-6
      fixed
      left-0
      top-0
      shadow-2xl
    ">

      <h1 className="
        text-3xl
        font-extrabold
        mb-12
      ">

        Admin Panel

      </h1>

      <div className="
        flex
        flex-col
        gap-5
      ">

        <Link
          to="/admin"
          className="
            flex
            items-center
            gap-4
            hover:bg-white/20
            p-4
            rounded-2xl
            transition
          "
        >

          <FaTachometerAlt />

          Dashboard

        </Link>

        <Link
          to="/admin/students"
          className="
            flex
            items-center
            gap-4
            hover:bg-white/20
            p-4
            rounded-2xl
            transition
          "
        >

          <FaUserGraduate />

          Students

        </Link>

        <Link
          to="/admin/fees"
          className="
            flex
            items-center
            gap-4
            hover:bg-white/20
            p-4
            rounded-2xl
            transition
          "
        >

          <FaMoneyBillWave />

          Fees

        </Link>

        <Link
          to="/admin/results"
          className="
            flex
            items-center
            gap-4
            hover:bg-white/20
            p-4
            rounded-2xl
            transition
          "
        >

          <FaPoll />

          Results

        </Link>

        <Link
          to="/admin/notes"
          className="
            flex
            items-center
            gap-4
            hover:bg-white/20
            p-4
            rounded-2xl
            transition
          "
        >

          <FaFilePdf />

          Notes

        </Link>

        <button
          className="
            flex
            items-center
            gap-4
            bg-black/20
            p-4
            rounded-2xl
            mt-10
          "
        >

          <FaMoon />

          Dark Mode

        </button>

      </div>

    </div>

  );
}

export default AdminSidebar;


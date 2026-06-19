import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaEnvelope,
  FaHome,
  FaPhone,
  FaUserGraduate
} from "react-icons/fa";
import API_URL from "../apiConfig";

function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );
  const [admission, setAdmission] =
  useState(null);
  const [loading, setLoading] =
  useState(true);

  useEffect(() => {

    const fetchAdmission = async () => {

      try {

        const token =
        localStorage.getItem("token");

        const res = await axios.get(
          `${API_URL}/api/admissions/me`,
          {
            headers: {
              Authorization:
              `Bearer ${token}`
            }
          }
        );

        setAdmission(res.data);

      } catch (error) {

        setAdmission(null);

      } finally {

        setLoading(false);

      }

    };

    fetchAdmission();

  }, []);

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-cyan-50
      via-white
      to-amber-50
      p-6
    ">

      <div className="
        bg-white/90
        shadow-2xl
        rounded-2xl
        p-8
        w-full
        max-w-5xl
        border
        border-white
      ">

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-5
          mb-8
        ">

          <div>

            <p className="
              text-sm
              uppercase
              tracking-wide
              text-blue-700
              font-bold
              mb-2
            ">
              Student Dashboard
            </p>

            <h1 className="
              text-4xl
              font-bold
              text-gray-900
            ">
              Welcome {user?.name}
            </h1>

          </div>

          <button

            onClick={logout}

            className="
              bg-red-500
              hover:bg-red-600
              text-white
              px-8
              py-3
              rounded-xl
              font-bold
              transition
            "
          >

            Logout

          </button>

        </div>

        {loading ? (

          <p className="text-gray-600">
            Loading your admission details...
          </p>

        ) : admission ? (

          <div className="
            grid
            md:grid-cols-2
            gap-5
          ">

            {[
              {
                icon: <FaUserGraduate />,
                label: "Student Name",
                value: admission.studentName
              },
              {
                icon: <FaEnvelope />,
                label: "Email",
                value: admission.email
              },
              {
                icon: <FaPhone />,
                label: "Phone",
                value: admission.phone
              },
              {
                icon: <FaBookOpen />,
                label: "Class & Course",
                value: `${admission.studentClass} - ${admission.course}`
              },
              {
                icon: <FaHome />,
                label: "Address",
                value: admission.address
              }
            ].map((item) => (

              <div
                key={item.label}
                className="
                  bg-gradient-to-br
                  from-white
                  to-blue-50
                  border
                  border-blue-100
                  rounded-2xl
                  p-6
                  shadow-lg
                "
              >

                <div className="
                  text-blue-700
                  text-3xl
                  mb-4
                ">
                  {item.icon}
                </div>

                <p className="
                  text-sm
                  text-gray-500
                  font-semibold
                  mb-1
                ">
                  {item.label}
                </p>

                <p className="
                  text-xl
                  font-bold
                  text-gray-900
                ">
                  {item.value}
                </p>

              </div>

            ))}

          </div>

        ) : (

          <div className="
            bg-yellow-50
            border
            border-yellow-200
            rounded-2xl
            p-6
            text-yellow-800
            font-semibold
          ">
            Admission details not found for this account.
          </div>

        )}

      </div>

    </div>

  );
}

export default Dashboard;

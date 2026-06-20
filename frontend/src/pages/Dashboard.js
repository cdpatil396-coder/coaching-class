import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaEnvelope,
  FaHome,
  FaPhone,
  FaRegCreditCard,
  FaUserGraduate
} from "react-icons/fa";
import API_URL from "../apiConfig";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/admissions/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ecfeff,_#f8fafc_45%,_#fff7ed_100%)] px-4 py-10">
      <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
              Student Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-900">
              Welcome {user?.name}
            </h1>
          </div>

          <button
            onClick={logout}
            className="rounded-2xl bg-red-500 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <p className="text-slate-600">Loading your admission details...</p>
        ) : admission ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                icon: <FaUserGraduate />,
                label: "Student Name",
                value: admission.studentName
              },
              {
                icon: <FaPhone />,
                label: "Phone",
                value: admission.phone
              },
              {
                icon: <FaEnvelope />,
                label: "Email",
                value: admission.email || "Not provided"
              },
              {
                icon: <FaBookOpen />,
                label: "Class",
                value: admission.studentClass
              },
              {
                icon: <FaRegCreditCard />,
                label: "Fee Status",
                value: admission.feeStatus
              },
              {
                icon: <FaHome />,
                label: "Address",
                value: admission.address || "Not provided"
              }
            ].map((item) => {
              const statusColor =
                item.label === "Fee Status"
                  ? admission.feeStatus === "paid"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                  : "bg-white";

              return (
                <div
                  key={item.label}
                  className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-blue-50 p-6 shadow-lg"
                >
                  <div className="mb-4 text-3xl text-blue-700">{item.icon}</div>
                  <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                  <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-lg font-bold ${statusColor}`}>
                    {item.label === "Fee Status"
                      ? item.value.charAt(0).toUpperCase() + item.value.slice(1)
                      : item.value}
                  </p>
                </div>
              );
            })}

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg md:col-span-2 xl:col-span-3">
              <p className="text-sm font-semibold text-slate-500">Selected Courses</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {(admission.courses || []).map((course) => (
                  <span
                    key={course}
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md"
                  >
                    {course}
                  </span>
                ))}
                {!admission.courses?.length && (
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                    No course selected
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 font-semibold text-amber-800">
            Admission details not found for this account.
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

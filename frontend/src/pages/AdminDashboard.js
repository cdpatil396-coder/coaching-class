import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_URL from "../apiConfig";
import {
  FaBookOpen,
  FaRegCreditCard,
  FaUserGraduate,
  FaUsers
} from "react-icons/fa";

const BATCHES = ["10th", "11th", "12th"];

function AdminDashboard() {
  const navigate = useNavigate();
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/admissions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdmissions(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const pending = admissions.filter((item) => item.feeStatus !== "paid").length;
    const paid = admissions.filter((item) => item.feeStatus === "paid").length;
    return { pending, paid };
  }, [admissions]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe,_#f8fafc_40%,_#eef2ff_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-5 rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
              Admin Panel
            </p>
            <h1 className="mt-2 text-4xl font-black">Coaching Center Overview</h1>
            <p className="mt-2 text-white/75">
              Open a batch page to update students, delete records, or change fee status.
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-2xl bg-rose-500 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-rose-600"
          >
            Logout
          </button>
        </motion.div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          {[
            {
              label: "Total Admissions",
              value: admissions.length,
              icon: <FaUserGraduate />,
              className: "from-blue-600 to-indigo-700"
            },
            {
              label: "Paid Fees",
              value: stats.paid,
              icon: <FaRegCreditCard />,
              className: "from-emerald-500 to-green-600"
            },
            {
              label: "Pending Fees",
              value: stats.pending,
              icon: <FaBookOpen />,
              className: "from-amber-500 to-orange-600"
            }
          ].map((card) => (
            <motion.div
              key={card.label}
              whileHover={{ scale: 1.02 }}
              className={`rounded-[2rem] bg-gradient-to-r ${card.className} p-6 text-white shadow-2xl`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg opacity-90">{card.label}</p>
                  <h2 className="mt-3 text-5xl font-black">{card.value}</h2>
                </div>
                <div className="text-6xl opacity-80">{card.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-8 rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
                Batch pages
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Click a batch to open the student list
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Each batch page includes edit, delete, and fee controls.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {BATCHES.map((batch) => {
              const count = admissions.filter((item) => item.studentClass === batch).length;
              return (
                <motion.button
                  key={batch}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/admin/batch/${batch}`)}
                  className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-6 text-left shadow-lg transition hover:border-blue-300 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                        Batch
                      </p>
                      <h3 className="mt-1 text-3xl font-black text-slate-900">{batch}</h3>
                    </div>
                    <div className="rounded-2xl bg-blue-600 p-4 text-3xl text-white">
                      <FaUsers />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">
                    {count} student{count === 1 ? "" : "s"} enrolled
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/90 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
                Quick View
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Latest Admissions
              </h2>
            </div>
            <div className="text-sm font-semibold text-slate-500">
              {loading ? "Loading..." : `${admissions.length} total records`}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Batch</th>
                  <th className="px-6 py-4">Courses</th>
                  <th className="px-6 py-4">Fees</th>
                </tr>
              </thead>
              <tbody>
                {admissions.slice(0, 8).map((item) => (
                  <tr key={item._id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.studentName}</td>
                    <td className="px-6 py-4 text-slate-700">{item.studentClass}</td>
                    <td className="px-6 py-4 text-slate-700">
                      {(item.courses || []).join(", ")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-bold ${
                          item.feeStatus === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {(item.feeStatus || "pending").toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
                {!admissions.length && (
                  <tr>
                    <td className="px-6 py-8 text-slate-500" colSpan={4}>
                      No admissions found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

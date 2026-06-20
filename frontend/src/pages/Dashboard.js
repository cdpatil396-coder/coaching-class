import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaCalendarCheck,
  FaChartBar,
  FaEnvelope,
  FaHome,
  FaFileAlt,
  FaPhone,
  FaRegCreditCard,
  FaUserGraduate
} from "react-icons/fa";
import API_URL from "../apiConfig";

const safeParseUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
};

function Dashboard() {
  const navigate = useNavigate();
  const user = safeParseUser();
  const [admission, setAdmission] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }, [navigate]);

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

        const assignmentRes = await axios.get(
          `${API_URL}/api/education/assignments?batch=${res.data.studentClass}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setAssignments(assignmentRes.data);
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
          return;
        }
        setAdmission(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmission();
  }, [logout]);

  const latestTest =
    admission?.testResults && admission.testResults.length
      ? admission.testResults[admission.testResults.length - 1]
      : null;

  const latestAttendance =
    admission?.attendanceHistory && admission.attendanceHistory.length
      ? admission.attendanceHistory[admission.attendanceHistory.length - 1]
      : null;

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

          {admission?.photoData && (
            <img
              src={admission.photoData}
              alt={admission.studentName}
              className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-xl"
            />
          )}

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
          <div className="space-y-6">
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
                icon: <FaCalendarCheck />,
                label: "Today Attendance",
                value: latestAttendance?.status || "Not marked"
              },
              {
                icon: <FaChartBar />,
                label: "Latest Test",
                value: latestTest
                  ? `${latestTest.testName} - ${latestTest.score}/${latestTest.maxScore}`
                  : "No test results"
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

            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
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

              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
                <p className="text-sm font-semibold text-slate-500">Receipt</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      {admission.receiptNo || "Receipt pending"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {admission.paidAt
                        ? `Paid on ${new Date(admission.paidAt).toLocaleDateString()}`
                        : "Fee receipt appears after payment is marked paid."}
                    </p>
                  </div>
                  <FaFileAlt className="text-4xl text-blue-700" />
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
                <p className="text-sm font-semibold text-slate-500">Assignments</p>
                <div className="mt-4 space-y-3">
                  {assignments.length ? (
                    assignments.map((assignment) => (
                      <div key={assignment._id} className="rounded-2xl bg-slate-50 p-4">
                        <p className="font-bold text-slate-900">{assignment.title}</p>
                        <p className="text-sm text-slate-600">{assignment.course}</p>
                        <p className="text-sm text-slate-500">{assignment.description}</p>
                        {assignment.dueDate && (
                          <p className="mt-2 text-xs font-bold text-blue-700">
                            Due {assignment.dueDate}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No assignments for your batch yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
                <p className="text-sm font-semibold text-slate-500">Analytics</p>
                <div className="mt-4 space-y-4">
                  {[
                    {
                      label: "Attendance Rate",
                      value: admission.attendanceHistory?.length
                        ? `${Math.round(
                            (admission.attendanceHistory.filter((item) => item.status === "present").length /
                              admission.attendanceHistory.length) *
                              100
                          )}%`
                        : "0%"
                    },
                    {
                      label: "Courses Selected",
                      value: `${admission.courses?.length || 0}`
                    },
                    {
                      label: "Tests Completed",
                      value: `${admission.testResults?.length || 0}`
                    }
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                          style={{
                            width:
                              item.label === "Attendance Rate"
                                ? item.value
                                : item.label === "Courses Selected"
                                ? `${Math.min((admission.courses?.length || 0) * 33, 100)}%`
                                : `${Math.min((admission.testResults?.length || 0) * 20, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
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

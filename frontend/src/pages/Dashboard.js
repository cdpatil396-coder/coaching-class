import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaChartBar,
  FaEnvelope,
  FaHome,
  FaFileAlt,
  FaPhone,
  FaRegCreditCard,
  FaUserGraduate
} from "react-icons/fa";
import API_URL from "../apiConfig";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "Not available";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

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

  const downloadFeeReceipt = () => {
    if (!admission || admission.feeStatus !== "paid") return;

    const receiptWindow = window.open("", "_blank", "width=900,height=1200");
    if (!receiptWindow) {
      alert("Popup blocked. Please allow popups to download your receipt.");
      return;
    }

    receiptWindow.document.write(`
      <html>
        <head>
          <title>Fee Receipt ${escapeHtml(admission.receiptNo || admission._id)}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 32px;
              background: #f8fafc;
              color: #0f172a;
            }
            .sheet {
              max-width: 760px;
              margin: 0 auto;
              background: white;
              border-radius: 24px;
              padding: 32px;
              box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
              border: 1px solid #e2e8f0;
            }
            .top {
              display: flex;
              justify-content: space-between;
              gap: 16px;
              align-items: flex-start;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 24px;
            }
            h1 {
              margin: 0;
              font-size: 30px;
              color: #1d4ed8;
            }
            .sub {
              color: #64748b;
              margin-top: 6px;
            }
            .badge {
              padding: 10px 16px;
              border-radius: 999px;
              background: #dcfce7;
              color: #166534;
              font-weight: 700;
              white-space: nowrap;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 16px;
              margin-top: 20px;
            }
            .item {
              padding: 16px;
              border-radius: 18px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
            }
            .label {
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.12em;
              color: #64748b;
              font-weight: 700;
            }
            .value {
              margin-top: 8px;
              font-size: 16px;
              font-weight: 700;
              color: #0f172a;
            }
            .footer {
              margin-top: 28px;
              display: flex;
              justify-content: space-between;
              gap: 16px;
              align-items: flex-end;
              color: #64748b;
              font-size: 12px;
            }
            @media print {
              body {
                background: white;
                padding: 0;
              }
              .sheet {
                box-shadow: none;
                border: none;
                border-radius: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="top">
              <div>
                <h1>Paid Fee Receipt</h1>
                <div class="sub">Swami Coaching Classes</div>
                <div class="sub">A clean payment receipt for student records</div>
              </div>
              <div class="badge">PAID</div>
            </div>

            <div class="grid">
              <div class="item">
                <div class="label">Receipt No</div>
                <div class="value">${escapeHtml(admission.receiptNo || "Pending")}</div>
              </div>
              <div class="item">
                <div class="label">Paid On</div>
                <div class="value">${escapeHtml(
                  admission.paidAt ? new Date(admission.paidAt).toLocaleString() : "Not available"
                )}</div>
              </div>
              <div class="item">
                <div class="label">Student Name</div>
                <div class="value">${escapeHtml(admission.studentName)}</div>
              </div>
              <div class="item">
                <div class="label">Phone</div>
                <div class="value">${escapeHtml(admission.phone)}</div>
              </div>
              <div class="item">
                <div class="label">Class</div>
                <div class="value">${escapeHtml(admission.studentClass)}</div>
              </div>
              <div class="item">
                <div class="label">Admission Date</div>
                <div class="value">${escapeHtml(formatDate(admission.admissionDate || admission.createdAt))}</div>
              </div>
              <div class="item">
                <div class="label">Courses</div>
                <div class="value">${escapeHtml((admission.courses || []).join(", ") || "Not selected")}</div>
              </div>
              <div class="item">
                <div class="label">Fee Status</div>
                <div class="value">${escapeHtml(
                  admission.feeStatus ? admission.feeStatus.charAt(0).toUpperCase() + admission.feeStatus.slice(1) : "Pending"
                )}</div>
              </div>
            </div>

            <div class="grid" style="margin-top: 16px;">
              <div class="item" style="grid-column: 1 / -1;">
                <div class="label">Address</div>
                <div class="value">${escapeHtml(admission.address || "Not provided")}</div>
              </div>
            </div>

            <div class="footer">
              <div>
                <div>Generated automatically for student dashboard.</div>
                <div>Keep this receipt for your records.</div>
              </div>
              <div>Swami Coaching Classes</div>
            </div>
          </div>
          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#ecfeff,_#f8fafc_45%,_#fff7ed_100%)] px-4 py-10">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-300/25 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto w-full max-w-6xl rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
              Student Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-900">
              Welcome {user?.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                Admission date: {formatDate(admission?.admissionDate || admission?.createdAt)}
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                Batch: {admission?.studentClass || "N/A"}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="rounded-2xl bg-red-500 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-red-600"
          >
            Logout
          </button>
        </motion.div>

        {loading ? (
          <p className="text-slate-600">Loading your admission details...</p>
        ) : admission ? (
          <div className="space-y-6">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08 } }
              }}
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
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
                <motion.div
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-blue-50 p-6 shadow-lg"
                >
                  <div className="mb-4 text-3xl text-blue-700">{item.icon}</div>
                  <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                  <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-lg font-bold ${statusColor}`}>
                    {item.label === "Fee Status"
                      ? item.value.charAt(0).toUpperCase() + item.value.slice(1)
                      : item.value}
                  </p>
                </motion.div>
              );
            })}
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg"
              >
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg"
              >
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
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={downloadFeeReceipt}
                    disabled={admission.feeStatus !== "paid"}
                    className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Download Fee PDF
                  </button>
                  <p className="text-sm text-slate-500">
                    {admission.feeStatus === "paid"
                      ? "Your paid receipt includes receipt number, payment date, class, courses, and address."
                      : "The download button becomes available after the admin marks your fee as paid."}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg"
              >
                <p className="text-sm font-semibold text-slate-500">Assignments</p>
                <div className="mt-4 space-y-3">
                  {assignments.length ? (
                    assignments.map((assignment) => (
                      <motion.div
                        key={assignment._id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="rounded-2xl bg-slate-50 p-4"
                      >
                        <p className="font-bold text-slate-900">{assignment.title}</p>
                        <p className="text-sm text-slate-600">{assignment.course}</p>
                        <p className="text-sm text-slate-500">{assignment.description}</p>
                        {assignment.dueDate && (
                          <p className="mt-2 text-xs font-bold text-blue-700">
                            Due {assignment.dueDate}
                          </p>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No assignments for your batch yet.</p>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg"
              >
                <p className="text-sm font-semibold text-slate-500">Analytics</p>
                <div className="mt-4 space-y-4">
                  {[
                    {
                      label: "Courses Selected",
                      value: `${admission.courses?.length || 0}`,
                      max: 3
                    },
                    {
                      label: "Tests Completed",
                      value: `${admission.testResults?.length || 0}`,
                      max: 5
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
                            width: `${Math.min(
                              ((Number(item.value) || 0) / item.max) * 100,
                              100
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
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

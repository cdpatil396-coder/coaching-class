import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import API_URL from "../apiConfig";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCopy,
  FaEdit,
  FaDownload,
  FaFileAlt,
  FaBullhorn,
  FaPhoneAlt,
  FaRegCreditCard,
  FaSave,
  FaSearch,
  FaSortAmountDown,
  FaWhatsapp,
  FaTrash
} from "react-icons/fa";

const COURSE_OPTIONS = ["Mathematics", "Science", "English"];
const VALID_BATCHES = ["10th", "11th", "12th"];

function AdminBatchStudents() {
  const { batch } = useParams();
  const navigate = useNavigate();
  const [admissions, setAdmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [feeFilter, setFeeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [assignments, setAssignments] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentName: "",
    phone: "",
    email: "",
    studentClass: batch || "10th",
    courses: [],
    address: "",
    notes: "",
    feeStatus: "pending"
  });
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    course: COURSE_OPTIONS[0],
    dueDate: ""
  });
  const [testForm, setTestForm] = useState({
    testName: "",
    course: COURSE_OPTIONS[0],
    score: "",
    maxScore: "100",
    date: new Date().toISOString().slice(0, 10)
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchAdmissions = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/admissions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdmissions(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }
      console.log(error);
    }
  }, [navigate]);

  const fetchAssignments = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/api/education/assignments?batch=${batch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAssignments(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }
      console.log(error);
    }
  }, [batch, navigate]);

  useEffect(() => {
    fetchAdmissions();
    fetchAssignments();
  }, [fetchAdmissions, fetchAssignments]);

  const filteredAdmissions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const sorted = admissions.filter((student) => {
      const matchesBatch = student.studentClass === batch;
      const matchesSearch =
        !normalizedSearch ||
        student.studentName?.toLowerCase().includes(normalizedSearch) ||
        student.phone?.toLowerCase().includes(normalizedSearch) ||
          student.email?.toLowerCase().includes(normalizedSearch);
      const matchesFee =
        feeFilter === "all" ||
        (feeFilter === "paid" && student.feeStatus === "paid") ||
        (feeFilter === "pending" && student.feeStatus !== "paid");
      return matchesBatch && matchesSearch && matchesFee;
    });
    return sorted.sort((a, b) => {
      if (sortBy === "name") {
        return (a.studentName || "").localeCompare(b.studentName || "");
      }
      if (sortBy === "paid") {
        return (a.feeStatus || "").localeCompare(b.feeStatus || "");
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [admissions, batch, feeFilter, search, sortBy]);

  const stats = useMemo(() => {
    const total = filteredAdmissions.length;
    const paid = filteredAdmissions.filter((item) => item.feeStatus === "paid").length;
    const pending = total - paid;
    return { total, paid, pending };
  }, [filteredAdmissions]);

  const courseAdmissions = useMemo(() => {
    if (!selectedCourse) return [];
    return filteredAdmissions.filter((student) =>
      (student.courses || []).includes(selectedCourse)
    );
  }, [filteredAdmissions, selectedCourse]);

  const startEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      studentName: student.studentName || "",
      phone: student.phone || "",
      email: student.email || "",
      studentClass: student.studentClass || batch,
      courses: Array.isArray(student.courses) ? student.courses : [],
      address: student.address || "",
      notes: student.notes || "",
      feeStatus: student.feeStatus || "pending"
    });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleCourse = (course) => {
    setFormData((prev) => {
      const active = prev.courses.includes(course);
      return {
        ...prev,
        courses: active
          ? prev.courses.filter((item) => item !== course)
          : [...prev.courses, course]
      };
    });
  };

  const updateStudent = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    if (!formData.courses.length) {
      alert("Please select at least one course");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/admissions/${editingStudent._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setEditingStudent(null);
      fetchAdmissions();
      fetchAssignments();
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const addTestResult = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/admissions/${editingStudent._id}`,
        {
          testResult: testForm
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setTestForm({
        testName: "",
        course: COURSE_OPTIONS[0],
        score: "",
        maxScore: "100",
        date: new Date().toISOString().slice(0, 10)
      });
      fetchAdmissions();
    } catch (error) {
      alert(error.response?.data?.message || "Test save failed");
    }
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/education/assignments`,
        {
          ...assignmentForm,
          batch
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAssignmentForm({
        title: "",
        description: "",
        course: COURSE_OPTIONS[0],
        dueDate: ""
      });
      fetchAssignments();
    } catch (error) {
      alert(error.response?.data?.message || "Assignment save failed");
    }
  };

  const deleteAssignment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/education/assignments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchAssignments();
    } catch (error) {
      alert(error.response?.data?.message || "Assignment delete failed");
    }
  };

  const openReceipt = (student) => {
    const receipt = window.open("", "_blank", "width=700,height=900");
    if (!receipt) return;

    const escapeHtml = (value) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    receipt.document.write(`
      <html>
        <head>
          <title>Receipt ${student.receiptNo || student._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
            .card { border: 1px solid #e2e8f0; border-radius: 24px; padding: 24px; }
            h1 { margin: 0 0 12px; font-size: 28px; }
            .muted { color: #64748b; }
            .row { margin: 10px 0; display: flex; justify-content: space-between; gap: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Fee Receipt</h1>
            <div class="muted">Swami Coaching Classes</div>
            <div class="row"><strong>Receipt No</strong><span>${escapeHtml(student.receiptNo || "Pending")}</span></div>
            <div class="row"><strong>Student</strong><span>${escapeHtml(student.studentName)}</span></div>
            <div class="row"><strong>Phone</strong><span>${escapeHtml(student.phone)}</span></div>
            <div class="row"><strong>Class</strong><span>${escapeHtml(student.studentClass)}</span></div>
            <div class="row"><strong>Courses</strong><span>${escapeHtml((student.courses || []).join(", "))}</span></div>
            <div class="row"><strong>Status</strong><span>${escapeHtml(student.feeStatus || "pending")}</span></div>
            <div class="row"><strong>Paid At</strong><span>${escapeHtml(student.paidAt ? new Date(student.paidAt).toLocaleString() : "N/A")}</span></div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    receipt.document.close();
  };

  const sendReminder = (student) => {
    const message = `Hello ${student.studentName}, this is a reminder from Swami Coaching Classes for your ${student.feeStatus === "paid" ? "next class update" : "pending fee payment"}.`;
    const phone = String(student.phone || "").replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const copyReminder = async (student) => {
    const message = `Hello ${student.studentName}, this is a reminder from Swami Coaching Classes for your ${student.feeStatus === "paid" ? "next class update" : "pending fee payment"}.`;
    await navigator.clipboard.writeText(message);
    alert("Reminder message copied");
  };

  const deleteStudent = async (student) => {
    const confirmDelete = window.confirm(
      `Delete ${student.studentName}? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/admissions/${student._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (editingStudent?._id === student._id) {
        setEditingStudent(null);
      }
      fetchAdmissions();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const exportCsv = () => {
    const rows = (selectedCourse ? courseAdmissions : filteredAdmissions).map((student) => ({
      Name: student.studentName,
      Phone: student.phone,
      Email: student.email || "",
      Batch: student.studentClass,
      Courses: (student.courses || []).join(" | "),
      FeeStatus: student.feeStatus || "pending",
      Notes: student.notes || ""
    }));

    const header = ["Name,Phone,Email,Batch,Courses,FeeStatus,Notes"];
    const body = rows.map((row) =>
      [
        row.Name,
        row.Phone,
        row.Email,
        row.Batch,
        row.Courses,
        row.FeeStatus,
        row.Notes
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    );

    const blob = new Blob([header.concat(body).join("\n")], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${batch}${selectedCourse ? `-${selectedCourse}` : ""}-students.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!VALID_BATCHES.includes(batch)) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-black text-slate-900">Invalid batch</h1>
          <Link
            to="/admin"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 font-bold text-white"
          >
            <FaArrowLeft />
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_45%,_#fff7ed_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 shadow-md transition hover:border-blue-300 hover:text-blue-700"
          >
            <FaArrowLeft />
            Back to Main Admin Panel
          </Link>
          <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white">
            Batch {batch}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
                Batch details
              </p>
              <h1 className="mt-2 text-4xl font-black">{batch} Students</h1>
              <p className="mt-2 max-w-2xl text-white/75">
                Search, edit, delete, or change fee status from this page.
              </p>
            </div>

            <label className="flex w-full max-w-md items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-white/80">
              <FaSearch />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or phone"
                className="w-full bg-transparent outline-none placeholder:text-white/50"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { label: "All fees", value: "all" },
              { label: "Paid", value: "paid" },
              { label: "Pending", value: "pending" }
            ].map((option) => {
              const active = feeFilter === option.value;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setFeeFilter(option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-white text-slate-900 shadow-md"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          {[
            { label: "Students", value: stats.total, color: "from-blue-600 to-indigo-700" },
            { label: "Paid", value: stats.paid, color: "from-emerald-500 to-green-600" },
            { label: "Pending", value: stats.pending, color: "from-rose-500 to-red-600" }
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-[1.75rem] bg-gradient-to-r ${item.color} p-6 text-white shadow-xl`}
            >
              <p className="text-lg opacity-90">{item.label}</p>
              <h2 className="mt-3 text-5xl font-black">{item.value}</h2>
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
                Course wise view
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Tap a course to open the full admission list
              </h2>
            </div>
            {selectedCourse && (
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-md transition hover:border-blue-300 hover:text-blue-700"
              >
                Clear subject filter
              </button>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {COURSE_OPTIONS.map((course) => {
              const courseStudents = filteredAdmissions.filter((student) =>
                (student.courses || []).includes(course)
              );
              const isActive = selectedCourse === course;
              return (
                <button
                  key={course}
                  type="button"
                  onClick={() => setSelectedCourse(course)}
                  className={`rounded-3xl border p-5 text-left transition ${
                    isActive
                      ? "border-blue-500 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl"
                      : "border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-black">{course}</h3>
                    <span className={`rounded-full px-3 py-1 text-sm font-bold ${
                      isActive ? "bg-white text-blue-700" : "bg-blue-600 text-white"
                    }`}>
                      {courseStudents.length}
                    </span>
                  </div>
                  <p className={`mt-3 text-sm ${isActive ? "text-white/80" : "text-slate-500"}`}>
                    {courseStudents.length
                      ? "Click to view and manage every admission in this subject"
                      : "No admissions selected for this subject yet"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8 rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-2xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
                {selectedCourse ? "Subject list" : "Student records"}
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">
                {selectedCourse
                  ? `${selectedCourse} admissions in ${batch}`
                  : `All admissions in ${batch}`}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCourse(null)}
              className="w-fit rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              Show all subjects
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              <FaSortAmountDown className="text-blue-700" />
              Sort
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none"
              >
                <option value="newest">Newest</option>
                <option value="name">Name</option>
                <option value="paid">Fee Status</option>
              </select>
            </label>

            {COURSE_OPTIONS.map((course) => {
              const active = selectedCourse === course;
              const count = filteredAdmissions.filter((student) =>
                (student.courses || []).includes(course)
              ).length;
              return (
                <button
                  type="button"
                  key={course}
                  onClick={() => setSelectedCourse(course)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-blue-700 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {course} <span className="ml-1 opacity-70">({count})</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-slate-800"
            >
              <FaDownload />
              Export CSV
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <FaFileAlt className="text-2xl text-blue-700" />
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
                  Homework / Assignments
                </p>
                <h2 className="text-2xl font-black text-slate-900">
                  Create class assignments
                </h2>
              </div>
            </div>

            <form onSubmit={createAssignment} className="space-y-3">
              <input
                value={assignmentForm.title}
                onChange={(e) =>
                  setAssignmentForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Assignment title"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                required
              />
              <textarea
                value={assignmentForm.description}
                onChange={(e) =>
                  setAssignmentForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Assignment details"
                rows="3"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
              <div className="grid gap-3 md:grid-cols-3">
                <select
                  value={assignmentForm.course}
                  onChange={(e) =>
                    setAssignmentForm((prev) => ({ ...prev, course: e.target.value }))
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  {COURSE_OPTIONS.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={assignmentForm.dueDate}
                  onChange={(e) =>
                    setAssignmentForm((prev) => ({ ...prev, dueDate: e.target.value }))
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-3 font-bold text-white shadow-lg"
                >
                  Add Assignment
                </button>
              </div>
            </form>

            <div className="mt-5 space-y-3">
              {assignments.length ? (
                assignments.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                        <p className="text-sm text-slate-600">{item.course}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteAssignment(item._id)}
                        className="rounded-xl bg-rose-500 px-3 py-2 text-sm font-bold text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No assignments yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
                  Quick access
                </p>
                <h2 className="text-2xl font-black text-slate-900">
                  Find, filter, and edit students faster
                </h2>
              </div>
              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-md transition hover:border-blue-300 hover:text-blue-700"
              >
                <FaDownload />
                Export CSV
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                { label: "Students", value: stats.total, tone: "from-blue-600 to-indigo-700" },
                { label: "Paid", value: stats.paid, tone: "from-emerald-500 to-green-600" },
                { label: "Pending", value: stats.pending, tone: "from-rose-500 to-red-600" }
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl bg-gradient-to-r ${item.tone} p-4 text-white shadow-lg`}
                >
                  <p className="text-sm font-semibold text-white/80">{item.label}</p>
                  <p className="mt-2 text-3xl font-black">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              Select a course to narrow the list, then click <span className="font-bold">Edit</span> to load
              the student details panel on the right.
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {(selectedCourse ? courseAdmissions : filteredAdmissions).map((student) => {
              const active = editingStudent?._id === student._id;
              return (
                <div
                  key={student._id}
                  className={`rounded-[1.75rem] border p-5 shadow-lg transition ${
                    active
                      ? "border-blue-400 bg-blue-50"
                      : "border-white/70 bg-white/90 hover:border-blue-200"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-black text-slate-900">
                          {student.studentName}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            student.feeStatus === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {(student.feeStatus || "pending").toUpperCase()}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                          <FaPhoneAlt />
                          {student.phone}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          {student.studentClass}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          {student.courses?.length || 0} course(s)
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {(student.courses || []).map((course) => (
                          <span
                            key={course}
                            className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-sm"
                          >
                            {course}
                          </span>
                        ))}
                      </div>

                      {student.notes && (
                        <p className="mt-3 max-w-2xl rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                          <span className="font-bold">Note:</span> {student.notes}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                          Receipt: {student.receiptNo || "Pending"}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                          Tests: {student.testResults?.length || 0}
                        </span>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                          Click Edit for full details
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(student)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-bold text-white shadow-md transition hover:bg-blue-700"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteStudent(student)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 font-bold text-white shadow-md transition hover:bg-rose-600"
                      >
                        <FaTrash />
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(student.phone || "");
                          alert("Phone number copied");
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 shadow-md transition hover:border-blue-300 hover:text-blue-700"
                      >
                        <FaCopy />
                        Copy
                      </button>
                      <a
                        href={`https://wa.me/${String(student.phone || "").replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 font-bold text-white shadow-md transition hover:bg-emerald-600"
                      >
                        <FaWhatsapp />
                        WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => openReceipt(student)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 shadow-md transition hover:border-blue-300 hover:text-blue-700"
                      >
                        <FaDownload />
                        Receipt
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStudent(student);
                          sendReminder(student);
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 shadow-md transition hover:border-blue-300 hover:text-blue-700"
                      >
                        <FaBullhorn />
                        WhatsApp Reminder
                      </button>
                      <button
                        type="button"
                        onClick={() => copyReminder(student)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 shadow-md transition hover:border-blue-300 hover:text-blue-700"
                      >
                        <FaBullhorn />
                        Copy Reminder
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStudent(student);
                        setFormData({
                          studentName: student.studentName || "",
                          phone: student.phone || "",
                          email: student.email || "",
                          studentClass: student.studentClass || batch,
                          courses: Array.isArray(student.courses) ? student.courses : [],
                          address: student.address || "",
                          feeStatus: "pending"
                        });
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
                    >
                      <FaRegCreditCard />
                      Mark Pending
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStudent(student);
                        setFormData({
                          studentName: student.studentName || "",
                          phone: student.phone || "",
                          email: student.email || "",
                          studentClass: student.studentClass || batch,
                          courses: Array.isArray(student.courses) ? student.courses : [],
                          address: student.address || "",
                          feeStatus: "paid"
                        });
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      <FaCheckCircle />
                      Mark Paid
                    </button>
                  </div>
                </div>
              );
            })}

            {!(selectedCourse ? courseAdmissions : filteredAdmissions).length && (
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-500 shadow-lg">
                {selectedCourse
                  ? `No ${selectedCourse} students found in ${batch}.`
                  : `No students found for this batch.`}
              </div>
            )}
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-2xl xl:sticky xl:top-6">
            <div className="mb-5">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
                Edit panel
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                {editingStudent ? editingStudent.studentName : "Select a student"}
              </h2>
            </div>

            {editingStudent ? (
              <form onSubmit={updateStudent} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-blue-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Class</p>
                    <p className="mt-1 font-black text-slate-900">{editingStudent.studentClass}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Fee</p>
                    <p className="mt-1 font-black text-slate-900">
                      {(formData.feeStatus || "pending").toUpperCase()}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Receipt</p>
                    <p className="mt-1 truncate font-black text-slate-900">
                      {editingStudent.receiptNo || "Pending"}
                    </p>
                  </div>
                </div>

                <input
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  placeholder="Student name"
                  required
                />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  placeholder="Phone"
                  required
                />

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  placeholder="Email (optional)"
                />

                <select
                  name="studentClass"
                  value={formData.studentClass}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  required
                >
                  {VALID_BATCHES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <select
                  name="feeStatus"
                  value={formData.feeStatus}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>

                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                    Courses
                  </p>
                  <div className="grid gap-3">
                    {COURSE_OPTIONS.map((course) => {
                      const active = formData.courses.includes(course);
                      return (
                        <button
                          type="button"
                          key={course}
                          onClick={() => toggleCourse(course)}
                          className={`rounded-2xl border px-4 py-3 text-left font-semibold transition ${
                            active
                              ? "border-blue-500 bg-blue-600 text-white"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300"
                          }`}
                        >
                          {course}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleFieldChange}
                  rows="4"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  placeholder="Address"
                />

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFieldChange}
                  rows="3"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  placeholder="Notes"
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-3 font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <FaSave />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                    <FaFileAlt className="text-blue-700" />
                    Add Test Result
                  </p>
                  <form onSubmit={addTestResult} className="space-y-3">
                    <input
                      value={testForm.testName}
                      onChange={(e) =>
                        setTestForm((prev) => ({ ...prev, testName: e.target.value }))
                      }
                      placeholder="Test name"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      required
                    />
                    <div className="grid gap-3 md:grid-cols-3">
                      <select
                        value={testForm.course}
                        onChange={(e) =>
                          setTestForm((prev) => ({ ...prev, course: e.target.value }))
                        }
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      >
                        {COURSE_OPTIONS.map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={testForm.score}
                        onChange={(e) =>
                          setTestForm((prev) => ({ ...prev, score: e.target.value }))
                        }
                        placeholder="Score"
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        required
                      />
                      <input
                        type="number"
                        value={testForm.maxScore}
                        onChange={(e) =>
                          setTestForm((prev) => ({ ...prev, maxScore: e.target.value }))
                        }
                        placeholder="Max score"
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        required
                      />
                    </div>
                    <input
                      type="date"
                      value={testForm.date}
                      onChange={(e) =>
                        setTestForm((prev) => ({ ...prev, date: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white"
                    >
                      Save Test Result
                    </button>
                  </form>

                  <div className="mt-4 space-y-2">
                    {(editingStudent.testResults || []).slice(0, 5).map((result, index) => (
                      <div
                        key={`${result.testName}-${index}`}
                        className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm"
                      >
                        <p className="font-bold text-slate-900">{result.testName}</p>
                        <p className="text-slate-500">
                          {result.course} | {result.score}/{result.maxScore} | {result.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-5 text-slate-600">
                Click Edit, Mark Paid, or Mark Pending on any student to load the panel.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBatchStudents;

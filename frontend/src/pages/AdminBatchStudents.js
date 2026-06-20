import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import API_URL from "../apiConfig";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaEdit,
  FaPhoneAlt,
  FaRegCreditCard,
  FaSave,
  FaSearch,
  FaTrash
} from "react-icons/fa";

const COURSE_OPTIONS = ["Mathematics", "Science", "English"];
const VALID_BATCHES = ["10th", "11th", "12th"];

function AdminBatchStudents() {
  const { batch } = useParams();
  const [admissions, setAdmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentName: "",
    phone: "",
    email: "",
    studentClass: batch || "10th",
    courses: [],
    address: "",
    feeStatus: "pending"
  });
  const [saving, setSaving] = useState(false);

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
    }
  };

  const filteredAdmissions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return admissions.filter((student) => {
      const matchesBatch = student.studentClass === batch;
      const matchesSearch =
        !normalizedSearch ||
        student.studentName?.toLowerCase().includes(normalizedSearch) ||
        student.phone?.toLowerCase().includes(normalizedSearch) ||
        student.email?.toLowerCase().includes(normalizedSearch);
      return matchesBatch && matchesSearch;
    });
  }, [admissions, batch, search]);

  const stats = useMemo(() => {
    const total = filteredAdmissions.length;
    const paid = filteredAdmissions.filter((item) => item.feeStatus === "paid").length;
    const pending = total - paid;
    return { total, paid, pending };
  }, [filteredAdmissions]);

  const startEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      studentName: student.studentName || "",
      phone: student.phone || "",
      email: student.email || "",
      studentClass: student.studentClass || batch,
      courses: Array.isArray(student.courses) ? student.courses : [],
      address: student.address || "",
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
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
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
                Students appear in every selected course
              </h2>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {COURSE_OPTIONS.map((course) => {
              const courseStudents = filteredAdmissions.filter((student) =>
                (student.courses || []).includes(course)
              );
              return (
                <div
                  key={course}
                  className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-black text-slate-900">{course}</h3>
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-bold text-white">
                      {courseStudents.length}
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {courseStudents.slice(0, 4).map((student) => (
                      <div
                        key={student._id}
                        className="rounded-2xl bg-white px-4 py-3 shadow-sm"
                      >
                        <p className="font-bold text-slate-900">{student.studentName}</p>
                        <p className="text-sm text-slate-500">{student.phone}</p>
                      </div>
                    ))}
                    {!courseStudents.length && (
                      <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-500">
                        No students selected this course yet.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {filteredAdmissions.map((student) => {
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
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {(student.courses || []).map((course) => (
                          <span
                            key={course}
                            className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white"
                          >
                            {course}
                          </span>
                        ))}
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

            {!filteredAdmissions.length && (
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-500 shadow-lg">
                No students found for this batch.
              </div>
            )}
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-2xl">
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

import { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaLayerGroup,
  FaPhoneAlt,
  FaUserGraduate
} from "react-icons/fa";
import API_URL from "../apiConfig";

const COURSE_OPTIONS = [
  "Mathematics",
  "Science",
  "English"
];

function Admission() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: "",
    phone: "",
    email: "",
    studentClass: "",
    courses: [],
    address: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const selectedCount = useMemo(
    () => formData.courses.length,
    [formData.courses]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleCourse = (course) => {
    setFormData((prev) => {
      const alreadySelected = prev.courses.includes(course);
      return {
        ...prev,
        courses: alreadySelected
          ? prev.courses.filter((item) => item !== course)
          : [...prev.courses, course]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.courses.length) {
      alert("Please select at least one course");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        email: formData.email.trim(),
        address: formData.address.trim()
      };

      const res = await axios.post(
        `${API_URL}/api/admissions`,
        payload
      );

      alert(res.data.message);

      localStorage.setItem("admissionSubmitted", "true");
      localStorage.setItem(
        "pendingAdmission",
        JSON.stringify({
          name: formData.studentName,
          phone: formData.phone.replace(/\D/g, ""),
          email: formData.email.trim().toLowerCase(),
          studentClass: formData.studentClass,
          courses: formData.courses,
          notes: formData.notes
        })
      );

      setFormData({
        studentName: "",
        phone: "",
        email: "",
        studentClass: "",
        courses: [],
        address: "",
        notes: ""
      });

      navigate("/register");
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#eff6ff_40%,_#fdf2f8_100%)] px-4 py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] bg-slate-950 text-white shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-fuchsia-600 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
              Admission
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight">
              Join the batch with multiple course selection
            </h1>
            <p className="mt-4 max-w-xl text-white/85">
              Name, phone number, class, and courses are enough to submit. Email is optional.
            </p>
          </div>

          <div className="grid gap-4 p-8 sm:grid-cols-3">
            {[
              {
                icon: <FaUserGraduate />,
                title: "Simple admission",
                text: "Only the essentials."
              },
              {
                icon: <FaLayerGroup />,
                title: "Multi-course",
                text: "Select more than one course."
              },
              {
                icon: <FaPhoneAlt />,
                title: "Fast contact",
                text: "Phone is the primary login key."
              }
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <div className="mb-4 text-3xl text-cyan-300">{item.icon}</div>
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="mt-2 text-sm text-white/70">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
              Fill details
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Admission Form
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Selected courses: <span className="font-bold text-blue-700">{selectedCount}</span>
            </p>
          </div>

          <div className="grid gap-4">
            <input
              type="text"
              name="studentName"
              placeholder="Student Name"
              value={formData.studentName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address (optional)"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />

            <select
              name="studentClass"
              value={formData.studentClass}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              required
            >
              <option value="">Select Class</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
          </div>

          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Choose Courses</h3>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                Multiple select allowed
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {COURSE_OPTIONS.map((course) => {
                const active = formData.courses.includes(course);
                return (
                  <button
                    type="button"
                    key={course}
                    onClick={() => toggleCourse(course)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      active
                        ? "border-blue-500 bg-blue-600 text-white shadow-lg"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
                          Course
                        </p>
                        <p className="mt-1 text-lg font-bold">{course}</p>
                      </div>
                      {active && <FaCheckCircle className="text-xl" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            name="address"
            placeholder="Address (optional)"
            value={formData.address}
            onChange={handleChange}
            rows="4"
            className="mt-6 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />

          <textarea
            name="notes"
            placeholder="Any special note for the admission team (optional)"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-lg font-bold text-white shadow-xl transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Submit Admission"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}

export default Admission;

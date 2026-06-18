import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import WhatsAppButton from "./components/WhatsAppButton";
import Footer from "./components/Footer";

/* Main Pages */

import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import Admission from "./pages/Admission";

/* Auth Pages */

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

/* Dashboard */

import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Main Routes */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/courses"
          element={<Courses />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* Admission Route */}

        <Route
          path="/admission"
          element={<Admission />}
        />

        {/* Auth Routes */}

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Student Dashboard */}

        <Route

          path="/dashboard"

          element={

            <ProtectedRoute role="student">

              <Dashboard />

            </ProtectedRoute>

          }

        />

        {/* Admin Dashboard */}

        <Route

          path="/admin"

          element={

            <ProtectedRoute role="admin">

              <AdminDashboard />

            </ProtectedRoute>

          }

        />

      </Routes>

      <Footer />

      <WhatsAppButton />

    </BrowserRouter>

  );
}

export default App;

import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

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
      from-blue-100
      to-indigo-200
      p-6
    ">

      <div className="
        bg-white
        shadow-2xl
        rounded-3xl
        p-10
        w-full
        max-w-lg
        text-center
      ">

        <h1 className="
          text-4xl
          font-bold
          text-blue-700
          mb-6
        ">

          Welcome {user?.name}

        </h1>

        <p className="
          text-gray-600
          text-lg
          mb-8
        ">

          Student Dashboard

        </p>

        <button

          onClick={logout}

          className="
            bg-red-500
            hover:bg-red-600
            text-white
            px-8
            py-3
            rounded-2xl
            font-bold
            transition
          "
        >

          Logout

        </button>

      </div>

    </div>

  );
}

export default Dashboard;
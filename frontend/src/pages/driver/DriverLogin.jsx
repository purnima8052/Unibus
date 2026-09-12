import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DriverLogin() {
  const [form, setForm] = useState({
    busId: "",
    password: "",
  });

  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/driver/login", form);

      login(
        {
          ...res.data.driver,
          role: "driver",
        },
        res.data.token
      );

      navigate("/driver/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-bold">Driver Login</h2>

        <input
          type="text"
          placeholder="Bus ID"
          className="w-full border p-2 rounded"
          value={form.busId}
          onChange={(e) =>
            setForm({
              ...form,
              busId: e.target.value,
            })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

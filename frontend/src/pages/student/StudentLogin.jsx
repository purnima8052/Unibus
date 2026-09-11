
import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function StudentLogin() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/login", form);

            login(res.data.user, res.data.token);
            navigate("/student/dashboard");

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
                <h2 className="text-xl font-bold">
                    Student Login
                </h2>

                <input
                    placeholder="Email"
                    type="email"
                    className="w-full border p-2 rounded"
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    required
                />

                <input
                    placeholder="Password"
                    type="password"
                    className="w-full border p-2 rounded"
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    Login
                </button>

                {error && (
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                )}

                <p className="text-sm text-center">
                    No account?{" "}
                    <Link
                        to="/student/register"
                        className="text-blue-600"
                    >
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}


import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function StudentRegister() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        uid: "",
        course: "",
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/register", form);
            setMessage(res.data.message);

            setTimeout(() => navigate("/student/login"), 2000);
        } catch (err) {
            setMessage(
                err.response?.data?.message || "Registration failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-96"
            >
                <h2 className="text-xl font-bold mb-4">
                    Student Registration
                </h2>

                {["name", "email", "password", "uid", "course"].map((field) => (
                    <input
                        key={field}
                        name={field}
                        placeholder={field.toUpperCase()}
                        type={field === "password" ? "password" : "text"}
                        className="w-full border p-2 rounded mb-3"
                        onChange={handleChange}
                        required
                    />
                ))}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    Register
                </button>

                {message && (
                    <p className="text-sm text-center text-red-600 mt-3">
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
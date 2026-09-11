import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
    const navigate = useNavigate();

    const roles = [
        { label: "Student", path: "/student/login" },
        { label: "Parent", path: "/parent/login" },
        { label: "Driver", path: "/driver/login" },
        { label: "Admin", path: "/admin/login" },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-3">
            <h1 className="text-3xl font-bold mb-6">CU Bus Tracker</h1>

            {roles.map((r) => (
                <button
                    key={r.label}
                    onClick={() => navigate(r.path)}
                    className="w-64 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Continue as {r.label}
                </button>
            ))}
        </div>
    );
}
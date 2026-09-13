import { useState } from "react";
import api from "../../services/api";

export default function AdminDashboard() {
  const [tab, setTab] = useState("buses");

  const tabs = [
    "buses",
    "routes",
    "drivers",
    "students",
    "bulk-upload",
    "complaints",
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6 border-b">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 px-2 capitalize ${
              tab === t
                ? "border-b-2 border-blue-600 font-bold"
                : "text-gray-600"
            }`}
          >
            {t.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "buses" && <BusesSection />}
      {tab === "routes" && <RoutesSection />}
      {tab === "drivers" && <DriversSection />}
      {tab === "students" && <StudentsSection />}
      {tab === "bulk-upload" && <BulkUploadSection />}
      {tab === "complaints" && <ComplaintsSection />}
    </div>
  );
}

/* =========================
   Bulk Upload
========================= */

function BulkUploadSection() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const upload = async () => {
    if (!file) {
      setError("Please select an Excel file first.");
      return;
    }

    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(
        "/admin/students/bulk-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Upload failed. Please try again."
      );
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold">
        Bulk Student Upload
      </h2>

      <p className="text-sm text-gray-600">
        Upload an Excel file with columns:{" "}
        <b>uid, name, course</b>
      </p>

      <input
        type="file"
        accept=".xlsx,.xls"
        className="block w-full border p-2 rounded"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
          setError("");
          setResult(null);
        }}
      />

      <button
        onClick={upload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {result && (
        <p className="text-sm text-green-700">
          Done — {result.autoApproved} auto-approved,{" "}
          {result.preAdded} pre-registered.
        </p>
      )}
    </div>
  );
}

/* =========================
   Buses
========================= */

function BusesSection() {
  return (
    <div className="border rounded p-4">
      <h2 className="font-bold text-lg">Buses</h2>
      <p className="text-gray-600 text-sm mt-1">
        Manage buses here.
      </p>
    </div>
  );
}

/* =========================
   Routes
========================= */

function RoutesSection() {
  return (
    <div className="border rounded p-4">
      <h2 className="font-bold text-lg">Routes</h2>
      <p className="text-gray-600 text-sm mt-1">
        Manage routes here.
      </p>
    </div>
  );
}

/* =========================
   Drivers
========================= */

function DriversSection() {
  return (
    <div className="border rounded p-4">
      <h2 className="font-bold text-lg">Drivers</h2>
      <p className="text-gray-600 text-sm mt-1">
        Manage drivers here.
      </p>
    </div>
  );
}

/* =========================
   Students
========================= */

function StudentsSection() {
  return (
    <div className="border rounded p-4">
      <h2 className="font-bold text-lg">Students</h2>
      <p className="text-gray-600 text-sm mt-1">
        Manage students here.
      </p>
    </div>
  );
}

/* =========================
   Complaints
========================= */

function ComplaintsSection() {
  return (
    <div className="border rounded p-4">
      <h2 className="font-bold text-lg">Complaints</h2>
      <p className="text-gray-600 text-sm mt-1">
        Manage complaints here.
      </p>
    </div>
  );
}

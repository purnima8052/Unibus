import { useState } from "react";
import api from "../../services/api";

export default function ComplaintForm({ busId }) {
    const [type, setType] = useState("complaint");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const submit = async () => {
        if (!message.trim()) {
            setError("Please describe the issue.");
            return;
        }

        try {
            setError("");
            setSent(false);

            await api.post("/complaints", {
                busId,
                type,
                message,
            });

            setSent(true);
            setMessage("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to submit complaint."
            );
        }
    };

    return (
        <div className="border p-4 rounded space-y-2">
            <h3 className="font-bold">
                Report an Issue
            </h3>

            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border p-2 rounded"
            >
                <option value="emergency">
                    [ALERT] Emergency
                </option>

                <option value="complaint">
                    General Complaint
                </option>

                <option value="driver_behavior">
                    Driver Behavior
                </option>

                <option value="other">
                    Other
                </option>
            </select>

            <textarea
                placeholder="Describe the issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border p-2 rounded"
                rows={4}
            />

            <button
                onClick={submit}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Submit
            </button>

            {sent && (
                <p className="text-green-600 text-sm">
                    Submitted to admin [OK]
                </p>
            )}

            {error && (
                <p className="text-red-600 text-sm">
                    {error}
                </p>
            )}
        </div>
    );
}

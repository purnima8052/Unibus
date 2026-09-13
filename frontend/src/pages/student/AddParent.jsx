import { useState } from "react";
import api from "../../services/api";

export default function AddParent() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        password: "",
    });

    const [msg, setMsg] = useState("");

    const submit = async () => {
        try {
            setMsg("");

            await api.post("/parents", form);

            setMsg("Parent added successfully!");

            setForm({
                name: "",
                phone: "",
                password: "",
            });
        } catch (err) {
            setMsg(
                err.response?.data?.message ||
                "Failed to add parent"
            );
        }
    };

    return (
        <div className="border p-4 rounded space-y-2">
            <h3 className="font-bold">
                Add Parent (Max 2)
            </h3>

            <input
                type="text"
                placeholder="Parent Name"
                value={form.name}
                className="w-full border p-2 rounded"
                onChange={(e) =>
                    setForm({
                        ...form,
                        name: e.target.value,
                    })
                }
            />

            <input
                type="tel"
                placeholder="Parent Phone"
                value={form.phone}
                className="w-full border p-2 rounded"
                onChange={(e) =>
                    setForm({
                        ...form,
                        phone: e.target.value,
                    })
                }
            />

            <input
                type="password"
                placeholder="Set a Password for Parent"
                value={form.password}
                className="w-full border p-2 rounded"
                onChange={(e) =>
                    setForm({
                        ...form,
                        password: e.target.value,
                    })
                }
            />

            <button
                type="button"
                onClick={submit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Add Parent
            </button>

            {msg && (
                <p className="text-sm">
                    {msg}
                </p>
            )}
        </div>
    );
}

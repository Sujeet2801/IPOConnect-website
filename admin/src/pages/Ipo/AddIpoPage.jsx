import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerIpo } from "../../services/api/api.js";
import { useAuth } from "../../hooks/useAuth.jsx";

const AddUpcomingIpoPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        companyName: "",
        priceBand: "" || "To be announced",
        openDate: "",
        closeDate: "",
        issueSize: "" || "To be announced",
        issueType: "",
        listingDate: "",
        status: "UPCOMING",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formattedFormData = {
                ...formData,
                openDate: new Date(formData.openDate).toISOString(),
                closeDate: new Date(formData.closeDate).toISOString(),
                listingDate: new Date(formData.listingDate).toISOString(),
            };

            await registerIpo(formattedFormData);
            alert("IPO registered successfully!");
            navigate("/ipos"); 
        } catch (err) {
            setError("Failed to register IPO. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== "ADMIN") {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                You are not authorized to add an IPO.
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 bg-white rounded-lg shadow mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Upcoming IPO</h2>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {[ 
                    { label: "Company Name", name: "companyName", type: "text" },
                    { label: "Price Band", name: "priceBand", type: "text" },
                    { label: "Open Date", name: "openDate", type: "date" },
                    { label: "Close Date", name: "closeDate", type: "date" },
                    { label: "Issue Size", name: "issueSize", type: "text" },
                    { label: "Issue Type", name: "issueType", type: "text" },
                    { label: "Listing Date", name: "listingDate", type: "date" },
                ].map(({ label, name, type }) => (
                    <div key={name}>
                        <label className="block font-semibold text-gray-700 mb-1">{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                ))}

                <div>
                    <label className="block font-semibold text-gray-700 mb-1">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="UPCOMING">UPCOMING</option>
                        <option value="ONGOING">ONGOING</option>
                        <option value="LISTED">LISTED</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Registering..." : "Add IPO"}
                </button>
            </form>
        </div>
    );
};

export default AddUpcomingIpoPage;

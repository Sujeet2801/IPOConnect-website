import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateIpo } from "../../services/api/api.js";
import { useAuth } from "../../hooks/useAuth.jsx";

const EditIpoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ipo } = location.state || {};
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    companyName: "",
    openDate: "",
    closeDate: "",
    priceBand: "",
    issueSize: "",
    issueType: "",
    listingDate: "",
    status: "UPCOMING",
  });

  // Helper to format date to yyyy-MM-dd
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (ipo) {
      setFormData({
        companyName: ipo.companyName || "",
        openDate: ipo.openDate ? formatDate(ipo.openDate) : "",
        closeDate: ipo.closeDate ? formatDate(ipo.closeDate) : "",
        priceBand: ipo.priceBand || "",
        issueSize: ipo.issueSize || "",
        issueType: ipo.issueType || "",
        listingDate: ipo.listingDate ? formatDate(ipo.listingDate) : "",
        status: ipo.status || "UPCOMING",
      });
    }
  }, [ipo]);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        You are not authorized to update IPOs.
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert date fields to ISO format if they are not empty
    const formattedData = {
      ...formData,
      openDate: formData.openDate ? new Date(formData.openDate).toISOString() : null,
      closeDate: formData.closeDate ? new Date(formData.closeDate).toISOString() : null,
      listingDate: formData.listingDate ? new Date(formData.listingDate).toISOString() : null,
    };

    try {
      await updateIpo(ipo.companyName.split(" ").join("-"), formattedData);
      console.log(formattedData);
      alert("IPO updated successfully!");
      navigate("/ipos");
    } catch (err) {
      console.error("Error updating IPO:", err);
      alert("Failed to update IPO.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 bg-white rounded-lg shadow mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Update Upcoming IPO
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Company Name", name: "companyName", type: "text" },
          { label: "Open Date", name: "openDate", type: "date" },
          { label: "Close Date", name: "closeDate", type: "date" },
          { label: "Price Band", name: "priceBand", type: "text" },
          { label: "Issue Size", name: "issueSize", type: "text" },
          { label: "Issue Type", name: "issueType", type: "text" },
          { label: "Listing Date", name: "listingDate", type: "date" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block font-semibold text-gray-700 mb-1">
              {label}
            </label>
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
          <label className="block font-semibold text-gray-700 mb-1">
            Status
          </label>
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
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update IPO
        </button>
      </form>
    </div>
  );
};

export default EditIpoPage;
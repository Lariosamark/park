import { useState, useEffect } from "react";
import { createPermit } from "../../lib/permit";
import { createNotification } from "../../lib/notification";
import { usePermit } from "../../pages/dashboard/usePermit";
import { useNavigate } from "react-router-dom";

export default function PermitRenewalForm({ user }) {
  const { permit } = usePermit(user.id); // Fetch the existing permit data for defaults
  const [loading, setLoading] = useState(false);
  const [renewalOption, setRenewalOption] = useState("same");
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    Fullname: "",
    designation: "",
    idNumber: "",
    address: "",
    contactNo: "",
    plateNo: "",
    vehicleColor: "",
    registrationNo: "",
    dateIssuedReg: "",
    currentORNo: "",
    dateIssuedOR: "",
    driversLicenseNo: "",
    dateIssuedLicense: "",
    expiryDateLicense: "",
    vehicleType: "",
  });

  const [requirements, setRequirements] = useState({
    driversLicense: null,
    corReceipt: null,
    paymentReceipt: null,
    OfficialReceipt:null,
  });

  // Load default values based on renewal option
  useEffect(() => {
    if (permit) {
      const personalInfo = {
        Fullname: permit.Fullname || "",
        designation: permit.designation || "",
        idNumber: permit.idNumber || "",
        address: permit.address || "",
        contactNo: permit.contactNo || "",
      };

      setFormData({
        ...personalInfo,
        plateNo: permit.plateNo || "",
        vehicleColor: permit.vehicleColor || "",
        registrationNo: permit.registrationNo || "",
        dateIssuedReg: permit.dateIssuedReg || "",
        currentORNo: permit.currentORNo || "",
        dateIssuedOR: permit.dateIssuedOR || "",
        driversLicenseNo: permit.driversLicenseNo || "",
        dateIssuedLicense: permit.dateIssuedLicense || "",
        expiryDateLicense: permit.expiryDateLicense || "",
        vehicleType: permit.vehicleType || "",
      });

      if (renewalOption === "different") {
        setFormData({
          ...personalInfo,
          plateNo: "",
          vehicleColor: "",
          registrationNo: "",
          dateIssuedReg: "",
          currentORNo: "",
          dateIssuedOR: "",
          driversLicenseNo: "",
          dateIssuedLicense: "",
          expiryDateLicense: "",
          vehicleType: "",
        });
      }
    }
  }, [permit, renewalOption]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setRequirements((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const permit = await createPermit(user.id, formData, requirements);
      await createNotification(
        user.id,
        import.meta.env.VITE_ADMIN_ID,
        `${user.firstName} submitted a permit renewal request.`,
        { link: `/dashboard/permits/${user.id}` }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      navigate("/dashboard/mypermit");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10"
    >
      <h1 className="text-3xl font-bold text-center mb-6">
        Vehicle Permit Renewal Application
      </h1>

      <div className="mb-6">
        <label className="block font-medium">Renewal Option:</label>
        <select
          value={renewalOption}
          onChange={(e) => setRenewalOption(e.target.value)}
          className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="same">Renew with the Same Vehicle</option>
          <option value="different">Renew with a Different Vehicle</option>
        </select>
      </div>

      {/* Personal Information Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Full Name:</label>
          <input
            type="text"
            name="Fullname"
            value={formData.Fullname}
            onChange={handleChange}
            placeholder="Enter your Full name"
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block font-medium">Designation:</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Enter your designation"
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block font-medium">ID #:</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            placeholder="Enter your ID number"
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block font-medium">Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block font-medium">Contact No.:</label>
          <input
            type="text"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            placeholder="Enter your contact number"
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      {/* Vehicle Details Section */}
      <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Plate No.:</label>
          <input
            type="text"
            name="plateNo"
            value={formData.plateNo}
            onChange={handleChange}
            placeholder="Enter plate number"
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block font-medium">Vehicle Color:</label>
          <input
            type="text"
            name="vehicleColor"
            value={formData.vehicleColor}
            onChange={handleChange}
            placeholder="Enter vehicle color"
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Registration No.:</label>
          <input
            type="text"
            name="registrationNo"
            value={formData.registrationNo}
            onChange={handleChange}
            placeholder="Enter registration number"
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block font-medium">Date Issued (Registration):</label>
          <input
            type="date"
            name="dateIssuedReg"
            value={formData.dateIssuedReg}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Current OR No.:</label>
          <input
            type="text"
            name="currentORNo"
            value={formData.currentORNo}
            onChange={handleChange}
            placeholder="Enter current OR number"
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block font-medium">Date Issued (OR):</label>
          <input
            type="date"
            name="dateIssuedOR"
            value={formData.dateIssuedOR}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      {/* Driver's License Details */}
      <h2 className="text-xl font-semibold mt-4 mb-2">Driver's License Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Driver's License No.:</label>
          <input
            type="text"
            name="driversLicenseNo"
            value={formData.driversLicenseNo}
            onChange={handleChange}
            placeholder="Enter driver's license number"
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block font-medium">Date Issued (License):</label>
          <input
            type="date"
            name="dateIssuedLicense"
            value={formData.dateIssuedLicense}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block font-medium">Expiry Date (License):</label>
          <input
            type="date"
            name="expiryDateLicense"
            value={formData.expiryDateLicense}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      {/* Requirements File Uploads */}
      <h2 className="text-xl font-semibold mb-4">Requirements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(requirements).map((key) => (
          <div key={key}>
            <label className="block font-medium">
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
            </label>
            <input
              type="file"
              name={key}
              onChange={handleFileChange}
              className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className={`bg-blue-500 text-white px-4 py-2 rounded-lg w-full ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Renewal Application"}
      </button>
    </form>
  );
}

import { useState } from "react";
import { createPermit } from "../../lib/permit";
import { createNotification } from "../../lib/notification";

export default function PermitForm({ user }) {
  const [formData, setFormData] = useState({
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
    officialRegistration: null,
    validID: null,
    paymentReceipt: null,
  });

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
      await createPermit(user.id, formData, requirements);
      await createNotification(
        user.id,
        import.meta.env.VITE_ADMIN_ID,
        `${user.firstName} submitted a permit request.`,
        { nothing: "WOW" }
      );
    } catch (error) {}
    console.log("Form Data:", formData);
    console.log("Requirements:", requirements);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10"
    >
      <h1 className="text-3xl font-bold text-center mb-6">
        Vehicle Permit Application
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

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
          <label className="block font-medium">
            Date Issued (Registration):
          </label>
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
            placeholder="Enter OR number"
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

      <div>
        <label className="block font-medium">Vehicle Type:</label>
        <select
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">Select Vehicle Type</option>
          <option value="2-Wheel Vehicle">2-Wheel Vehicle</option>
          <option value="4-Wheel Vehicle">4-Wheel Vehicle</option>
        </select>
      </div>

      <h2 className="text-xl font-semibold mb-4 mt-8">II. Requirements:</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-medium">
            1. One clear copy of Driver's License ID:
          </label>
          <input
            type="file"
            name="driversLicense"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
          {requirements.driversLicense && (
            <p className="mt-1 text-gray-600">
              {requirements.driversLicense.name}
            </p>
          )}
        </div>
        <div>
          <label className="block font-medium">
            2. One clear copy of COR receipt:
          </label>
          <input
            type="file"
            name="corReceipt"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
          {requirements.corReceipt && (
            <p className="mt-1 text-gray-600">{requirements.corReceipt.name}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">
            3. One clear copy of Official Registration receipt:
          </label>
          <input
            type="file"
            name="officialRegistration"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
          {requirements.officialRegistration && (
            <p className="mt-1 text-gray-600">
              {requirements.officialRegistration.name}
            </p>
          )}
        </div>
        <div>
          <label className="block font-medium">
            4. Valid ID with present address:
          </label>
          <input
            type="file"
            name="validID"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
          {requirements.validID && (
            <p className="mt-1 text-gray-600">{requirements.validID.name}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">5. Payment Receipt:</label>
          <input
            type="file"
            name="paymentReceipt"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
          {requirements.paymentReceipt && (
            <p className="mt-1 text-gray-600">
              {requirements.paymentReceipt.name}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          type="submit"
          className="w-full px-6 py-3 bg-red-950 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Application
        </button>
      </div>
    </form>
  );
}

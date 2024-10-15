import React from "react";
import { useNavigate } from "react-router-dom";

export const PermitsTable = ({ permits }) => {
  const navigate = useNavigate();

  const handleView = (permitId) => {
    // Navigate to the permit details page with the permitId
    navigate(`${permitId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Permit ID</th>
            <th className="py-2 px-4 border">Vehicle Type</th>
            <th className="py-2 px-4 border">Expiry Date License</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {permits.map((permit) => (
            <tr key={permit.id}>
              <td className="py-2 px-4 border">{permit.id}</td>
              <td className="py-2 px-4 border">{permit.vehicleType}</td>
              <td className="py-2 px-4 border">{permit.expiryDateLicense}</td>
              <td
                className={`py-2 px-4 border ${
                  permit.status === "Pending"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {permit.status}
              </td>
              <td className="py-2 px-4 border">
                {/* View button */}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                  onClick={() => handleView(permit.userId)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

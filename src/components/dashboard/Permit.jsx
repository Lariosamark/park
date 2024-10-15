import React from "react";

const Permit = ({ permitData }) => {
  const {
    vehicleColor,
    expiryDateLicense,
    status,
    contactNo,
    designation,
    dateIssuedLicense,
    dateIssuedOR,
    isExpired,
    createdAt,
    idNumber,
    dateIssuedReg,
    vehicleType,
    fileUrls,
    driversLicenseNo,
    type,
    plateNo,
    address,
    registrationNo,
    currentORNo,
    userId,
  } = permitData;

  return (
    <div className="permit-container border p-4 rounded-md shadow-md max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Permit Details</h2>

      {/* Display permit details */}
      <div className="mb-2">
        <strong>Vehicle Type:</strong> {vehicleType}
      </div>
      <div className="mb-2">
        <strong>Vehicle Color:</strong> {vehicleColor}
      </div>
      <div className="mb-2">
        <strong>License Expiry Date:</strong> {expiryDateLicense}
      </div>
      <div className="mb-2">
        <strong>Status:</strong> {status}
      </div>
      <div className="mb-2">
        <strong>Contact No:</strong> {contactNo}
      </div>
      <div className="mb-2">
        <strong>Designation:</strong> {designation}
      </div>
      <div className="mb-2">
        <strong>Date Issued OR:</strong> {dateIssuedOR}
      </div>
      <div className="mb-2">
        <strong>Plate No:</strong> {plateNo}
      </div>

      {/* Display Images */}
      <h3 className="text-xl font-semibold mt-4">Uploaded Documents</h3>
      {fileUrls.driversLicense && (
        <div className="mb-4">
          <strong>Driver's License:</strong>
          <img
            src={fileUrls.driversLicense}
            alt="Driver's License"
            className="w-full max-w-xs mt-2"
          />
        </div>
      )}
      {fileUrls.paymentReceipt && (
        <div className="mb-4">
          <strong>Payment Receipt:</strong>
          <img
            src={fileUrls.paymentReceipt}
            alt="Payment Receipt"
            className="w-full max-w-xs mt-2"
          />
        </div>
      )}
      {fileUrls.officialRegistration && (
        <div className="mb-4">
          <strong>Official Registration:</strong>
          <img
            src={fileUrls.officialRegistration}
            alt="Official Registration"
            className="w-full max-w-xs mt-2"
          />
        </div>
      )}
      {fileUrls.validID && (
        <div className="mb-4">
          <strong>Valid ID:</strong>
          <img
            src={fileUrls.validID}
            alt="Valid ID"
            className="w-full max-w-xs mt-2"
          />
        </div>
      )}
      {fileUrls.corReceipt && (
        <div className="mb-4">
          <strong>Certificate of Registration (COR):</strong>
          <img
            src={fileUrls.corReceipt}
            alt="COR Receipt"
            className="w-full max-w-xs mt-2"
          />
        </div>
      )}
    </div>
  );
};

export default Permit;

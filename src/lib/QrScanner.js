import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';

const QrScanner = () => {
  const [result, setResult] = useState('No result');

  const handleScan = (data) => {
    if (data) {
      setResult(data.text || data); // Ensure compatibility with different data formats
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>QR Code Scanner</h1>
      <QrReader
        delay={300}
        style={{ width: '100%', maxWidth: '400px' }}
        onError={handleError}
        onScan={handleScan}
        facingMode="environment" // Use rear camera if available
      />
      <p><strong>Scanned Result:</strong> {result}</p>
    </div>
  );
};

export default QrScanner;

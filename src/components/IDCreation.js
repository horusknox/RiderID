import React, { useState, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

const IDCreation = () => {
  const [formData, setFormData] = useState({
    emergencyNumber: '',
    bloodGroup: '',
    name: '',
    phone: '',
    instaID: '',
    address: '',
    medicalHistory: ''
  });
  const [qrCode, setQrCode] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const qrRef = useRef(null);
  const qrCodeInstance = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateQRCode = () => {
    // Validate all fields except Instagram, Address, and Medical History (optional)
    const requiredFields = ['emergencyNumber', 'bloodGroup', 'name', 'phone'];
    for (let key of requiredFields) {
      if (!formData[key].trim()) {
        alert(`Please fill in the ${key} field`);
        return;
      }
    }

    // Create URL with parameters - NO encoding here, URLSearchParams will handle it
    const params = new URLSearchParams();
    params.append('emergency', formData.emergencyNumber);
    params.append('blood', formData.bloodGroup);
    params.append('name', formData.name);
    params.append('phone', formData.phone);
    params.append('insta', formData.instaID);
    params.append('address', formData.address);
    params.append('medical', formData.medicalHistory);

    const idUrl = `${window.location.origin}/RiderID/#/id?${params.toString()}`;
    setQrUrl(idUrl);
    console.log("ID URL IS", idUrl);
    
    // Generate QR Code
    const newQrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      type: "png",
      data: idUrl,
      dotsOptions: {
        color: "#e2e8f0",
        type: "rounded"
      },
      backgroundOptions: {
        color: "transparent",
      },
      cornersSquareOptions: {
        color: "#4299e1",
        type: "extra-rounded"
      },
      cornersDotOptions: {
        color: "#667eea",
        type: "dot"
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 0
      }
    });

    qrCodeInstance.current = newQrCode;
    setQrCode(newQrCode);
    
    // Render QR code after a short delay to ensure state update
    setTimeout(() => {
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
        newQrCode.append(qrRef.current);
      }
    }, 100);
  };

  const downloadQRCode = () => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.download({ 
        name: `rider-id-${formData.name.replace(/\s+/g, '-').toLowerCase()}`,
        extension: "png"
      });
    } else if (qrCode) {
      qrCode.download({ 
        name: `rider-id-${formData.name.replace(/\s+/g, '-').toLowerCase()}`,
        extension: "png"
      });
    } else {
      alert('Please generate a QR code first');
    }
  };

  const shareQRCode = async () => {
    if (navigator.share && qrUrl) {
      try {
        await navigator.share({
          title: 'My Rider ID',
          text: `Check out my Rider ID for emergency situations`,
          url: qrUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrUrl).then(() => {
      alert('QR code link copied to clipboard!');
    });
  };

  return (
    <div className="container">
      <div className="creation-container">
        <div className="form-container">
          <div className="header">
            <h1>Rider ID Creator</h1>
            <p>Create your personal emergency ID card with QR code</p>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bloodGroup">Blood Group *</label>
            <input
              type="text"
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              placeholder="e.g., O+, A-, AB+"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="emergencyNumber">Emergency Contact *</label>
            <input
              type="tel"
              id="emergencyNumber"
              name="emergencyNumber"
              value={formData.emergencyNumber}
              onChange={handleChange}
              placeholder="Emergency contact number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="instaID">Instagram ID</label>
            <input
              type="text"
              id="instaID"
              name="instaID"
              value={formData.instaID}
              onChange={handleChange}
              placeholder="Your Instagram username (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your home address (optional)"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="medicalHistory">Medical History</label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="Any medical conditions, allergies, medications, or important health information (optional)"
              rows="4"
            />
            <p style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '5px' }}>
              This information will be hidden by default and only shown when explicitly requested
            </p>
          </div>

          <button className="btn" onClick={generateQRCode}>
            Generate Rider ID
          </button>

          {qrCode && (
            <div className="qr-container">
              <h3 style={{ color: '#e2e8f0', marginBottom: '12px', fontSize: '1.2rem' }}>Your Rider ID QR Code</h3>
              <p style={{ color: '#a0aec0', marginBottom: '20px', fontSize: '0.9rem' }}>
                Scan this QR code to access emergency information
              </p>
              <div className="qr-code" ref={qrRef}></div>
              
              <div className="qr-actions">
                <button className="btn btn-secondary" onClick={downloadQRCode}>
                  📥 Download QR
                </button>
                <button className="btn btn-secondary" onClick={shareQRCode}>
                  📤 Share QR
                </button>
              </div>
              
              <p style={{ fontSize: '0.85rem', color: '#4299e1', marginTop: '15px', fontWeight: '600' }}>
                Save this QR code for emergency situations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDCreation;
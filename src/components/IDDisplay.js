import React from 'react';
import { useSearchParams } from 'react-router-dom';

const IDDisplay = () => {
  const [searchParams] = useSearchParams();

  // Get parameters from URL with fallbacks
  const emergencyNumber = searchParams.get('emergency') || '';
  const bloodGroup = searchParams.get('blood') || 'Not specified';
  const name = searchParams.get('name') || 'Unknown';
  const phone = searchParams.get('phone') || '';
  const instaID = searchParams.get('insta') || '';

  // Decode URL parameters
  const decodedEmergency = decodeURIComponent(emergencyNumber);
  const decodedBloodGroup = decodeURIComponent(bloodGroup);
  const decodedName = decodeURIComponent(name);
  const decodedPhone = decodeURIComponent(phone);
  const decodedInsta = decodeURIComponent(instaID);

  const handleCall = (number) => {
    // Clean the number and make callable
    const cleanNumber = number.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanNumber}`;
  };

  const handleInstagram = (username) => {
    if (username && username.trim() !== '') {
      const cleanUsername = username.replace('@', '').trim();
      window.open(`https://instagram.com/${cleanUsername}`, '_blank');
    }
  };

  // Check if we have valid data
  const isValidData = decodedName && decodedName !== 'Unknown' && decodedName !== '';

  if (!isValidData) {
    return (
      <div className="container">
        <div className="error">
          <h2>🚫 Invalid Rider ID</h2>
          <p>This QR code doesn't contain valid emergency information.</p>
          <p>Please generate a new Rider ID with proper information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="id-display-container">
      {/* Emergency Header with Big Red Button */}
      <div className="emergency-header">
        <h1>🚨 Rider Emergency ID</h1>
        {decodedEmergency && decodedEmergency.trim() !== '' && (
          <button 
            className="emergency-btn"
            onClick={() => handleCall(decodedEmergency)}
          >
            📞 CALL EMERGENCY CONTACT
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="id-content">
        {/* Blood Group - Prominently Displayed */}
        <div className="blood-group-container">
          <div className="blood-group-label">Blood Group</div>
          <div className="blood-group">
            {decodedBloodGroup && decodedBloodGroup !== 'Not specified' ? decodedBloodGroup : 'N/A'}
          </div>
        </div>

        {/* Person's Name */}
        <div className="person-name">{decodedName}</div>

        {/* Contact Details Grid */}
        <div className="details-grid">
          {decodedPhone && decodedPhone.trim() !== '' && (
            <div className="detail-item">
              <span className="detail-label">Personal Phone</span>
              <span className="detail-value">
                <button 
                  className="contact-link"
                  onClick={() => handleCall(decodedPhone)}
                >
                  📞 {decodedPhone}
                </button>
              </span>
            </div>
          )}

          {decodedEmergency && decodedEmergency.trim() !== '' && (
            <div className="detail-item">
              <span className="detail-label">Emergency Contact</span>
              <span className="detail-value">
                <button 
                  className="contact-link"
                  onClick={() => handleCall(decodedEmergency)}
                >
                  🚨 {decodedEmergency}
                </button>
              </span>
            </div>
          )}

          {decodedInsta && decodedInsta.trim() !== '' && (
            <div className="detail-item">
              <span className="detail-label">Instagram Profile</span>
              <span className="detail-value">
                <button 
                  className="contact-link insta-link"
                  onClick={() => handleInstagram(decodedInsta)}
                >
                  📷 @{decodedInsta.replace('@', '')}
                </button>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDDisplay;
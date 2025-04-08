'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import api from '@/utils/api';
const VerificationPage = () => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const [newEmail, setNewEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [file, setFile] = useState(null); // For identity card upload
  const [socialMedia, setSocialMedia] = useState({
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useSelector((state) => state.user);
  const { userId, name, email, role } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch the current verification step from the backend
    const fetchVerificationStatus = async () => {
      try {
        const response = await api.get('/influencer/verification-status');
        if (response.data.success) {
          setVerificationStatus(response.data.status);
        } else {
          setError(response.data.message);
        }

      } catch (err) {
        setError('Failed to fetch verification step');
      }
    };
    fetchVerificationStatus();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get(`/youtube/profile/${userId}`);
      setProfileData(response.data);
    } catch (err) {
      setError(err.response?.status === 401 ? 'Please connect YouTube' : 'Error fetching profile');
    }
  };

  useEffect(() => {
    if (currentStep === 3) {
      fetchProfileData();
    }
  }, [currentStep]);

  const connectYouTube = async () => {
    try {
      const response = await api.get('/youtube/get-auth-url');

      const data = await response.data;
      if (data.success) {
        window.location.href = data.authUrl;
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect YouTube');
    }
  };

  useEffect(() => {
    // Fetch the current verification step from the backend
    const fetchVerificationStep = async () => {
      try {
        const response = await api.get('/influencer/verification-step');
        setCurrentStep(response.data.step);

      } catch (err) {
        setError('Failed to fetch verification step');
      }
    };
    fetchVerificationStep();
  }, []);

  useEffect(() => {
    setNewEmail(email); // Initialize with stored email
    // Fetch the current verification step from the backend

  }, [email]);

  // Step 1: Email Verification
  const handleChangeEmailButtonClick = async () => {
    if (isEditing) {
      setLoading(true);
      try {
        const response = await api.put('/user/update-email', { newEmail });
        const data = response.data;
        console.log(data);
        if (data.success) {
          alert(data.message);
          dispatch(setUser({ ...user, email: newEmail }));
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.log(err);
        setError('Failed to update email');
      } finally {
        setLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/otp/send-otp', { userId });
      const data = response.data;
      if (data.message === 'OTP sent') {
        setOtpSent(true);
        alert('OTP sent to your email');
      }
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/otp/verify-otp', { userId, otp });
      const data = response.data;
      if (data.success) {
        alert('Email verified successfully');
        setOtpSent(false);
        setOtp('');
        setCurrentStep(2); // Move to Step 2
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Upload National Identity Card
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadIdentityCard = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/influencer/upload-identity', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = response.data;
      if (data.success) {
        alert('Identity card uploaded successfully');
        setFile(null);
        setCurrentStep(3); // Move to Step 3
      }
    } catch (err) {
      setError('Failed to upload identity card');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Submit Social Media Handles
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setSocialMedia((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitSocialMedia = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/influencer/submit-social-media', {
        userId,
        socialMedia,
      });
      const data = response.data;
      if (data.success) {
        alert('Social media handles submitted successfully. Awaiting admin approval.');
        setSocialMedia({ instagram: '', facebook: '', tiktok: '', youtube: '' });
        setCurrentStep(4); // Verification complete, awaiting admin approval
      }
    } catch (err) {
      setError('Failed to submit social media handles');
    } finally {
      setLoading(false);
    }
  };

  // Stepper UI
  const steps = [
    'Email Verification',
    'Upload Identity Card',
    'Submit Social Media Handles',
    'Awaiting Approval',
  ];

  return (
    <div className="verification-container">
      <div className="verification-card">
        <h2 className="page-title">Influencer Verification</h2>

        {/* Stepper UI */}
        <div className="stepper">
          {steps.map((step, index) => (
            <div key={index} className="step-wrapper">
              <div
                className={`step-bubble ${currentStep > index + 1
                  ? 'step-completed'
                  : currentStep === index + 1
                    ? 'step-current'
                    : 'step-future'}`}
              >
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
              <div className="step-label">{step}</div>
              {index < steps.length - 1 && (
                <div className={`step-connector ${currentStep > index + 1 ? 'connector-completed' : 'connector-future'}`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="form-container">
          {/* Step 1: Email Verification */}
          {currentStep === 1 && (
            <div className="step-content">
              <h3 className="step-title">Email Verification</h3>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-group">
                  <input
                    type="email"
                    id="email"
                    className="text-input"
                    value={newEmail}
                    disabled={!isEditing}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <button
                    className={`action-button ${isEditing ? 'confirm-button' : 'edit-button'}`}
                    onClick={handleChangeEmailButtonClick}
                    disabled={loading}
                  >
                    {isEditing ? 'Save' : 'Change Email'}
                  </button>
                </div>
              </div>

              {!otpSent ? (
                <button
                  className="primary-button"
                  onClick={handleSendOTP}
                  disabled={loading || isEditing}
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
              ) : (
                <div className="form-group">
                  <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-700">
                    Enter Verification Code
                  </label>
                  <div className="flex w-[348px]">
                    <input
                      type="text"
                      id="otp"
                      className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter the 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                      className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleVerifyOTP}
                      disabled={loading}
                    >
                      {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Upload National Identity Card */}
          {currentStep === 2 && (
            <div className="step-content">
              <h3 className="step-title">Upload Identity Card</h3>
              <p className="info-text">Please upload a clear image of your national identity card or passport.</p>

              <div className="upload-container">
                <div className="drop-zone">
                  <input
                    type="file"
                    accept="image/*"
                    id="id-upload"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <label htmlFor="id-upload" className="file-label">
                    {file ? file.name : 'Select File or Drag & Drop'}
                  </label>
                </div>
                {file && <div className="file-preview">{file.name}</div>}
              </div>

              <button
                className="primary-button"
                onClick={handleUploadIdentityCard}
                disabled={loading || !file}
              >
                {loading ? 'Uploading...' : 'Upload Identity Card'}
              </button>
            </div>
          )}

          {/* Step 3: Submit Social Media Handles */}
          {currentStep === 3 && (
            <div className="step-content">
              <h3 className="step-title">Social Media Profile Links</h3>
              <p className="info-text">Please share the links to your social media profiles.</p>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="instagram">Instagram</label>
                  <div className="social-input">
                    <span className="social-prefix">instagram.com/</span>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      className="text-input"
                      value={socialMedia.instagram}
                      onChange={handleSocialMediaChange}
                      placeholder="username"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="facebook">Facebook</label>
                  <div className="social-input">
                    <span className="social-prefix">facebook.com/</span>
                    <input
                      type="text"
                      id="facebook"
                      name="facebook"
                      className="text-input"
                      value={socialMedia.facebook}
                      onChange={handleSocialMediaChange}
                      placeholder="username"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="tiktok">TikTok</label>
                  <div className="social-input">
                    <span className="social-prefix">tiktok.com/@</span>
                    <input
                      type="text"
                      id="tiktok"
                      name="tiktok"
                      className="text-input"
                      value={socialMedia.tiktok}
                      onChange={handleSocialMediaChange}
                      placeholder="username"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="youtube">YouTube</label>
                  <div className="social-input">
                    <span className="social-prefix">youtube.com/@</span>
                    <input
                      type="text"
                      id="youtube"
                      name="youtube"
                      className="text-input"
                      value={socialMedia.youtube}
                      onChange={handleSocialMediaChange}
                      placeholder="channel"
                    />
                    {!profileData && <button
                      className="action-button connect-button"
                      onClick={connectYouTube}
                      disabled={loading}
                    >
                      Connect YouTube
                    </button>}
                    {profileData && <div className="connected-message">Connected</div>}
                  </div>
                </div>
              </div>

              <button
                className="primary-button"
                onClick={handleSubmitSocialMedia}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Social Media Profiles'}
              </button>
            </div>
          )}

          {/* Step 4: Awaiting Approval */}
          {currentStep === 4 && (
            <div className="step-content completion-step">
              <div className="success-icon">✓</div>
              <h3 className="completion-title">Verification Complete</h3>
              <p className="completion-message">
                Your verification request has been submitted successfully.
              </p>
              <p className="status-message">
                Our team will review your application and notify you via email once your profile is verified.
              </p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      <style jsx>{`
        .verification-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 40px 20px;
          background-color: #f9f3e8; /* Cream background */
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .verification-card {
          width: 100%;
          max-width: 800px;
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05), 
                      0 1px 4px rgba(0, 0, 0, 0.1);
          padding: 40px;
          margin: 0 auto;
        }
        
        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin: 0 0 40px;
          text-align: center;
        }
        
        .stepper {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          position: relative;
        }
        
        .step-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
          z-index: 1;
        }
        
        .step-bubble {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .step-current {
          background-color: #5469d4;
          color: white;
        }
        
        .step-completed {
          background-color: #3ecf8e;
          color: white;
        }
        
        .step-future {
          background-color: #e0e0e0;
          color: #777;
        }
        
        .step-label {
          font-size: 13px;
          font-weight: 500;
          color: #555;
          text-align: center;
          max-width: 100px;
        }
        
        .step-connector {
          position: absolute;
          top: 16px;
          height: 2px;
          width: calc(100% - 40px);
          left: calc(50% + 20px);
          z-index: 0;
        }
        
        .connector-completed {
          background-color: #3ecf8e;
        }
        
        .connector-future {
          background-color: #e0e0e0;
        }
        
        .form-container {
          background-color: #fbfbf9;
          border-radius: 12px;
          padding: 30px;
        }
        
        .step-content {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .step-title {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin-top: 0;
          margin-bottom: 16px;
        }
        
        .form-group {
          margin-bottom: 24px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        
        label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          margin-bottom: 8px;
        }
        
        .text-input {
          width: 100%;
          padding: 12px 14px;
          font-size: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: #ffffff;
          transition: border-color 0.2s;
        }
        
        .text-input:focus {
          border-color: #5469d4;
          outline: none;
          box-shadow: 0 0 0 2px rgba(84, 105, 212, 0.2);
        }
        
        .text-input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
        
        .input-group {
          display: flex;
          gap: 10px;
        }
        
        .input-group .text-input {
          flex: 1;
        }
        
        .action-button {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }
        
        .action-button:hover {
          transform: translateY(-1px);
        }
        
        .action-button:active {
          transform: translateY(0);
        }
        
        .edit-button {
          background-color: #f0f0f0;
          color: #555;
        }
        
        .edit-button:hover {
          background-color: #e0e0e0;
        }
        
        .confirm-button {
          background-color: #5469d4;
          color: white;
        }
        
        .confirm-button:hover {
          background-color: #4a5fc7;
        }
        
        .primary-button {
          display: block;
          width: 100%;
          padding: 14px 24px;
          background-color: #5469d4;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
          margin-top: 10px;
        }
        
        .primary-button:hover {
          background-color: #4a5fc7;
          transform: translateY(-1px);
        }
        
        .primary-button:active {
          transform: translateY(0);
        }
        
        .primary-button:disabled {
          background-color: #a0a0a0;
          cursor: not-allowed;
        }
        
        .otp-input {
          font-size: 18px;
          letter-spacing: 1px;
          text-align: center;
        }
        
        .info-text {
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }
        
        .upload-container {
          margin: 20px 0;
        }
        
        .drop-zone {
          border: 2px dashed #c0c0c0;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          transition: border-color 0.2s;
        }
        
        .drop-zone:hover {
          border-color: #5469d4;
        }
        
        .file-input {
          display: none;
        }
        
        .file-label {
          cursor: pointer;
          display: block;
          font-size: 16px;
          color: #555;
        }
        
        .file-preview {
          margin-top: 10px;
          font-size: 14px;
          color: #5469d4;
        }
        
        .social-input {
          display: flex;
          align-items: center;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          background-color: #ffffff;
        }
        
        .social-input .text-input {
          border: none;
        }
        
        .social-prefix {
          padding: 12px 8px;
          background-color: #f5f5f5;
          color: #666;
          font-size: 14px;
          border-right: 1px solid #e0e0e0;
          white-space: nowrap;
        }
        
        .error-message {
          color: #e03131;
          background-color: rgba(224, 49, 49, 0.1);
          padding: 12px;
          border-radius: 6px;
          margin-top: 16px;
          font-size: 14px;
        }
        
        .completion-step {
          text-align: center;
          padding: 30px 0;
        }
        
        .success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #3ecf8e;
          color: white;
          font-size: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
        
        .completion-title {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 16px;
        }
        
        .completion-message {
          font-size: 16px;
          color: #555;
          margin-bottom: 8px;
        }
        
        .status-message {
          font-size: 14px;
          color: #777;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default VerificationPage;
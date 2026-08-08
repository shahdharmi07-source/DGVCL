import React, { useState } from "react";
import {
  FaUserCircle,
  FaUser,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBolt,
  FaEdit,
  FaSave,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import "../styles/myprofile.css";

function MyProfile() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Khushi Rana",
    consumerNo: "DGVCL100245",
    meterNo: "MTR789456",
    mobile: "9876543210",
    email: "khushi@gmail.com",
    address: "Surat, Gujarat, India",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="profile-page">

      {/* =========================
          PROFILE HEADER
      ========================== */}

      <div className="profile-header">

        <button
          className="profile-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        <div className="profile-header-content">

          <div className="profile-icon">
            <FaUserCircle />
          </div>

          <div>
            <h1>My Profile</h1>
            <p>View and manage your personal and consumer information</p>
          </div>

        </div>

      </div>


      {/* =========================
          PROFILE CONTAINER
      ========================== */}

      <div className="profile-container">

        {/* =========================
            PROFILE CARD
        ========================== */}

        <div className="profile-card">

          {/* PROFILE TOP */}

          <div className="profile-card-top">

            <div className="user-avatar">
              <FaUser />
            </div>

            <div className="user-title">
              <h2>{profile.name}</h2>
              <p>
                <FaIdCard />
                Consumer No: {profile.consumerNo}
              </p>
            </div>

            <button
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit />
              Edit Profile
            </button>

          </div>


          {/* =========================
              PROFILE DETAILS
          ========================== */}

          <div className="profile-details">

            {/* NAME */}

            <div className="profile-field">

              <div className="field-icon">
                <FaUser />
              </div>

              <div className="field-content">

                <label>Full Name</label>

                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>{profile.name}</strong>
                )}

              </div>

            </div>


            {/* CONSUMER NUMBER */}

            <div className="profile-field">

              <div className="field-icon">
                <FaIdCard />
              </div>

              <div className="field-content">

                <label>Consumer Number</label>

                <strong>{profile.consumerNo}</strong>

              </div>

            </div>


            {/* METER NUMBER */}

            <div className="profile-field">

              <div className="field-icon">
                <FaBolt />
              </div>

              <div className="field-content">

                <label>Meter Number</label>

                <strong>{profile.meterNo}</strong>

              </div>

            </div>


            {/* MOBILE */}

            <div className="profile-field">

              <div className="field-icon">
                <FaPhone />
              </div>

              <div className="field-content">

                <label>Mobile Number</label>

                {isEditing ? (
                  <input
                    type="text"
                    name="mobile"
                    value={profile.mobile}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>{profile.mobile}</strong>
                )}

              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-field">

              <div className="field-icon">
                <FaEnvelope />
              </div>

              <div className="field-content">

                <label>Email Address</label>

                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>{profile.email}</strong>
                )}

              </div>

            </div>


            {/* ADDRESS */}

            <div className="profile-field profile-address">

              <div className="field-icon">
                <FaMapMarkerAlt />
              </div>

              <div className="field-content">

                <label>Address</label>

                {isEditing ? (
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>{profile.address}</strong>
                )}

              </div>

            </div>

          </div>


          {/* =========================
              EDIT BUTTONS
          ========================== */}

          {isEditing && (

            <div className="profile-actions">

              <button
                className="save-profile-btn"
                onClick={handleSave}
              >
                <FaSave />
                Save Changes
              </button>

              <button
                className="cancel-profile-btn"
                onClick={handleCancel}
              >
                <FaTimes />
                Cancel
              </button>

            </div>

          )}

        </div>


        {/* =========================
            ACCOUNT STATUS
        ========================== */}

        <div className="account-status-card">

          <div className="status-icon">
            <FaUserCircle />
          </div>

          <div className="status-content">

            <h3>Account Status</h3>

            <p>
              Your DGVCL consumer account is active and verified.
            </p>

          </div>

          <span className="active-status">
            Active
          </span>

        </div>

      </div>

    </div>
  );
}

export default MyProfile;
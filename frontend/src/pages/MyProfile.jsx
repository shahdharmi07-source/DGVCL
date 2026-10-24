import React, { useEffect, useState } from "react";

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
  FaArrowLeft
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "../styles/myprofile.css";


function MyProfile() {

  const navigate = useNavigate();


  // =====================================================
  // STATES
  // =====================================================

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({

    name: "",
    consumerNo: "",
    meterNo: "",
    mobile: "",
    email: "",
    address: ""

  });


  // =====================================================
  // GET LOGGED-IN CONSUMER NUMBER
  // =====================================================

  const consumerNumber =
    localStorage.getItem("consumerNumber");


  // =====================================================
  // FETCH PROFILE FROM BACKEND
  // =====================================================

  const fetchProfile = async () => {

    try {

      setLoading(true);

      setMessage("");


      // Check login
      if (!consumerNumber) {

        setMessage(
          "Consumer not logged in."
        );

        setLoading(false);

        return;

      }


      console.log(
        "Fetching profile for:",
        consumerNumber
      );


      // Backend API
      const response = await fetch(

        `http://localhost:5000/api/users/profile/${consumerNumber}`

      );


      const data = await response.json();


      console.log(
        "Profile Response:",
        data
      );


      // Success
      if (response.ok) {

        const user = data.user;


        setProfile({

          name: user.name || "",

          consumerNo:
            user.consumerNumber || "",

          meterNo:
            user.meterNumber || "",

          mobile: user.mobile || "",

          email: user.email || "",

          address: user.address || ""

        });


        // Update localStorage user
        localStorage.setItem(

          "loggedInUser",

          JSON.stringify(user)

        );


      } else {

        setMessage(

          data.message ||
          "Unable to load profile."

        );

      }


    } catch (error) {

      console.error(
        "PROFILE FETCH ERROR:",
        error
      );


      setMessage(
        "Backend server is not connected."
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {

    fetchProfile();

  }, []);


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setProfile({

      ...profile,

      [name]: value

    });

  };


  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async () => {

    try {

      setLoading(true);

      setMessage("");


      const response = await fetch(

        `http://localhost:5000/api/users/profile/${consumerNumber}`,

        {

          method: "PUT",

          headers: {

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            name: profile.name,

            mobile: profile.mobile,

            email: profile.email,

            address: profile.address

          })

        }

      );


      const data =
        await response.json();


      console.log(
        "Update Response:",
        data
      );


      // Success
      if (response.ok) {

        setProfile({

          name: data.user.name || "",

          consumerNo:
            data.user.consumerNumber || "",

          meterNo:
            data.user.meterNumber || "",

          mobile:
            data.user.mobile || "",

          email:
            data.user.email || "",

          address:
            data.user.address || ""

        });


        // Update localStorage
        localStorage.setItem(

          "loggedInUser",

          JSON.stringify(data.user)

        );


        setIsEditing(false);


        alert(
          "Profile updated successfully!"
        );


      } else {

        setMessage(

          data.message ||
          "Profile update failed."

        );

      }


    } catch (error) {

      console.error(
        "PROFILE UPDATE ERROR:",
        error
      );


      setMessage(
        "Backend server is not connected."
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {

    setIsEditing(false);

    setMessage("");

    fetchProfile();

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="profile-page">

        <div className="profile-loading">

          <FaBolt />

          <h2>
            Loading Profile...
          </h2>

          <p>
            Please wait while we fetch your information.
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="profile-page">


      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <div className="profile-header">


        <button

          className="profile-back-btn"

          onClick={() =>
            navigate("/dashboard")
          }

        >

          <FaArrowLeft />

          Back to Dashboard

        </button>


        <div className="profile-header-content">


          <div className="profile-icon">

            <FaUserCircle />

          </div>


          <div>

            <h1>
              My Profile
            </h1>

            <p>
              View and manage your personal and consumer information
            </p>

          </div>


        </div>


      </div>



      {/* =================================================
          PROFILE CONTAINER
      ================================================= */}

      <div className="profile-container">


        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <div className="profile-card">


          {/* =================================================
              PROFILE TOP
          ================================================= */}

          <div className="profile-card-top">


            <div className="user-avatar">

              <FaUser />

            </div>


            <div className="user-title">

              <h2>
                {profile.name}
              </h2>


              <p>

                <FaIdCard />

                Consumer No:
                {" "}
                {profile.consumerNo}

              </p>

            </div>


            {!isEditing && (

              <button

                className="edit-profile-btn"

                onClick={() =>
                  setIsEditing(true)
                }

              >

                <FaEdit />

                Edit Profile

              </button>

            )}


          </div>



          {/* =================================================
              MESSAGE
          ================================================= */}

          {message && (

            <div className="profile-message">

              {message}

            </div>

          )}



          {/* =================================================
              PROFILE DETAILS
          ================================================= */}

          <div className="profile-details">


            {/* NAME */}

            <div className="profile-field">

              <div className="field-icon">

                <FaUser />

              </div>


              <div className="field-content">

                <label>
                  Full Name
                </label>


                {isEditing ? (

                  <input

                    type="text"

                    name="name"

                    value={profile.name}

                    onChange={handleChange}

                  />

                ) : (

                  <strong>
                    {profile.name}
                  </strong>

                )}

              </div>

            </div>



            {/* CONSUMER NUMBER */}

            <div className="profile-field">

              <div className="field-icon">

                <FaIdCard />

              </div>


              <div className="field-content">

                <label>
                  Consumer Number
                </label>

                <strong>
                  {profile.consumerNo}
                </strong>

              </div>

            </div>



            {/* METER NUMBER */}

            <div className="profile-field">

              <div className="field-icon">

                <FaBolt />

              </div>


              <div className="field-content">

                <label>
                  Meter Number
                </label>

                <strong>
                  {profile.meterNo}
                </strong>

              </div>

            </div>



            {/* MOBILE */}

            <div className="profile-field">

              <div className="field-icon">

                <FaPhone />

              </div>


              <div className="field-content">

                <label>
                  Mobile Number
                </label>


                {isEditing ? (

                  <input

                    type="text"

                    name="mobile"

                    value={profile.mobile}

                    onChange={handleChange}

                  />

                ) : (

                  <strong>
                    {profile.mobile}
                  </strong>

                )}

              </div>

            </div>



            {/* EMAIL */}

            <div className="profile-field">

              <div className="field-icon">

                <FaEnvelope />

              </div>


              <div className="field-content">

                <label>
                  Email Address
                </label>


                {isEditing ? (

                  <input

                    type="email"

                    name="email"

                    value={profile.email}

                    onChange={handleChange}

                  />

                ) : (

                  <strong>
                    {profile.email}
                  </strong>

                )}

              </div>

            </div>



            {/* ADDRESS */}

            <div className="profile-field profile-address">

              <div className="field-icon">

                <FaMapMarkerAlt />

              </div>


              <div className="field-content">

                <label>
                  Address
                </label>


                {isEditing ? (

                  <textarea

                    name="address"

                    value={profile.address}

                    onChange={handleChange}

                  />

                ) : (

                  <strong>
                    {profile.address}
                  </strong>

                )}

              </div>

            </div>


          </div>



          {/* =================================================
              EDIT ACTIONS
          ================================================= */}

          {isEditing && (

            <div className="profile-actions">


              <button

                className="save-profile-btn"

                onClick={handleSave}

                disabled={loading}

              >

                <FaSave />

                {loading
                  ? "Saving..."
                  : "Save Changes"
                }

              </button>


              <button

                className="cancel-profile-btn"

                onClick={handleCancel}

                disabled={loading}

              >

                <FaTimes />

                Cancel

              </button>


            </div>

          )}


        </div>



        {/* =================================================
            ACCOUNT STATUS
        ================================================= */}

        <div className="account-status-card">


          <div className="status-icon">

            <FaUserCircle />

          </div>


          <div className="status-content">

            <h3>
              Account Status
            </h3>


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
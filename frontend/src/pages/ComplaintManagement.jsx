import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaExclamationCircle,
  FaSearch,
  FaSyncAlt,
  FaTrash,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaIdCard,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import "../styles/complaintManagement.css";

function ComplaintManagement() {
  const navigate = useNavigate();

  const API = "http://localhost:5000/api/complaints";

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("Pending");
  const [editRemark, setEditRemark] = useState("");

  // =====================================================
  // LOAD COMPLAINTS
  // =====================================================

  const loadComplaints = async () => {
    try {
      setLoading(true);

      const response = await fetch(API);
      const data = await response.json();

      console.log("Complaint API Response:", data);

      if (!response.ok) {
        alert(data.message || "Unable to load complaints.");
        return;
      }

      setComplaints(
        Array.isArray(data.complaints)
          ? data.complaints
          : []
      );
    } catch (error) {
      console.error("Load Complaints Error:", error);
      alert("Backend server is not connected.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PAGE
  // =====================================================

  useEffect(() => {
    loadComplaints();
  }, []);

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEdit = (complaint) => {
    setEditingId(complaint._id);
    setEditStatus(complaint.status || "Pending");
    setEditRemark(complaint.adminRemark || "");
  };

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const closeEdit = () => {
    setEditingId(null);
    setEditStatus("Pending");
    setEditRemark("");
  };

  // =====================================================
  // UPDATE COMPLAINT
  // =====================================================

  const updateComplaint = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: editStatus,
          adminRemark: editRemark,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update complaint.");
        return;
      }

      alert("Complaint updated successfully.");

      closeEdit();
      loadComplaints();
    } catch (error) {
      console.error("Update Complaint Error:", error);
      alert("Backend server is not connected.");
    }
  };

  // =====================================================
  // DELETE COMPLAINT
  // =====================================================

  const deleteComplaint = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to delete complaint.");
        return;
      }

      alert("Complaint deleted successfully.");

      loadComplaints();
    } catch (error) {
      console.error("Delete Complaint Error:", error);
      alert("Backend server is not connected.");
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredComplaints = complaints.filter((complaint) => {
    const text = search.trim().toLowerCase();

    if (!text) {
      return true;
    }

    return (
      complaint.complaintId
        ?.toLowerCase()
        .includes(text) ||

      complaint.consumerNumber
        ?.toLowerCase()
        .includes(text) ||

      complaint.category
        ?.toLowerCase()
        .includes(text) ||

      complaint.description
        ?.toLowerCase()
        .includes(text)
    );
  });

  // =====================================================
  // COUNTS
  // =====================================================

  const total = complaints.length;

  const pending = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const progress = complaints.filter(
    (item) => item.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const statusClass = (status) => {
    if (status === "Resolved") {
      return "resolved";
    }

    if (status === "In Progress") {
      return "progress";
    }

    return "pending";
  };

  // =====================================================
  // BACK TO ADMIN DASHBOARD
  // =====================================================

  const goBack = () => {
    navigate("/admin-dashboard");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="complaint-management">

      {/* HEADER */}

      <header className="complaint-management-header">

        <div className="header-left">

          <button
            type="button"
            className="back-button"
            onClick={goBack}
          >
            <FaArrowLeft />
          </button>

          <div className="header-icon">
            <FaExclamationCircle />
          </div>

          <div>
            <span>DGPS ADMINISTRATION</span>

            <h1>
              Complaint Management
            </h1>

            <p>
              Review and manage consumer complaints
            </p>
          </div>

        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={loadComplaints}
          disabled={loading}
        >
          <FaSyncAlt
            className={loading ? "spin" : ""}
          />

          {loading ? "Loading..." : "Refresh"}
        </button>

      </header>


      {/* SUMMARY */}

      <section className="complaint-stats">

        <div className="complaint-stat-card">

          <div className="stat-icon total">
            <FaExclamationCircle />
          </div>

          <div>
            <span>Total Complaints</span>
            <strong>{total}</strong>
          </div>

        </div>


        <div className="complaint-stat-card">

          <div className="stat-icon pending">
            <FaClock />
          </div>

          <div>
            <span>Pending</span>
            <strong>{pending}</strong>
          </div>

        </div>


        <div className="complaint-stat-card">

          <div className="stat-icon progress">
            <FaSyncAlt />
          </div>

          <div>
            <span>In Progress</span>
            <strong>{progress}</strong>
          </div>

        </div>


        <div className="complaint-stat-card">

          <div className="stat-icon resolved">
            <FaCheckCircle />
          </div>

          <div>
            <span>Resolved</span>
            <strong>{resolved}</strong>
          </div>

        </div>

      </section>


      {/* SEARCH */}

      <div className="complaint-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search complaint..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
          >
            <FaTimes />
          </button>
        )}

      </div>


      {/* TABLE */}

      <section className="complaint-table-card">

        {loading ? (

          <div className="complaint-loading">

            <FaSyncAlt className="spin" />

            <h3>
              Loading Complaints...
            </h3>

            <p>
              Fetching data from MongoDB
            </p>

          </div>

        ) : filteredComplaints.length === 0 ? (

          <div className="complaint-empty">

            <FaExclamationCircle />

            <h3>
              No Complaints Found
            </h3>

            <p>
              {search
                ? "No matching complaint found."
                : "No complaints have been registered yet."}
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Consumer Number</th>
                  <th>Complaint ID</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredComplaints.map(
                  (complaint) => (

                    <tr key={complaint._id}>

                      <td>

                        <span className="consumer-number">
                          <FaIdCard />

                          {complaint.consumerNumber ||
                            "N/A"}
                        </span>

                      </td>


                      <td>

                        <span className="complaint-id">
                          {complaint.complaintId}
                        </span>

                      </td>


                      <td>

                        <span className="category-badge">
                          {complaint.category ||
                            "General Electricity Issue"}
                        </span>

                      </td>


                      <td>

                        <div className="description-cell">
                          {complaint.description}
                        </div>

                      </td>


                      <td>

                        <span
                          className={`status-badge ${statusClass(
                            complaint.status
                          )}`}
                        >

                          {complaint.status ===
                          "Resolved" ? (
                            <FaCheckCircle />
                          ) : (
                            <FaClock />
                          )}

                          {complaint.status}

                        </span>

                      </td>


                      <td>

                        {complaint.createdAt
                          ? new Date(
                              complaint.createdAt
                            ).toLocaleDateString()
                          : "N/A"}

                      </td>


                      <td>

                        <div className="action-buttons">

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              openEdit(complaint)
                            }
                            title="Update Complaint"
                          >
                            <FaSave />
                          </button>


                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              deleteComplaint(
                                complaint._id
                              )
                            }
                            title="Delete Complaint"
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* UPDATE MODAL */}

      {editingId && (

        <div className="complaint-modal-overlay">

          <div className="complaint-modal">

            <div className="modal-header">

              <div>

                <span>
                  COMPLAINT MANAGEMENT
                </span>

                <h2>
                  Update Complaint
                </h2>

              </div>

              <button
                type="button"
                onClick={closeEdit}
              >
                <FaTimes />
              </button>

            </div>


            <div className="modal-body">

              <label>
                Complaint Status
              </label>

              <select
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value)
                }
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

              </select>


              <label>
                Admin Remark
              </label>

              <textarea
                rows="4"
                placeholder="Enter admin remark..."
                value={editRemark}
                onChange={(e) =>
                  setEditRemark(e.target.value)
                }
              />


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeEdit}
                >
                  <FaTimes />
                  Cancel
                </button>

                <button
                  type="button"
                  className="save-button"
                  onClick={() =>
                    updateComplaint(editingId)
                  }
                >
                  <FaSave />
                  Save Changes
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ComplaintManagement;
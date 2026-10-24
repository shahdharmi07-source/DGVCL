import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUsers,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaSyncAlt,
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaTimes,
  FaSave,
  FaMapMarkerAlt
} from "react-icons/fa";

import "../styles/consumerManagement.css";

function ConsumerManagement() {
  const navigate = useNavigate();

  const [consumers, setConsumers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    consumerNumber: "",
    meterNumber: "",
    mobile: "",
    address: "",
    email: "",
    connectionStatus: "Active"
  });

  // ==========================================
  // CHECK ADMIN
  // ==========================================

  useEffect(() => {
    const savedAdmin = localStorage.getItem("adminUser");

    if (!savedAdmin) {
      navigate("/admin-login");
      return;
    }

    try {
      const adminData = JSON.parse(savedAdmin);

      if (!adminData || adminData.role !== "admin") {
        localStorage.removeItem("adminUser");
        navigate("/admin-login");
        return;
      }

      fetchConsumers();
    } catch (error) {
      console.error("Admin Check Error:", error);

      localStorage.removeItem("adminUser");
      navigate("/admin-login");
    }
  }, [navigate]);

  // ==========================================
  // GET CONSUMERS
  // ==========================================

  const fetchConsumers = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        "http://localhost:5000/api/admin/users"
      );

      const data = await response.json();

      console.log("Consumers:", data);

      if (!response.ok) {
        setErrorMessage(
          data.message || "Unable to load consumers"
        );
        return;
      }

      setConsumers(
        Array.isArray(data.users)
          ? data.users
          : []
      );
    } catch (error) {
      console.error("Fetch Consumers Error:", error);

      setErrorMessage(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  // ==========================================
  // ADD
  // ==========================================

  const handleAdd = () => {
    setEditingId(null);

    setFormData({
      name: "",
      consumerNumber: "",
      meterNumber: "",
      mobile: "",
      address: "",
      email: "",
      connectionStatus: "Active"
    });

    setShowForm(true);
    setErrorMessage("");
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (consumer) => {
    console.log("EDIT CLICKED:", consumer);

    if (!consumer?._id) {
      alert("Consumer ID not found.");
      return;
    }

    setEditingId(consumer._id);

    setFormData({
      name: consumer.name || "",
      consumerNumber: consumer.consumerNumber || "",
      meterNumber: consumer.meterNumber || "",
      mobile: consumer.mobile || "",
      address: consumer.address || "",
      email: consumer.email || "",
      connectionStatus:
        consumer.connectionStatus || "Active"
    });

    setShowForm(true);
    setErrorMessage("");
  };

  // ==========================================
  // SAVE / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.consumerNumber.trim() ||
      !formData.meterNumber.trim() ||
      !formData.mobile.trim() ||
      !formData.address.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `http://localhost:5000/api/admin/users/${editingId}`
        : "http://localhost:5000/api/admin/users";

      const method = editingId
        ? "PUT"
        : "POST";

      console.log("SAVE URL:", url);
      console.log("METHOD:", method);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      console.log("SAVE RESPONSE:", data);

      if (!response.ok) {
        alert(
          data.message ||
          "Operation failed."
        );
        return;
      }

      alert(
        editingId
          ? "Consumer updated successfully."
          : "Consumer added successfully."
      );

      setShowForm(false);
      setEditingId(null);

      await fetchConsumers();
    } catch (error) {
      console.error("Save Error:", error);

      alert(
        "Unable to connect to server."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    console.log("DELETE ID:", id);

    if (!id) {
      alert("Consumer ID not found.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this consumer?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      console.log("DELETE RESPONSE:", data);

      if (!response.ok) {
        alert(
          data.message ||
          "Unable to delete consumer."
        );
        return;
      }

      alert(
        "Consumer deleted successfully."
      );

      await fetchConsumers();
    } catch (error) {
      console.error("Delete Error:", error);

      alert(
        "Unable to connect to server."
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredConsumers = consumers.filter(
    (consumer) => {
      const text = search
        .trim()
        .toLowerCase();

      if (!text) {
        return true;
      }

      return (
        consumer.name
          ?.toLowerCase()
          .includes(text) ||

        consumer.consumerNumber
          ?.toLowerCase()
          .includes(text) ||

        consumer.meterNumber
          ?.toLowerCase()
          .includes(text) ||

        consumer.mobile
          ?.toLowerCase()
          .includes(text) ||

        consumer.email
          ?.toLowerCase()
          .includes(text)
      );
    }
  );

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="consumer-management">

      {/* ================= HEADER ================= */}

      <header className="consumer-header">

        <div className="consumer-header-left">

          <button
            className="back-dashboard"
            onClick={() =>
              navigate("/admin-dashboard")
            }
            title="Back to Dashboard"
          >
            <FaArrowLeft />
          </button>

          <div className="consumer-title-icon">
            <FaUsers />
          </div>

          <div className="consumer-title-content">

            <span className="admin-label">
              DGVCL ADMIN PANEL
            </span>

            <h1>
              Consumer Management
            </h1>

            <p>
              Manage registered electricity consumers
            </p>

          </div>

        </div>

        <button
          className="refresh-consumers"
          onClick={fetchConsumers}
          disabled={loading}
        >
          <FaSyncAlt
            className={
              loading
                ? "button-spin"
                : ""
            }
          />

          {loading
            ? "Loading..."
            : "Refresh"}
        </button>

      </header>

      {/* ================= ERROR ================= */}

      {errorMessage && (
        <div className="consumer-error">

          <div>
            <strong>Error:</strong>{" "}
            {errorMessage}
          </div>

          <button
            onClick={fetchConsumers}
          >
            Try Again
          </button>

        </div>
      )}

      {/* ================= TOOLBAR ================= */}

      <section className="consumer-toolbar">

        <div className="consumer-count">

          <div className="count-icon">
            <FaUsers />
          </div>

          <div>
            <span>Total Consumers</span>

            <strong>
              {consumers.length}
            </strong>
          </div>

        </div>

        <div className="consumer-actions">

          <div className="consumer-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search consumer..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                className="clear-search"
                onClick={() =>
                  setSearch("")
                }
              >
                <FaTimes />
              </button>
            )}

          </div>

          <button
            className="add-consumer-btn"
            onClick={handleAdd}
          >
            <FaPlus />
            Add Consumer
          </button>

        </div>

      </section>

      {/* ================= TABLE ================= */}

      <section className="consumer-table-card">

        {loading ? (

          <div className="consumer-loading">

            <FaSyncAlt className="loading-spin" />

            <h3>
              Loading Consumers
            </h3>

            <p>
              Fetching consumer data...
            </p>

          </div>

        ) : filteredConsumers.length === 0 ? (

          <div className="no-consumers">

            <div className="empty-icon">
              <FaUsers />
            </div>

            <h3>
              No Consumers Found
            </h3>

            <p>
              {search
                ? "Try searching with another name or consumer number."
                : "No consumers are registered yet."}
            </p>

            {!search && (
              <button
                className="empty-add-btn"
                onClick={handleAdd}
              >
                <FaPlus />
                Add First Consumer
              </button>
            )}

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Consumer</th>
                  <th>Consumer No.</th>
                  <th>Meter No.</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th className="actions-heading">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {filteredConsumers.map(
                  (consumer) => (

                    <tr
                      key={consumer._id}
                    >

                      {/* CONSUMER */}

                      <td className="consumer-column">

                        <div className="consumer-info">

                          <div className="consumer-avatar">

                            {consumer.name
                              ?.charAt(0)
                              .toUpperCase()}

                          </div>

                          <div className="consumer-main-info">

                            <strong>
                              {consumer.name}
                            </strong>

                            <span>
                              {consumer.email ||
                                "No email"}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* CONSUMER NUMBER */}

                      <td>

                        <span className="consumer-number">

                          <FaIdCard />

                          {consumer.consumerNumber}

                        </span>

                      </td>

                      {/* METER */}

                      <td>

                        <span className="meter-number">
                          {consumer.meterNumber}
                        </span>

                      </td>

                      {/* CONTACT */}

                      <td>

                        <div className="contact-info">

                          <span>
                            <FaPhone />
                            {consumer.mobile}
                          </span>

                          <span>
                            <FaEnvelope />
                            {consumer.email ||
                              "No email"}
                          </span>

                        </div>

                      </td>

                      {/* ADDRESS */}

                      <td>

                        <div className="address-info">

                          <FaMapMarkerAlt />

                          <span>
                            {consumer.address}
                          </span>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`status-badge ${
                            consumer.connectionStatus
                              ?.toLowerCase() ===
                            "active"
                              ? "active"
                              : "inactive"
                          }`}
                        >

                          <span className="status-dot" />

                          {consumer.connectionStatus ||
                            "Active"}

                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="actions-cell">

                        <div className="consumer-actions-buttons">

                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() =>
                              handleEdit(consumer)
                            }
                            title="Edit Consumer"
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                consumer._id
                              )
                            }
                            title="Delete Consumer"
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

      {/* ================= MODAL ================= */}

      {showForm && (

        <div
          className="consumer-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="consumer-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div className="modal-title">

                <div className="modal-icon">
                  <FaUserCircle />
                </div>

                <div>

                  <span>
                    CONSUMER MANAGEMENT
                  </span>

                  <h2>
                    {editingId
                      ? "Edit Consumer"
                      : "Add New Consumer"}
                  </h2>

                </div>

              </div>

              <button
                type="button"
                className="close-modal"
                onClick={closeModal}
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              className="consumer-form"
              onSubmit={handleSubmit}
            >

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Consumer Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter consumer name"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Consumer Number *
                  </label>

                  <input
                    type="text"
                    name="consumerNumber"
                    value={
                      formData.consumerNumber
                    }
                    onChange={handleChange}
                    placeholder="Enter consumer number"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Meter Number *
                  </label>

                  <input
                    type="text"
                    name="meterNumber"
                    value={
                      formData.meterNumber
                    }
                    onChange={handleChange}
                    placeholder="Enter meter number"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Mobile Number *
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Connection Status
                  </label>

                  <select
                    name="connectionStatus"
                    value={
                      formData.connectionStatus
                    }
                    onChange={handleChange}
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

                <div className="form-group full-width">

                  <label>
                    Address *
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter consumer address"
                    rows="3"
                  />

                </div>

              </div>

              {/* BUTTONS */}

              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  <FaTimes />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-consumer-btn"
                  disabled={saving}
                >

                  {saving ? (
                    <>
                      <FaSyncAlt className="button-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />

                      {editingId
                        ? "Update Consumer"
                        : "Add Consumer"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default ConsumerManagement;
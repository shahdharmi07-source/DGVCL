import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBolt,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaSignOutAlt,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaBell,
  FaExclamationCircle,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaSyncAlt,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaTachometerAlt,
} from "react-icons/fa";

import "../styles/adminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const API = "http://localhost:5000/api/admin";

  const [admin, setAdmin] = useState(null);

  const [stats, setStats] = useState({
    totalConsumers: 0,
    activeConsumers: 0,
    inactiveConsumers: 0,
  });

  const [consumers, setConsumers] = useState([]);

  const [showConsumers, setShowConsumers] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    consumerNumber: "",
    meterNumber: "",
    mobile: "",
    address: "",
    email: "",
    connectionStatus: "Active",
  });

  // =====================================================
  // ADMIN CHECK
  // =====================================================

  useEffect(() => {
    const savedAdmin = localStorage.getItem("adminUser");

    if (!savedAdmin) {
      navigate("/admin-login", { replace: true });
      return;
    }

    try {
      const adminData = JSON.parse(savedAdmin);

      if (!adminData || adminData.role !== "admin") {
        localStorage.removeItem("adminUser");
        navigate("/admin-login", { replace: true });
        return;
      }

      setAdmin(adminData);
      loadStats();
    } catch (error) {
      console.error("Admin check error:", error);

      localStorage.removeItem("adminUser");
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  // =====================================================
  // LOAD DASHBOARD STATS
  // =====================================================

  const loadStats = async () => {
    try {
      const response = await fetch(`${API}/dashboard`);
      const data = await response.json();

      if (response.ok) {
        setStats({
          totalConsumers: data.totalConsumers || 0,
          activeConsumers: data.activeConsumers || 0,
          inactiveConsumers: data.inactiveConsumers || 0,
        });
      }
    } catch (error) {
      console.error("Stats Error:", error);
    }
  };

  // =====================================================
  // LOAD CONSUMERS
  // =====================================================

  const loadConsumers = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API}/users`);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to load consumers");
        return;
      }

      setConsumers(Array.isArray(data.users) ? data.users : []);

      await loadStats();
    } catch (error) {
      console.error("Load Consumers Error:", error);

      alert("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // OPEN CONSUMERS
  // =====================================================

  const openConsumers = () => {
    setShowConsumers(true);
    setSearch("");
    loadConsumers();
  };

  // =====================================================
  // BACK TO DASHBOARD
  // =====================================================

  const backToDashboard = () => {
    setShowConsumers(false);
    setSearch("");
    setShowForm(false);
    setEditingId(null);
  };

  // =====================================================
  // OPEN BILLS
  // =====================================================

  const openBills = () => {
    console.log("Opening Bills Management...");
    navigate("/bills-management");
  };

  // =====================================================
  // OPEN PAYMENTS
  // =====================================================

  const openPayments = () => {
    navigate("/payments-management");
  };

  // =====================================================
  // OPEN COMPLAINTS
  // =====================================================

  const openComplaints = () => {
    navigate("/complaints-management");
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD CONSUMER
  // =====================================================

  const addConsumer = () => {
    setEditingId(null);

    setFormData({
      name: "",
      consumerNumber: "",
      meterNumber: "",
      mobile: "",
      address: "",
      email: "",
      connectionStatus: "Active",
    });

    setShowForm(true);
  };

  // =====================================================
  // EDIT CONSUMER
  // =====================================================

  const editConsumer = (consumer) => {
    setEditingId(consumer._id);

    setFormData({
      name: consumer.name || "",
      consumerNumber: consumer.consumerNumber || "",
      meterNumber: consumer.meterNumber || "",
      mobile: consumer.mobile || "",
      address: consumer.address || "",
      email: consumer.email || "",
      connectionStatus: consumer.connectionStatus || "Active",
    });

    setShowForm(true);
  };

  // =====================================================
  // SAVE CONSUMER
  // =====================================================

  const saveConsumer = async (e) => {
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
        ? `${API}/users/${editingId}`
        : `${API}/users`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Operation failed.");
        return;
      }

      alert(
        editingId
          ? "Consumer updated successfully."
          : "Consumer added successfully."
      );

      setShowForm(false);
      setEditingId(null);

      setFormData({
        name: "",
        consumerNumber: "",
        meterNumber: "",
        mobile: "",
        address: "",
        email: "",
        connectionStatus: "Active",
      });

      await loadConsumers();
    } catch (error) {
      console.error("Save Consumer Error:", error);
      alert("Unable to connect to backend.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE CONSUMER
  // =====================================================

  const deleteConsumer = async (id) => {
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
      setLoading(true);

      const response = await fetch(`${API}/users/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Delete failed.");
        return;
      }

      alert("Consumer deleted successfully.");

      await loadConsumers();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredConsumers = consumers.filter((consumer) => {
    const text = search.trim().toLowerCase();

    if (!text) {
      return true;
    }

    return (
      consumer.name?.toLowerCase().includes(text) ||
      consumer.consumerNumber?.toLowerCase().includes(text) ||
      consumer.meterNumber?.toLowerCase().includes(text) ||
      consumer.mobile?.toLowerCase().includes(text) ||
      consumer.email?.toLowerCase().includes(text)
    );
  });

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("adminUser");

    navigate("/admin-login", {
      replace: true,
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (!admin) {
    return (
      <div className="admin-loading">
        <FaSyncAlt className="loading-spin" />
        <h3>Loading Admin Dashboard...</h3>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        {/* BRAND */}

        <div className="admin-brand">
          <div className="brand-icon">
            <FaBolt />
          </div>

          <div>
            <h2>DGPS</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        {/* MENU */}

        <div className="admin-menu">

          {/* DASHBOARD */}

          <button
            type="button"
            className={`admin-menu-item admin-menu-button ${
              !showConsumers ? "active" : ""
            }`}
            onClick={backToDashboard}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </button>

          {/* CONSUMERS */}

          <button
            type="button"
            className={`admin-menu-item admin-menu-button ${
              showConsumers ? "active" : ""
            }`}
            onClick={openConsumers}
          >
            <FaUsers />
            <span>Consumers</span>

            <b className="menu-count">
              {stats.totalConsumers}
            </b>
          </button>

          {/* BILLS */}

          <button
            type="button"
            className="admin-menu-item admin-menu-button"
            onClick={openBills}
          >
            <FaFileInvoiceDollar />
            <span>Bills</span>
          </button>

          {/* PAYMENTS */}

          <button
            type="button"
            className="admin-menu-item admin-menu-button"
            onClick={openPayments}
          >
            <FaCreditCard />
            <span>Payments</span>
          </button>

          {/* COMPLAINTS */}

          <button
            type="button"
            className="admin-menu-item admin-menu-button"
            onClick={openComplaints}
          >
            <FaExclamationCircle />
            <span>Complaints</span>
          </button>

          {/* NOTIFICATIONS */}

          <button
            type="button"
            className="admin-menu-item admin-menu-button"
            onClick={() =>
              alert("Notification Management coming soon.")
            }
          >
            <FaBell />
            <span>Notifications</span>
          </button>

        </div>

        {/* LOGOUT */}

        <button
          type="button"
          className="admin-logout"
          onClick={logout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </aside>

      {/* MAIN */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>
            <span className="header-small">
              DGPS ADMINISTRATION
            </span>

            <h1>
              {showConsumers
                ? "Consumer Management"
                : "Admin Dashboard"}
            </h1>

            <p>
              {showConsumers
                ? "Add, update and manage electricity consumers"
                : `Welcome back, ${admin.name}`}
            </p>
          </div>

          <div className="admin-profile">

            <div className="profile-avatar">
              {admin.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{admin.name}</strong>
              <span>Administrator</span>
            </div>

          </div>

        </header>

        {/* CONSUMER MANAGEMENT */}

        {showConsumers ? (

          <section className="consumer-section">

            <div className="consumer-topbar">

              <div>
                <span className="section-label">
                  CONSUMER DATABASE
                </span>

                <h2>
                  <FaUsers />
                  All Consumers
                </h2>

                <p>
                  Manage consumer information directly
                  from the admin panel.
                </p>
              </div>

              <div className="consumer-top-actions">

                <button
                  type="button"
                  className="refresh-btn"
                  onClick={loadConsumers}
                  disabled={loading}
                >
                  <FaSyncAlt
                    className={loading ? "button-spin" : ""}
                  />

                  {loading ? "Loading..." : "Refresh"}
                </button>

                <button
                  type="button"
                  className="add-btn"
                  onClick={addConsumer}
                >
                  <FaPlus />
                  Add Consumer
                </button>

              </div>

            </div>

            {/* SUMMARY */}

            <div className="consumer-summary">

              <div className="summary-card">
                <div className="summary-icon total">
                  <FaUsers />
                </div>

                <div>
                  <span>Total Consumers</span>
                  <strong>{consumers.length}</strong>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon active">
                  <FaUserCheck />
                </div>

                <div>
                  <span>Active Consumers</span>

                  <strong>
                    {
                      consumers.filter(
                        (consumer) =>
                          consumer.connectionStatus === "Active"
                      ).length
                    }
                  </strong>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon inactive">
                  <FaUserTimes />
                </div>

                <div>
                  <span>Inactive Consumers</span>

                  <strong>
                    {
                      consumers.filter(
                        (consumer) =>
                          consumer.connectionStatus !== "Active"
                      ).length
                    }
                  </strong>
                </div>
              </div>

            </div>

            {/* SEARCH */}

            <div className="consumer-search-box">

              <FaSearch />

              <input
                type="text"
                placeholder="Search consumer by name, number, meter, mobile or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  title="Clear Search"
                >
                  <FaTimes />
                </button>
              )}

            </div>

            {/* TABLE */}

            <div className="consumer-table-card">

              {loading ? (

                <div className="consumer-loading">
                  <FaSyncAlt className="loading-spin" />
                  <h3>Loading Consumers...</h3>
                  <p>Fetching data from MongoDB</p>
                </div>

              ) : filteredConsumers.length === 0 ? (

                <div className="no-consumers">

                  <div className="empty-icon">
                    <FaUsers />
                  </div>

                  <h3>No Consumers Found</h3>

                  <p>
                    {search
                      ? "No matching consumer found."
                      : "No consumer records available."}
                  </p>

                  {!search && (
                    <button
                      type="button"
                      className="add-btn"
                      onClick={addConsumer}
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
                        <th>Consumer Number</th>
                        <th>Meter</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredConsumers.map((consumer) => (

                        <tr key={consumer._id}>

                          <td>
                            <div className="consumer-info">

                              <div className="consumer-avatar">
                                {consumer.name
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="consumer-name-content">

                                <strong>
                                  {consumer.name}
                                </strong>

                                <span>
                                  {consumer.email || "No email"}
                                </span>

                              </div>

                            </div>
                          </td>

                          <td>
                            <span className="consumer-number">
                              <FaIdCard />
                              {consumer.consumerNumber}
                            </span>
                          </td>

                          <td>
                            <span className="meter-number">
                              {consumer.meterNumber}
                            </span>
                          </td>

                          <td>

                            <div className="contact-info">

                              <span>
                                <FaPhone />
                                {consumer.mobile}
                              </span>

                              <span>
                                <FaEnvelope />
                                {consumer.email || "No email"}
                              </span>

                            </div>

                          </td>

                          <td>

                            <span
                              className={`status-badge ${
                                consumer.connectionStatus
                                  ?.toLowerCase() === "active"
                                  ? "active"
                                  : "inactive"
                              }`}
                            >
                              <span className="status-dot" />
                              {consumer.connectionStatus || "Active"}
                            </span>

                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                type="button"
                                className="edit-btn"
                                onClick={() =>
                                  editConsumer(consumer)
                                }
                                title="Edit Consumer"
                              >
                                <FaEdit />
                              </button>

                              <button
                                type="button"
                                className="delete-btn"
                                onClick={() =>
                                  deleteConsumer(consumer._id)
                                }
                                title="Delete Consumer"
                              >
                                <FaTrash />
                              </button>

                            </div>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </section>

        ) : (

          /* DASHBOARD */

          <>

            {/* STATS */}

            <section className="admin-stats">

              <div className="admin-stat-card">

                <div className="stat-icon">
                  <FaUsers />
                </div>

                <div>
                  <span>Total Consumers</span>
                  <h2>{stats.totalConsumers}</h2>
                </div>

              </div>

              <div className="admin-stat-card">

                <div className="stat-icon">
                  <FaUserCheck />
                </div>

                <div>
                  <span>Active Connections</span>
                  <h2>{stats.activeConsumers}</h2>
                </div>

              </div>

              <div className="admin-stat-card">

                <div className="stat-icon">
                  <FaUserTimes />
                </div>

                <div>
                  <span>Inactive Connections</span>
                  <h2>{stats.inactiveConsumers}</h2>
                </div>

              </div>

            </section>

            {/* WELCOME */}

            <section className="admin-welcome">

              <div className="welcome-icon">
                <FaBolt />
              </div>

              <div>

                <span className="section-label">
                  DGPS MANAGEMENT
                </span>

                <h2>
                  Electricity Consumer Portal
                </h2>

                <p>
                  Manage consumers, bills, payments,
                  complaints and notifications from one place.
                </p>

              </div>

            </section>

            {/* MANAGEMENT */}

            <section className="admin-section">

              <div className="section-heading">

                <span>ADMIN CONTROLS</span>

                <h2>Management</h2>

              </div>

              <div className="admin-management-grid">

                {/* CONSUMERS */}

                <div
                  className="management-card"
                  onClick={openConsumers}
                >
                  <div className="management-icon">
                    <FaUsers />
                  </div>

                  <h3>Consumer Management</h3>

                  <p>
                    View, add, edit and delete
                    registered consumers.
                  </p>

                  <span>
                    Manage Consumers →
                  </span>
                </div>

                {/* BILLS */}

                <div
                  className="management-card"
                  onClick={openBills}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      openBills();
                    }
                  }}
                >
                  <div className="management-icon">
                    <FaFileInvoiceDollar />
                  </div>

                  <h3>Bill Management</h3>

                  <p>
                    Create and manage electricity bills.
                  </p>

                  <span>
                    Manage Bills →
                  </span>
                </div>

                {/* PAYMENTS */}

                <div
                  className="management-card"
                  onClick={openPayments}
                >
                  <div className="management-icon">
                    <FaCreditCard />
                  </div>

                  <h3>Payment Management</h3>

                  <p>
                    Monitor consumer payments.
                  </p>

                  <span>
                    Manage Payments →
                  </span>
                </div>

                {/* COMPLAINTS */}

                <div
                  className="management-card"
                  onClick={openComplaints}
                >
                  <div className="management-icon">
                    <FaExclamationCircle />
                  </div>

                  <h3>Complaint Management</h3>

                  <p>
                    Review and manage consumer complaints.
                  </p>

                  <span>
                    Manage Complaints →
                  </span>
                </div>

                {/* NOTIFICATIONS */}

                <div
                  className="management-card"
                  onClick={() =>
                    alert(
                      "Notification Management coming soon."
                    )
                  }
                >
                  <div className="management-icon">
                    <FaBell />
                  </div>

                  <h3>Notification Management</h3>

                  <p>
                    Send important electricity updates.
                  </p>

                  <span>
                    Coming Soon →
                  </span>
                </div>

              </div>

            </section>

          </>

        )}

      </main>

      {/* ADD / EDIT MODAL */}

      {showForm && (

        <div
          className="consumer-modal-overlay"
          onClick={() => !saving && setShowForm(false)}
        >

          <div
            className="consumer-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div className="modal-title">

                <div className="modal-icon">
                  <FaUsers />
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
                onClick={() =>
                  !saving && setShowForm(false)
                }
              >
                <FaTimes />
              </button>

            </div>

            <form
              className="consumer-form"
              onSubmit={saveConsumer}
            >

              <div className="form-grid">

                <div className="form-group">
                  <label>Consumer Name *</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter consumer name"
                  />
                </div>

                <div className="form-group">
                  <label>Consumer Number *</label>

                  <input
                    type="text"
                    name="consumerNumber"
                    value={formData.consumerNumber}
                    onChange={handleChange}
                    placeholder="Enter consumer number"
                  />
                </div>

                <div className="form-group">
                  <label>Meter Number *</label>

                  <input
                    type="text"
                    name="meterNumber"
                    value={formData.meterNumber}
                    onChange={handleChange}
                    placeholder="Enter meter number"
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>

                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-group">
                  <label>Connection Status</label>

                  <select
                    name="connectionStatus"
                    value={formData.connectionStatus}
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
                  <label>Address *</label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter complete consumer address"
                    rows="3"
                  />
                </div>

              </div>

              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                >
                  <FaTimes />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
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

export default AdminDashboard;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBolt,
  FaFileInvoiceDollar,
  FaSearch,
  FaTimes,
  FaSyncAlt,
  FaUser,
  FaCreditCard,
  FaTrash,
  FaReceipt,
  FaEdit,
  FaSave,
} from "react-icons/fa";

import "../styles/paymentManagement.css";

function PaymentsManagement() {
  const navigate = useNavigate();

  // =====================================================
  // API
  // =====================================================

  const PAYMENT_API =
    "http://localhost:5000/api/admin/payments";

  // =====================================================
  // STATES
  // =====================================================

  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const [editForm, setEditForm] = useState({
    billMonth: "",
    amount: "",
    paymentMethod: "",
    status: "Success",
  });

  // =====================================================
  // LOAD PAYMENTS
  // =====================================================

  useEffect(() => {
    loadPayments();
  }, []);

  // =====================================================
  // GET ALL PAYMENTS
  // =====================================================

  const loadPayments = async () => {
    try {
      setLoading(true);

      const response = await fetch(PAYMENT_API);
      const data = await response.json();

      console.log("Payments Backend Response:", data);

      if (!response.ok) {
        alert(data.message || "Unable to load payments.");
        return;
      }

      setPayments(
        Array.isArray(data.payments)
          ? data.payments
          : []
      );
    } catch (error) {
      console.error("Load Payments Error:", error);

      alert(
        "Unable to connect to backend. Make sure Node.js server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (payment) => {
    setEditingPayment(payment);

    setEditForm({
      billMonth: payment.billMonth || "",
      amount: payment.amount || "",
      paymentMethod: payment.paymentMethod || "",
      status: payment.status || "Success",
    });

    setShowEditModal(true);
  };

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingPayment(null);

    setEditForm({
      billMonth: "",
      amount: "",
      paymentMethod: "",
      status: "Success",
    });
  };

  // =====================================================
  // HANDLE EDIT INPUT
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // UPDATE PAYMENT
  // =====================================================

  const updatePayment = async (e) => {
    e.preventDefault();

    if (!editingPayment?._id) {
      alert("Payment ID not found.");
      return;
    }

    if (
      !editForm.billMonth ||
      !editForm.amount ||
      !editForm.paymentMethod ||
      !editForm.status
    ) {
      alert("Please fill all payment details.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${PAYMENT_API}/${editingPayment._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            billMonth: editForm.billMonth,
            amount: Number(editForm.amount),
            paymentMethod: editForm.paymentMethod,
            status: editForm.status,
          }),
        }
      );

      const data = await response.json();

      console.log("Update Payment Response:", data);

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to update payment."
        );
        return;
      }

      alert("Payment updated successfully.");

      closeEditModal();

      await loadPayments();
    } catch (error) {
      console.error("Update Payment Error:", error);

      alert("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE PAYMENT
  // =====================================================

  const deletePayment = async (id) => {
    if (!id) {
      alert("Payment ID not found.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${PAYMENT_API}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to delete payment."
        );
        return;
      }

      alert("Payment deleted successfully.");

      await loadPayments();
    } catch (error) {
      console.error("Delete Payment Error:", error);

      alert("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredPayments = payments.filter(
    (payment) => {
      const text = search.trim().toLowerCase();

      if (!text) {
        return true;
      }

      const consumerName =
        payment.consumer?.name || "";

      const consumerNumber =
        payment.consumerNumber || "";

      const billNumber =
        payment.billNumber || "";

      const billMonth =
        payment.billMonth || "";

      const transactionId =
        payment.transactionId || "";

      const paymentMethod =
        payment.paymentMethod || "";

      return (
        consumerName
          .toLowerCase()
          .includes(text) ||
        consumerNumber
          .toLowerCase()
          .includes(text) ||
        billNumber
          .toLowerCase()
          .includes(text) ||
        billMonth
          .toLowerCase()
          .includes(text) ||
        transactionId
          .toLowerCase()
          .includes(text) ||
        paymentMethod
          .toLowerCase()
          .includes(text)
      );
    }
  );

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // TOTAL AMOUNT
  // =====================================================

  const totalAmount = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  // =====================================================
  // SUCCESSFUL PAYMENTS
  // =====================================================

  const successfulPayments =
    payments.filter(
      (payment) =>
        payment.status === "Success"
    ).length;

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="admin-dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="brand-icon">
            <FaBolt />
          </div>

          <div>
            <h2>DGVCL</h2>
            <span>Admin Panel</span>
          </div>

        </div>

        <div className="admin-menu">

          <div
            className="admin-menu-item"
            onClick={() =>
              navigate("/admin-dashboard")
            }
          >
            <FaBolt />
            <span>Dashboard</span>
          </div>

          <div
            className="admin-menu-item"
            onClick={() =>
              navigate("/admin-dashboard")
            }
          >
            <FaUser />
            <span>Consumers</span>
          </div>

          <div
            className="admin-menu-item"
            onClick={() =>
              navigate("/bills-management")
            }
          >
            <FaFileInvoiceDollar />
            <span>Bills</span>
          </div>

          <div className="admin-menu-item active">
            <FaCreditCard />
            <span>Payments</span>
          </div>

          <div
            className="admin-menu-item"
            onClick={() =>
              navigate("/complaints-management")
            }
          >
            <FaFileInvoiceDollar />
            <span>Complaints</span>
          </div>

        </div>

        <button
          className="admin-logout"
          onClick={() => {
            localStorage.removeItem("adminUser");
            navigate("/admin-login");
          }}
        >
          Logout
        </button>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>

            <span className="header-small">
              DGVCL ADMINISTRATION
            </span>

            <h1>
              Payment Management
            </h1>

            <p>
              View and manage consumer
              electricity payments
            </p>

          </div>

          <div className="admin-profile">

            <div className="profile-avatar">
              A
            </div>

            <div>
              <strong>
                Administrator
              </strong>

              <span>
                Admin
              </span>
            </div>

          </div>

        </header>

        {/* =================================================
            PAYMENT SECTION
        ================================================= */}

        <section className="consumer-section">

          {/* TOP BAR */}

          <div className="consumer-topbar">

            <div>

              <span className="section-label">
                PAYMENT DATABASE
              </span>

              <h2>
                <FaCreditCard />
                All Payments
              </h2>

              <p>
                Manage consumer payment
                records from MongoDB.
              </p>

            </div>

            <div className="consumer-top-actions">

              <button
                className="refresh-btn"
                onClick={loadPayments}
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

            </div>

          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="consumer-summary">

            <div className="summary-card">

              <div className="summary-icon total">
                <FaCreditCard />
              </div>

              <div>
                <span>
                  Total Payments
                </span>

                <strong>
                  {payments.length}
                </strong>
              </div>

            </div>

            <div className="summary-card">

              <div className="summary-icon active">
                <FaReceipt />
              </div>

              <div>
                <span>
                  Successful
                </span>

                <strong>
                  {successfulPayments}
                </strong>
              </div>

            </div>

            <div className="summary-card">

              <div className="summary-icon total">
                <FaFileInvoiceDollar />
              </div>

              <div>
                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{totalAmount}
                </strong>
              </div>

            </div>

          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="consumer-search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search by consumer name, number, bill number, transaction ID or payment method..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
              >
                <FaTimes />
              </button>
            )}

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="consumer-table-card">

            {loading ? (

              <div className="consumer-loading">

                <FaSyncAlt
                  className="loading-spin"
                />

                <h3>
                  Loading Payments...
                </h3>

                <p>
                  Fetching payment data
                  from MongoDB
                </p>

              </div>

            ) : filteredPayments.length === 0 ? (

              <div className="no-consumers">

                <div className="empty-icon">
                  <FaCreditCard />
                </div>

                <h3>
                  No Payments Found
                </h3>

                <p>
                  {search
                    ? "No matching payment found."
                    : "No payment records are available yet."}
                </p>

              </div>

            ) : (

              <div className="table-wrapper">

                <table className="payments-table">

                  <thead>

                    <tr>

                      <th className="consumer-column">
                        Consumer
                      </th>

                      <th className="bill-number-column">
                        Bill Number
                      </th>

                      <th className="bill-month-column">
                        Month
                      </th>

                      <th className="amount-column">
                        Amount
                      </th>

                      <th className="method-column">
                        Payment Method
                      </th>

                      <th className="transaction-column">
                        Transaction ID
                      </th>

                      <th className="date-column">
                        Payment Date
                      </th>

                      <th className="status-column">
                        Status
                      </th>

                      <th className="action-column">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredPayments.map(
                      (payment) => {

                        const consumerName =
                          payment.consumer?.name ||
                          "Unknown Consumer";

                        const consumerNumber =
                          payment.consumerNumber ||
                          payment.consumer
                            ?.consumerNumber ||
                          "N/A";

                        return (
                          <tr key={payment._id}>

                            {/* CONSUMER */}

                            <td className="consumer-cell">

                              <div className="consumer-info">

                                <div className="consumer-avatar">

                                  {consumerName
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>

                                <div className="consumer-name-content">

                                  <strong>
                                    {consumerName}
                                  </strong>

                                  <span>
                                    {consumerNumber}
                                  </span>

                                </div>

                              </div>

                            </td>

                            {/* BILL NUMBER */}

                            <td className="bill-number-cell">

                              <span className="bill-number-content">

                                <FaFileInvoiceDollar />

                                <span className="bill-number-text">
                                  {payment.billNumber || "N/A"}
                                </span>

                              </span>

                            </td>

                            {/* MONTH */}

                            <td className="bill-month-cell">
                              <span className="bill-month-text">
                                {payment.billMonth || "N/A"}
                              </span>
                            </td>

                            {/* AMOUNT */}

                            <td className="amount-cell">

                              <strong>
                                ₹{payment.amount}
                              </strong>

                            </td>

                            {/* PAYMENT METHOD */}

                            <td className="method-cell">

                              <span className="consumer-number">

                                <FaCreditCard />

                                {payment.paymentMethod || "N/A"}

                              </span>

                            </td>

                            {/* TRANSACTION */}

                            <td className="transaction-cell">

                              <span className="transaction-text">
                                {payment.transactionId || "N/A"}
                              </span>

                            </td>

                            {/* DATE */}

                            <td className="date-cell">

                              {formatDate(
                                payment.paymentDate
                              )}

                            </td>

                            {/* STATUS */}

                            <td className="status-cell">

                              <span
                                className={`status-badge ${
                                  payment.status === "Success"
                                    ? "active"
                                    : "inactive"
                                }`}
                              >

                                <span className="status-dot" />

                                {payment.status}

                              </span>

                            </td>

                            {/* ACTION */}

                            <td className="action-cell">

                              <div className="action-buttons">

                                <button
                                  type="button"
                                  className="edit-btn"
                                  onClick={() =>
                                    openEditModal(payment)
                                  }
                                  title="Edit Payment"
                                >
                                  <FaEdit />
                                </button>

                                <button
                                  type="button"
                                  className="delete-btn"
                                  onClick={() =>
                                    deletePayment(
                                      payment._id
                                    )
                                  }
                                  title="Delete Payment"
                                >
                                  <FaTrash />
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </section>

      </main>

      {/* =================================================
          EDIT PAYMENT MODAL
      ================================================= */}

      {showEditModal && (

        <div
          className="payment-modal-overlay"
          onClick={closeEditModal}
        >

          <div
            className="payment-edit-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="payment-modal-header">

              <div>

                <span>
                  PAYMENT MANAGEMENT
                </span>

                <h2>
                  Edit Payment
                </h2>

              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closeEditModal}
              >
                <FaTimes />
              </button>

            </div>

            {/* PAYMENT INFORMATION */}

            {editingPayment && (

              <div className="payment-readonly-info">

                <div>
                  <span>
                    Consumer
                  </span>

                  <strong>
                    {editingPayment.consumer?.name ||
                      "Unknown Consumer"}
                  </strong>
                </div>

                <div>
                  <span>
                    Consumer Number
                  </span>

                  <strong>
                    {editingPayment.consumerNumber ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <span>
                    Bill Number
                  </span>

                  <strong>
                    {editingPayment.billNumber ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <span>
                    Transaction ID
                  </span>

                  <strong>
                    {editingPayment.transactionId ||
                      "N/A"}
                  </strong>
                </div>

              </div>

            )}

            {/* FORM */}

            <form
              className="payment-edit-form"
              onSubmit={updatePayment}
            >

              <div className="form-group">

                <label>
                  Bill Month
                </label>

                <input
                  type="text"
                  name="billMonth"
                  value={editForm.billMonth}
                  onChange={handleEditChange}
                  placeholder="Example: August 2026"
                />

              </div>

              <div className="form-group">

                <label>
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={editForm.amount}
                  onChange={handleEditChange}
                  min="0"
                  placeholder="Enter amount"
                />

              </div>

              <div className="form-group">

                <label>
                  Payment Method
                </label>

                <select
                  name="paymentMethod"
                  value={editForm.paymentMethod}
                  onChange={handleEditChange}
                >

                  <option value="">
                    Select Payment Method
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="Debit Card">
                    Debit Card
                  </option>

                  <option value="Credit Card">
                    Credit Card
                  </option>

                  <option value="Net Banking">
                    Net Banking
                  </option>

                  <option value="Cash">
                    Cash
                  </option>

                </select>

              </div>

              <div className="form-group">

                <label>
                  Payment Status
                </label>

                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                >

                  <option value="Success">
                    Success
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Failed">
                    Failed
                  </option>

                </select>

              </div>

              <div className="payment-modal-actions">

                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-edit-btn"
                  disabled={loading}
                >

                  <FaSave />

                  {loading
                    ? "Updating..."
                    : "Update Payment"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default PaymentsManagement;
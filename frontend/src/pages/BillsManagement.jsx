import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBolt,
  FaFileInvoiceDollar,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaIdCard,
  FaSyncAlt,
  FaUser,
} from "react-icons/fa";

import "../styles/billsManagement.css";

function BillsManagement() {
  const navigate = useNavigate();

  // =====================================================
  // API URL
  // =====================================================

  const BILL_API =
    "http://localhost:5000/api/admin/bills";

  const USER_API =
    "http://localhost:5000/api/admin/users";

  // =====================================================
  // STATES
  // =====================================================

  const [bills, setBills] = useState([]);
  const [consumers, setConsumers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    consumerId: "",
    consumerNumber: "",
    billingMonth: "",
    billNumber: "",
    units: "",
    dueDate: "",
    status: "Pending",
  });

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadBills();
    loadConsumers();
  }, []);

  // =====================================================
  // LOAD ALL BILLS
  // =====================================================

  const loadBills = async () => {
    try {
      setLoading(true);

      const response = await fetch(BILL_API);
      const data = await response.json();

      console.log("========== BILLS RESPONSE ==========");
      console.log(data);

      if (!response.ok) {
        alert(data.message || "Unable to load bills.");
        return;
      }

      setBills(
        Array.isArray(data.bills)
          ? data.bills
          : []
      );
    } catch (error) {
      console.error("Load Bills Error:", error);

      alert(
        "Unable to connect to backend. Make sure Node.js server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ALL CONSUMERS
  // =====================================================

  const loadConsumers = async () => {
    try {
      const response = await fetch(USER_API);
      const data = await response.json();

      console.log("========== CONSUMERS RESPONSE ==========");
      console.log(data);

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to load consumers."
        );
        return;
      }

      setConsumers(
        Array.isArray(data.users)
          ? data.users
          : []
      );
    } catch (error) {
      console.error(
        "Load Consumers Error:",
        error
      );

      alert(
        "Unable to load consumers from MongoDB."
      );
    }
  };

  // =====================================================
  // GET CONSUMER FOR BILL
  // =====================================================

  const getBillConsumer = (bill) => {
    // ---------------------------------------------------
    // OPTION 1: POPULATED CONSUMER
    // ---------------------------------------------------

    if (
      bill.consumerId &&
      typeof bill.consumerId === "object" &&
      bill.consumerId.name
    ) {
      return bill.consumerId;
    }

    // ---------------------------------------------------
    // OPTION 2: FIND USING CONSUMER NUMBER
    // ---------------------------------------------------

    const consumerNumber =
      bill.consumerNumber ||
      (
        bill.consumerId &&
        typeof bill.consumerId === "object"
          ? bill.consumerId.consumerNumber
          : ""
      );

    if (consumerNumber) {
      const foundConsumer =
        consumers.find(
          (consumer) =>
            String(
              consumer.consumerNumber
            ).trim() ===
            String(
              consumerNumber
            ).trim()
        );

      if (foundConsumer) {
        return foundConsumer;
      }
    }

    // ---------------------------------------------------
    // OPTION 3: FIND USING CONSUMER ID
    // ---------------------------------------------------

    if (
      bill.consumerId &&
      typeof bill.consumerId === "string"
    ) {
      const foundConsumer =
        consumers.find(
          (consumer) =>
            String(consumer._id) ===
            String(bill.consumerId)
        );

      if (foundConsumer) {
        return foundConsumer;
      }
    }

    return null;
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ---------------------------------------------------
    // CONSUMER SELECT
    // ---------------------------------------------------

    if (name === "consumerId") {
      const selectedConsumer =
        consumers.find(
          (consumer) =>
            String(consumer._id) ===
            String(value)
        );

      setFormData((previous) => ({
        ...previous,
        consumerId: value,
        consumerNumber:
          selectedConsumer?.consumerNumber ||
          "",
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // OPEN ADD BILL FORM
  // =====================================================

  const openAddBill = () => {
    setEditingId(null);

    setFormData({
      consumerId: "",
      consumerNumber: "",
      billingMonth: "",
      billNumber: "",
      units: "",
      dueDate: "",
      status: "Pending",
    });

    setShowForm(true);
  };

  // =====================================================
  // EDIT BILL
  // =====================================================

  const editBill = (bill) => {
    const consumer =
      getBillConsumer(bill);

    setEditingId(bill._id);

    setFormData({
      consumerId:
        bill.consumerId?._id ||
        bill.consumerId ||
        consumer?._id ||
        "",

      consumerNumber:
        bill.consumerNumber ||
        consumer?.consumerNumber ||
        "",

      billingMonth:
        bill.billingMonth || "",

      billNumber:
        bill.billNumber || "",

      units:
        bill.units ?? "",

      dueDate:
        bill.dueDate
          ? new Date(bill.dueDate)
              .toISOString()
              .split("T")[0]
          : "",

      status:
        bill.status || "Pending",
    });

    setShowForm(true);
  };

  // =====================================================
  // SAVE BILL
  // =====================================================

  const saveBill = async (e) => {
    e.preventDefault();

    if (!formData.consumerId) {
      alert("Please select a consumer.");
      return;
    }

    if (!formData.billNumber.trim()) {
      alert("Please enter bill number.");
      return;
    }

    if (!formData.billingMonth) {
      alert("Please select billing month.");
      return;
    }

    if (
      formData.units === "" ||
      Number(formData.units) < 0
    ) {
      alert("Please enter valid units.");
      return;
    }

    if (!formData.dueDate) {
      alert("Please select due date.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${BILL_API}/${editingId}`
        : `${BILL_API}/create`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            consumerId:
              formData.consumerId,

            consumerNumber:
              formData.consumerNumber,

            billNumber:
              formData.billNumber.trim(),

            billingMonth:
              formData.billingMonth,

            units:
              Number(formData.units),

            dueDate:
              formData.dueDate,

            status:
              formData.status,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Save Bill Response:",
        data
      );

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to save bill."
        );

        return;
      }

      alert(
        editingId
          ? "Bill updated successfully."
          : "Bill created successfully."
      );

      setShowForm(false);
      setEditingId(null);

      setFormData({
        consumerId: "",
        consumerNumber: "",
        billingMonth: "",
        billNumber: "",
        units: "",
        dueDate: "",
        status: "Pending",
      });

      await loadBills();
    } catch (error) {
      console.error(
        "Save Bill Error:",
        error
      );

      alert(
        "Unable to connect to backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE BILL
  // =====================================================

  const deleteBill = async (id) => {
    if (!id) {
      alert("Bill ID not found.");
      return;
    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this bill?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${BILL_API}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to delete bill."
        );

        return;
      }

      alert(
        "Bill deleted successfully."
      );

      await loadBills();
    } catch (error) {
      console.error(
        "Delete Bill Error:",
        error
      );

      alert(
        "Unable to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredBills =
    bills.filter((bill) => {
      const text =
        search.trim().toLowerCase();

      if (!text) {
        return true;
      }

      const consumer =
        getBillConsumer(bill);

      const consumerName =
        consumer?.name || "";

      const consumerNumber =
        bill.consumerNumber ||
        consumer?.consumerNumber ||
        "";

      const billNumber =
        bill.billNumber || "";

      const billingMonth =
        bill.billingMonth || "";

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

        billingMonth
          .toLowerCase()
          .includes(text)
      );
    });

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

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
              navigate(
                "/admin-dashboard"
              )
            }
          >
            <FaBolt />
            <span>Dashboard</span>
          </div>

          <div
            className="admin-menu-item"
            onClick={() =>
              navigate(
                "/admin-dashboard"
              )
            }
          >
            <FaUser />
            <span>Consumers</span>
          </div>

          <div className="admin-menu-item active">
            <FaFileInvoiceDollar />
            <span>Bills</span>
          </div>

          <div
            className="admin-menu-item"
            onClick={() =>
              navigate(
                "/payments-management"
              )
            }
          >
            <FaFileInvoiceDollar />
            <span>Payments</span>
          </div>

          <div
            className="admin-menu-item"
            onClick={() =>
              navigate(
                "/complaints-management"
              )
            }
          >
            <FaFileInvoiceDollar />
            <span>Complaints</span>
          </div>

        </div>

        <button
          className="admin-logout"
          onClick={() => {
            localStorage.removeItem(
              "adminUser"
            );

            navigate(
              "/admin-login"
            );
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
              Bill Management
            </h1>

            <p>
              Create, update and manage
              electricity bills
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

        {/* BILL SECTION */}

        <section className="consumer-section">

          {/* TOP BAR */}

          <div className="consumer-topbar">

            <div>

              <span className="section-label">
                BILL DATABASE
              </span>

              <h2>
                <FaFileInvoiceDollar />
                All Electricity Bills
              </h2>

              <p>
                Manage consumer electricity
                bills directly from MongoDB.
              </p>

            </div>

            <div className="consumer-top-actions">

              <button
                className="refresh-btn"
                onClick={loadBills}
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

              <button
                className="add-btn"
                onClick={
                  openAddBill
                }
              >
                <FaPlus />
                Add New Bill
              </button>

            </div>

          </div>

          {/* SUMMARY */}

          <div className="consumer-summary">

            {/* TOTAL BILLS */}

            <div className="summary-card">

              <div className="summary-icon total">
                <FaFileInvoiceDollar />
              </div>

              <div>
                <span>
                  Total Bills
                </span>

                <strong>
                  {bills.length}
                </strong>
              </div>

            </div>

            {/* PAID BILLS */}

            <div className="summary-card">

              <div className="summary-icon active">
                <FaFileInvoiceDollar />
              </div>

              <div>
                <span>
                  Paid Bills
                </span>

                <strong>
                  {
                    bills.filter(
                      (bill) =>
                        bill.status ===
                        "Paid"
                    ).length
                  }
                </strong>
              </div>

            </div>

            {/* PENDING BILLS */}

            <div className="summary-card">

              <div className="summary-icon inactive">
                <FaFileInvoiceDollar />
              </div>

              <div>
                <span>
                  Pending Bills
                </span>

                <strong>
                  {
                    bills.filter(
                      (bill) =>
                        bill.status ===
                        "Pending"
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
              placeholder="Search by consumer name, number, bill number or month..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
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

          {/* TABLE */}

          <div className="consumer-table-card">

            {loading ? (

              <div className="consumer-loading">

                <FaSyncAlt
                  className="loading-spin"
                />

                <h3>
                  Loading Bills...
                </h3>

                <p>
                  Fetching bills from MongoDB
                </p>

              </div>

            ) : filteredBills.length ===
              0 ? (

              <div className="no-consumers">

                <div className="empty-icon">
                  <FaFileInvoiceDollar />
                </div>

                <h3>
                  No Bills Found
                </h3>

                <p>
                  {search
                    ? "No matching bill found."
                    : "No electricity bills have been added yet."}
                </p>

                {!search && (
                  <button
                    className="add-btn"
                    onClick={
                      openAddBill
                    }
                  >
                    <FaPlus />
                    Add First Bill
                  </button>
                )}

              </div>

            ) : (

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Consumer
                      </th>

                      <th className="bill-number-column">
                        Bill Number
                      </th>

                      <th className="bill-month-column">
                        Month
                      </th>

                      <th>
                        Units
                      </th>

                      <th>
                        Amount
                      </th>

                      <th>
                        Due Date
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredBills.map(
                      (bill) => {

                        const consumer =
                          getBillConsumer(
                            bill
                          );

                        const consumerName =
                          consumer?.name ||
                          "Unknown Consumer";

                        const consumerNumber =
                          bill.consumerNumber ||
                          consumer?.consumerNumber ||
                          "N/A";

                        return (

                          <tr
                            key={
                              bill._id
                            }
                          >

                            {/* CONSUMER */}

                            <td>

                              <div className="consumer-info">

                                <div className="consumer-avatar">

                                  {consumerName
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>

                                <div className="consumer-name-content">

                                  <strong>
                                    {
                                      consumerName
                                    }
                                  </strong>

                                  <span>
                                    {
                                      consumerNumber
                                    }
                                  </span>

                                </div>

                              </div>

                            </td>

                            {/* BILL NUMBER */}

                            <td className="bill-number-cell">

                              <span className="consumer-number bill-number-content">

                                <FaIdCard />

                                <span>
                                  {
                                    bill.billNumber
                                  }
                                </span>

                              </span>

                            </td>

                            {/* MONTH */}

                            <td className="bill-month-cell">

                              <span className="bill-month-content">
                                {
                                  bill.billingMonth
                                }
                              </span>

                            </td>

                            {/* UNITS */}

                            <td>
                              {bill.units}{" "}
                              Units
                            </td>

                            {/* AMOUNT */}

                            <td>

                              <strong>
                                ₹
                                {
                                  bill.billAmount
                                }
                              </strong>

                            </td>

                            {/* DUE DATE */}

                            <td>
                              {formatDate(
                                bill.dueDate
                              )}
                            </td>

                            {/* STATUS */}

                            <td>

                              <span
                                className={`status-badge ${
                                  bill.status ===
                                  "Paid"
                                    ? "active"
                                    : "inactive"
                                }`}
                              >

                                <span className="status-dot" />

                                {
                                  bill.status
                                }

                              </span>

                            </td>

                            {/* ACTIONS */}

                            <td>

                              <div className="action-buttons">

                                <button
                                  type="button"
                                  className="edit-btn"
                                  onClick={() =>
                                    editBill(
                                      bill
                                    )
                                  }
                                  title="Edit Bill"
                                >
                                  <FaEdit />
                                </button>

                                <button
                                  type="button"
                                  className="delete-btn"
                                  onClick={() =>
                                    deleteBill(
                                      bill._id
                                    )
                                  }
                                  title="Delete Bill"
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
          ADD / EDIT BILL MODAL
      ================================================= */}

      {showForm && (

        <div
          className="consumer-modal-overlay"
          onClick={() =>
            !saving &&
            setShowForm(false)
          }
        >

          <div
            className="consumer-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="modal-header">

              <div className="modal-title">

                <div className="modal-icon">
                  <FaFileInvoiceDollar />
                </div>

                <div>

                  <span>
                    BILL MANAGEMENT
                  </span>

                  <h2>
                    {editingId
                      ? "Edit Bill"
                      : "Create New Bill"}
                  </h2>

                </div>

              </div>

              <button
                type="button"
                className="close-modal"
                onClick={() =>
                  !saving &&
                  setShowForm(false)
                }
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              className="consumer-form"
              onSubmit={saveBill}
            >

              <div className="form-grid">

                {/* CONSUMER */}

                <div className="form-group full-width">

                  <label>
                    Select Consumer *
                  </label>

                  <select
                    name="consumerId"
                    value={
                      formData.consumerId
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="">
                      -- Select Consumer --
                    </option>

                    {consumers.map(
                      (consumer) => (

                        <option
                          key={
                            consumer._id
                          }
                          value={
                            consumer._id
                          }
                        >
                          {consumer.name} -{" "}
                          {
                            consumer.consumerNumber
                          }
                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* CONSUMER NUMBER */}

                <div className="form-group">

                  <label>
                    Consumer Number
                  </label>

                  <input
                    type="text"
                    value={
                      formData.consumerNumber
                    }
                    readOnly
                    placeholder="Consumer number"
                  />

                </div>

                {/* BILL NUMBER */}

                <div className="form-group">

                  <label>
                    Bill Number *
                  </label>

                  <input
                    type="text"
                    name="billNumber"
                    value={
                      formData.billNumber
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter bill number"
                  />

                </div>

                {/* BILL MONTH */}

                <div className="form-group">

                  <label>
                    Billing Month *
                  </label>

                  <input
                    type="month"
                    name="billingMonth"
                    value={
                      formData.billingMonth
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* UNITS */}

                <div className="form-group">

                  <label>
                    Units Consumed *
                  </label>

                  <input
                    type="number"
                    name="units"
                    value={
                      formData.units
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter units"
                    min="0"
                  />

                </div>

                {/* DUE DATE */}

                <div className="form-group">

                  <label>
                    Due Date *
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={
                      formData.dueDate
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* STATUS */}

                <div className="form-group">

                  <label>
                    Payment Status
                  </label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Paid">
                      Paid
                    </option>

                    <option value="Overdue">
                      Overdue
                    </option>

                  </select>

                </div>

              </div>

              {/* INFO */}

              <div
                style={{
                  marginTop: "15px",
                  padding:
                    "12px 15px",
                  borderRadius: "10px",
                  background:
                    "rgba(0, 198, 255, 0.08)",
                  fontSize: "13px",
                }}
              >

                <strong>
                  Bill Amount:
                </strong>{" "}

                Amount will be automatically
                calculated by the backend
                based on units consumed.

              </div>

              {/* BUTTONS */}

              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
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
                        ? "Update Bill"
                        : "Create Bill"}
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

export default BillsManagement;
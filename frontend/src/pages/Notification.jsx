import React, { useEffect, useState } from "react";

import {
  FaBell,
  FaBolt,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaTools,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaArrowLeft,
  FaSearch,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "../styles/notifications.css";

function Notification() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    fetchNotifications();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotifications = async () => {
    try {
      const savedUser = localStorage.getItem("loggedInUser");

      if (!savedUser) {
        navigate("/login");
        return;
      }

      const user = JSON.parse(savedUser);

      const consumerNumber = user.consumerNumber;

      if (!consumerNumber) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/notifications/${consumerNumber}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch notifications");
      }

      const data = await response.json();

      console.log("Notifications:", data);

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Notification Error:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // MARK ONE AS READ
  // =====================================================

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to mark as read");
      }

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark Read Error:", error);
    }
  };

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const markAllAsRead = async () => {
    try {
      const savedUser = localStorage.getItem("loggedInUser");

      if (!savedUser) {
        return;
      }

      const user = JSON.parse(savedUser);

      const consumerNumber = user.consumerNumber;

      if (!consumerNumber) {
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/notifications/read-all/${consumerNumber}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to mark all as read");
      }

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error("Mark All Read Error:", error);
    }
  };

  // =====================================================
  // ICON
  // =====================================================

  const getIcon = (type) => {
    switch (type) {
      case "Power Outage":
        return <FaBolt />;

      case "Bill Due":
        return <FaFileInvoiceDollar />;

      case "Payment":
        return <FaCreditCard />;

      case "Maintenance":
        return <FaTools />;

      case "Important":
        return <FaExclamationTriangle />;

      default:
        return <FaInfoCircle />;
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredNotifications = notifications.filter(
    (notification) => {
      const searchText = search.toLowerCase();

      const title =
        notification.title?.toLowerCase() || "";

      const message =
        notification.message?.toLowerCase() || "";

      const matchesSearch =
        title.includes(searchText) ||
        message.includes(searchText);

      const matchesFilter =
        filter === "All" ||
        notification.type === filter;

      return matchesSearch && matchesFilter;
    }
  );

  // =====================================================
  // UNREAD COUNT
  // =====================================================

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
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
  // UI
  // =====================================================

  return (
    <div className="notifications-page">

      {/* HEADER */}

      <div className="notifications-header">

        <button
          className="notification-back"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        <div className="notification-title">

          <div className="notification-main-icon">
            <FaBell />
          </div>

          <div>
            <h1>Notifications</h1>

            <p>
              Stay updated with your
              electricity services
            </p>
          </div>

        </div>

      </div>

      <div className="notifications-container">

        {/* SUMMARY */}

        <div className="notification-summary">

          <div className="notification-stat">

            <FaBell />

            <div>
              <span>
                Total Notifications
              </span>

              <strong>
                {notifications.length}
              </strong>
            </div>

          </div>

          <div className="notification-stat">

            <FaCheckCircle />

            <div>
              <span>
                Unread Notifications
              </span>

              <strong>
                {unreadCount}
              </strong>
            </div>

          </div>

          <button
            className="mark-all-btn"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <FaCheckCircle />
            Mark All as Read
          </button>

        </div>

        {/* SEARCH */}

        <div className="notification-tools">

          <div className="notification-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="All">
              All Notifications
            </option>

            <option value="Power Outage">
              Power Outage
            </option>

            <option value="Bill Due">
              Bill Due
            </option>

            <option value="Payment">
              Payment
            </option>

            <option value="Maintenance">
              Maintenance
            </option>

            <option value="Important">
              Important
            </option>

            <option value="General">
              General
            </option>
          </select>

        </div>

        {/* NOTIFICATION LIST */}

        <div className="notification-list">

          {loading ? (

            <div className="notification-empty">

              <FaBell />

              <h3>
                Loading Notifications...
              </h3>

              <p>
                Please wait while we
                fetch your notifications.
              </p>

            </div>

          ) : filteredNotifications.length === 0 ? (

            <div className="notification-empty">

              <FaBell />

              <h3>
                No Notifications
              </h3>

              <p>
                You don't have any
                notifications right now.
              </p>

            </div>

          ) : (

            filteredNotifications.map(
              (notification) => (

                <div
                  key={notification._id}
                  className={
                    `notification-card ${
                      notification.read
                        ? "read"
                        : "unread"
                    }`
                  }
                >

                  <div
                    className={
                      `notification-icon ${
                        (notification.type || "General")
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                      }`
                    }
                  >
                    {getIcon(notification.type)}
                  </div>

                  <div className="notification-content">

                    <div className="notification-top">

                      <h3>

                        {notification.title}

                        {!notification.read && (
                          <span className="new-badge">
                            NEW
                          </span>
                        )}

                      </h3>

                      <span className="notification-date">
                        {formatDate(
                          notification.createdAt
                        )}
                      </span>

                    </div>

                    <p>
                      {notification.message}
                    </p>

                    <div className="notification-bottom">

                      <span className="notification-type">
                        {notification.type}
                      </span>

                      {!notification.read && (

                        <button
                          onClick={() =>
                            markAsRead(
                              notification._id
                            )
                          }
                        >
                          <FaCheckCircle />
                          Mark as Read
                        </button>

                      )}

                    </div>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>
  );
}

export default Notification;
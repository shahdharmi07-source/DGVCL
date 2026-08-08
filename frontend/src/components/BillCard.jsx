import React from "react";
import { FaBolt } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";

function BillCard({ bill }) {

  return (

    <div className="bill-card">

      <div className="bill-top">

        <FaBolt className="bill-icon" />

        <span
          className={
            bill.status === "Paid"
              ? "status paid"
              : "status unpaid"
          }
        >
          {bill.status}
        </span>

      </div>

      <h2>{bill.month}</h2>

      <p><strong>Bill No:</strong> {bill.billNo}</p>

      <p><strong>Units:</strong> {bill.units} kWh</p>

      <p><strong>Due Date:</strong> {bill.dueDate}</p>

      <h3>₹ {bill.amount}</h3>

      {
        bill.status === "Unpaid" ? (

          <button className="pay-btn">

            <MdOutlinePayments />

            Pay Now

          </button>

        ) : (

          <button className="receipt-btn">

            View Receipt

          </button>

        )
      }

    </div>

  );
}

export default BillCard;
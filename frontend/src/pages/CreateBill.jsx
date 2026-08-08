import React, { useState } from "react";

function CreateBill() {

  const [formData, setFormData] = useState({
    consumerNumber: "",
    billNumber: "",
    month: "",
    units: "",
    amount: "",
    dueDate: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");


    try {

      const response = await fetch(
        "http://localhost:5000/api/bills/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(formData)
        }
      );


      const data = await response.json();


      if (response.ok) {

        setMessage("Bill created successfully!");

        setFormData({
          consumerNumber: "",
          billNumber: "",
          month: "",
          units: "",
          amount: "",
          dueDate: ""
        });

      } else {

        setMessage(
          data.message || "Bill creation failed"
        );

      }

    } catch (error) {

      console.log(error);

      setMessage(
        "Backend server is not connected."
      );

    }

  };


  return (

    <div>

      <h1>Create New Bill</h1>

      {message && (

        <p>

          {message}

        </p>

      )}


      <form onSubmit={handleSubmit}>

        <div>

          <label>
            Consumer Number
          </label>

          <input
            type="text"
            name="consumerNumber"
            value={formData.consumerNumber}
            onChange={handleChange}
            placeholder="Enter Consumer Number"
          />

        </div>


        <div>

          <label>
            Bill Number
          </label>

          <input
            type="text"
            name="billNumber"
            value={formData.billNumber}
            onChange={handleChange}
            placeholder="Enter Bill Number"
          />

        </div>


        <div>

          <label>
            Month
          </label>

          <input
            type="text"
            name="month"
            value={formData.month}
            onChange={handleChange}
            placeholder="Example: July 2026"
          />

        </div>


        <div>

          <label>
            Units
          </label>

          <input
            type="number"
            name="units"
            value={formData.units}
            onChange={handleChange}
            placeholder="Enter Units"
          />

        </div>


        <div>

          <label>
            Amount
          </label>

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter Bill Amount"
          />

        </div>


        <div>

          <label>
            Due Date
          </label>

          <input
            type="text"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            placeholder="Example: 30/07/2026"
          />

        </div>


        <button type="submit">

          Create Bill

        </button>

      </form>

    </div>

  );

}

export default CreateBill;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/about";
import Bills from "./pages/Bills";
import PayBill from "./pages/PayBill";
import Receipt from "./pages/Receipt";
import Login from "./pages/Login";
import Otp from "./pages/Otp";
import Services from "./pages/Services";
import ContactUs from "./pages/ContactUs";
import DownloadBill from "./pages/DownloadBill";
import Complaint from "./pages/Complaint";
import Usage from "./pages/Usage";
import CreateBill from "./pages/CreateBill";
import MyProfile from "./pages/MyProfile";
import PaymentHistory from "./pages/PaymentHistory";
import Notification from "./pages/Notification";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ConsumerManagement from "./pages/ConsumerManagement";
import BillsManagement from "./pages/BillsManagement";
import Dashboard from "./pages/Dashboard";
import PaymentsManagement from "./pages/PaymentsManagement";
import ComplaintManagement from "./pages/ComplaintManagement";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/bills" element={<Bills />} />

        <Route path="/paybill" element={<PayBill />} />

        <Route path="/receipt" element={<Receipt />} />

        <Route path="/login" element={<Login />} />

        <Route path="/otp" element={<Otp />} />

        <Route path="/services" element={<Services />} />

        <Route path="/contact" element={<ContactUs />} />

        <Route path="/downloadbill" element={<DownloadBill />} />

        <Route path="/complaint" element={<Complaint />} />

        <Route path="/usage" element={<Usage />} />

        <Route path="/create-bill"element={<CreateBill />}/>

         <Route path="/myprofile"element={<MyProfile />}/>

         <Route path="/paymenthistory" element={<PaymentHistory />} />

        <Route path="/notification" element={<Notification />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        <Route path="/consumer-management" element={<ConsumerManagement />} />

        <Route path="/bills-management" element={<BillsManagement />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/payments-management" element={<PaymentsManagement />} />

        <Route path="/complaints-management" element={<ComplaintManagement />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

    </BrowserRouter>
  );
}

export default App;
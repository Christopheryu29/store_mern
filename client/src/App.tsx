import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import PrivateOwnerRoute from "./pages/PrivateOwnerRoute";
import OwnerDashboard from "./pages/OwnerDashboard";
import InventoryPage from "./pages/InventoryPage";
import SalesPage from "./pages/SalesPage";
import StaffPage from "./pages/StaffPage";
import CheckoutPage from "./pages/CheckoutPage";
import InvoicePage from "./pages/InvoicePage";
import FinancialSummaryPage from "./pages/FinancialSummaryPage";
import ActivityLogPage from "./pages/ActivityLogPage";
import RefundHistoryPage from "./pages/RefundHistoryPage";
import RefundPage from "./pages/RefundPage";
import ExpenseCalendarPage from "./pages/ExpenseCalendarPage";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<PrivateOwnerRoute />}>
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/invoice" element={<InvoicePage />} />
          <Route path="/financial-summary" element={<FinancialSummaryPage />} />
          <Route path="/activity-log" element={<ActivityLogPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/refund-history" element={<RefundHistoryPage />} />
          <Route path="/calendar" element={<ExpenseCalendarPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

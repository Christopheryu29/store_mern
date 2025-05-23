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
import InventoryPage from "./pages/inventory/InventoryPage";
import SalesPage from "./pages/sales/SalesPage";
import StaffPage from "./pages/staff/StaffPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import InvoicePage from "./pages/InvoicePage";
import FinancialSummaryPage from "./pages/financial-summary/FinancialSummaryPage";
import ActivityLogPage from "./pages/activity-log/ActivityLogPage";
import RefundHistoryPage from "./pages/refund-history/RefundHistoryPage";
import RefundPage from "./pages/refund/RefundPage";
import ExpenseCalendarPage from "./pages/calendar/ExpenseCalendarPage";
import InvoiceSettingsPage from "./pages/invoice-settings/InvoiceSettingsPage";
import CustomerProfilesPage from "./pages/customers/CustomerProfilesPage";
import RestockPage from "./pages/restock/RestockPage";

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
          <Route path="/invoice-settings" element={<InvoiceSettingsPage />} />
          <Route path="/customers" element={<CustomerProfilesPage />} />
          <Route path="/restock" element={<RestockPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

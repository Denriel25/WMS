import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../auth/Login";
import Signup from "../auth/Signup";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";

import AdminDashboard from "../Admin/AdminDashboard";
import Inventory from "../Admin/Inventory";
import StockIn from "../Admin/StockIn";
import StockOut from "../Admin/StockOut";
import Reports from "../Admin/Reports";
import Notifications from "../Admin/Notifications";
import ActivityLogs from "../Admin/ActivityLogs";
import AccessibilityPage from "../Admin/Accessibility";
import SettingsPage from "../Admin/Settings";

import StaffDashboard from "../staff/StaffDashboard";
import StaffInventory from "../staff/StaffInventory";
import StaffStockIn from "../staff/StaffStockIn";
import StaffStockOut from "../staff/StaffStockOut";
import StaffHistory from "../staff/StaffHistory";

import AdminLayout from "../components/AdminLayout";
import StaffLayout from "../components/StaffLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import StudentDashboard from "../student/StudentDashboard";
import StudentInventory from "../student/StudentInventory";
import StudentHistory from "../student/StudentHistory";
import StudentLibrary from "../student/StudentLibrary";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <Inventory />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stock-in"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <StockIn />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stock-out"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <StockOut />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <Reports />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <Notifications />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/activity-logs"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <ActivityLogs />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/accessibility"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AccessibilityPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <SettingsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffLayout>
                <StaffDashboard />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/inventory"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffLayout>
                <StaffInventory />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/stock-in"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffLayout>
                <StaffStockIn />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/stock-out"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffLayout>
                <StaffStockOut />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/history"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffLayout>
                <StaffHistory />
              </StaffLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/inventory"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/history"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/library"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentLibrary />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
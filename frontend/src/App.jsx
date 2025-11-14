import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import ProductSearch from "./pages/ProductSearch";

import PrivateRoute from "./components/PrivateRoute";
import Toast from "./components/common/Toast";

/**
 * App layout + routing
 * Mobile-first UI with centered content on desktop.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-md px-4 py-4">
        
        {/* ROUTES */}
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/search"
            element={
              <PrivateRoute>
                <ProductSearch />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        {/* Global Toast */}
        <Toast />
      </div>
    </div>
  );
}

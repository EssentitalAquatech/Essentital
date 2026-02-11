

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// ... imports same
import SplashScreen from "./start/SplashScreen";
import LoginPage from "./start/Login";
import Signup from "./start/Signup";

import MainPage from "./MainDashboard/MainPage";
import Profile from "./MainDashboard/Profile";
import HelpCenter from "./MainDashboard/HelpCenter";
import Delears from "./MainDashboard/Delears";
import Agent from "./MainDashboard/Agent";

import Terms from "./MainDashboard/Terms";
import Privacy from "./MainDashboard/Privacy";
import Cancellation from "./MainDashboard/Cancellation";
import Refund from "./MainDashboard/Refund";

import "./i18n/i18n"; 
import AdminDashboard from "./admin/AdminDashboard";
import AdminWeather from "./admin/AdminWeather";

import DealerShop from "./pages/DealerShop";
import Cart from "./pages/Cart"; // ✅ Naya Cart component import karein
import DealerOrders from "./pages/DealerOrders";

import OrdersDashboard from "./admin/OrdersDashboard";
import AdminLogin from "./start/AdminLogin";
import Astronomical from "./admin/Astronomical_Dashboard";

import History from './pages/History';
import SatelliteDashboard from "./admin/SatelliteDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/maindashboard"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/helpcenter"
          element={
            <ProtectedRoute>
              <HelpCenter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dealers"
          element={
            <ProtectedRoute>
              <Delears />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agents"
          element={
            <ProtectedRoute>
              <Agent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dealer-shop/:dealerId"
          element={
            <ProtectedRoute>
              <DealerShop />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart/:dealerId"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dealer-orders/:dealerId?"
          element={
            <ProtectedRoute>
              <DealerOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/terms"
          element={
            <ProtectedRoute>
              <Terms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/privacy"
          element={
            <ProtectedRoute>
              <Privacy />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cancellation"
          element={
            <ProtectedRoute>
              <Cancellation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/refund"
          element={
            <ProtectedRoute>
              <Refund />
            </ProtectedRoute>
          }
        />


<Route
  path="/history/:dealerId"
  element={
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  }
/>


        {/* ADMIN (OPTIONAL PROTECTION LATER) */}
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/weather-dashboard" element={<AdminWeather />} />
        {/* <Route path="/orders-dashboard/:dealerId" element={<OrdersDashboard />} /> */}
        <Route path="/orders-dashboard" element={<OrdersDashboard />} />

        <Route path="/admin/adminDashboard" element={<AdminDashboard />} />
        <Route path="/astronomical-dashboard" element={<Astronomical />} />
        <Route path ="/satellite-dashboard"  element={<SatelliteDashboard/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

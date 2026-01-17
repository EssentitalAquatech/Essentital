

// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import SplashScreen from "./start/SplashScreen";
// import LoginPage from "./start/Login";
// import Signup from "./start/Signup";

// import MainPage from "./MainDashboard/MainPage";
// import Profile from "./MainDashboard/Profile";
// import HelpCenter from "./MainDashboard/HelpCenter";
// import Delears from "./MainDashboard/Delears";
// import Agent from "./MainDashboard/Agent";

// import Terms from "./MainDashboard/Terms";
// import Privacy from "./MainDashboard/Privacy";
// import Cancellation from "./MainDashboard/Cancellation";
// import Refund from "./MainDashboard/Refund";

// import "./i18n/i18n"; 
// import AdminDashboard from "./admin/AdminDashboard";
// import AdminWeather from "./admin/AdminWeather";

// import DealerShop from "./pages/DealerShop";
// import DealerOrders from "./pages/DealerOrders";

// import OrdersDashboard from "./admin/OrdersDashboard";

// import AdminLogin from "./start/AdminLogin";

// import Astronomical from "./admin/Astronomical_Dashboard";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<SplashScreen />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<Signup />} />

//         {/* Dashboard click pe MainPage render hoga */}
//         <Route path="/maindashboard" element={<MainPage />} />
//         <Route path="/dashboard" element={<MainPage />} />  

//         <Route path="/profile" element={<Profile />} />
//         <Route path="/helpcenter" element={<HelpCenter />} />
//         <Route path="/dealers" element={<Delears />} />
//         <Route path="/agents" element={<Agent />} />

//         <Route path="/terms" element={<Terms />} />
//         <Route path="/privacy" element={<Privacy />} />
//         <Route path="/cancellation" element={<Cancellation />} />
//         <Route path="/refund" element={<Refund />} />

//         <Route path="/adminDashboard" element={<AdminDashboard/>} />
//         <Route path="weather-dashboard" element={<AdminWeather/>} />

//         <Route path="/dealer-shop/:dealerId" element={<DealerShop />} />

//         {/* ✅ dealerId optional bana diya */}
//         {/* <Route path="/dealer-orders/:dealerId?" element={<DealerOrders />} /> */}
//         <Route path="/dealer-orders/:dealerId?" element={<DealerOrders />} />


//         {/* OrdersDashboard route */}
//         <Route path="/orders-dashboard/:dealerId" element={<OrdersDashboard />} />

//         <Route path="/admin/login" element={<AdminLogin />} />

//         <Route path="/admin/adminDashboard" element={<AdminDashboard />} />

//              <Route path="/astronomical-dashboard" element={<Astronomical />} />


          
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;





import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard click pe MainPage render hoga */}
        <Route path="/maindashboard" element={<MainPage />} />
        <Route path="/dashboard" element={<MainPage />} />  

        <Route path="/profile" element={<Profile />} />
        <Route path="/helpcenter" element={<HelpCenter />} />
        <Route path="/dealers" element={<Delears />} />
        <Route path="/agents" element={<Agent />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cancellation" element={<Cancellation />} />
        <Route path="/refund" element={<Refund />} />

        <Route path="/adminDashboard" element={<AdminDashboard/>} />
        <Route path="weather-dashboard" element={<AdminWeather/>} />

        <Route path="/dealer-shop/:dealerId" element={<DealerShop />} />
        <Route path="/cart/:dealerId" element={<Cart />} /> {/* ✅ Naya Cart route */}

        <Route path="/dealer-orders/:dealerId?" element={<DealerOrders />} />

        {/* OrdersDashboard route */}
        <Route path="/orders-dashboard/:dealerId" element={<OrdersDashboard />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/adminDashboard" element={<AdminDashboard />} />

        <Route path="/astronomical-dashboard" element={<Astronomical />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
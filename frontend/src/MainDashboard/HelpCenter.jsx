



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api, { getImageUrl } from "../utils/api";

import { Headphones, Mail, Phone, Clock, FileText, Menu, X, ShoppingBag, Home, User, HelpCircle, Users  } from "lucide-react";
import "./HelpCenter.css";

function HelpCenter() {
  const { t, i18n } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [username, setUsername] = useState("");

  // ✅ FIX: userId safely fetched
  const userId = localStorage.getItem("userId");

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isSidebarOpen && 
          !event.target.closest('.help-center-sidebar') && 
          !event.target.closest('.mobile-menu-toggle')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  // Fetch username from backend
  useEffect(() => {
    if (!userId) return;

    api
      .get(`/api/user/${userId}`)
      .then((res) => {
        const data = res.data;
        setUsername(data.name || localStorage.getItem("username") || "");
      })
      .catch((err) => {
        console.log("Backend fetch failed, fallback to localStorage", err);
        setUsername(localStorage.getItem("username") || "");
      });
  }, [userId]);

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [window.location.pathname]);

  return (
    <div className="help-center-container">
      {/* ================= MOBILE NAVBAR ================= */}
      {isMobile && (
        <div className="mobile-navbar">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="mobile-logo">
            <h3>Help Center</h3>
          </div>
          
          <div className="mobile-profile">
            <img
              src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
              alt="User"
              className="mobile-profile-pic"
              onError={(e) => {
                e.target.src = "/profile.png";
              }}
            />
          </div>
        </div>
      )}

      {/* ================= SIDEBAR ================= */}
      <div className={`help-center-sidebar ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
        <div className="sidebar-close-container">
          <div className="help-center-sidebar-section">
            <img
              src={userId ? getImageUrl(`/api/images/${userId}/profile`) : "/profile.png"}
              alt="User"
              className="profile-pic"
              onError={(e) => {
                e.target.src = "/profile.png";
              }}
            />
            <h5>{username || "User"}</h5>
          </div>

          {/* {isMobile && (
            <button 
              className="sidebar-close-btn"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )} */}
        </div>

        <ul className="help-center-menu">
          <li>
            <Link to="/profile" className="help-center-menu-btn" onClick={() => setIsSidebarOpen(false)}>
             <User size={18} />  {t("profile")}
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="help-center-menu-btn" onClick={() => setIsSidebarOpen(false)}>
              <Home size={18} />  {t("dashboard")}
            </Link>
          </li>
          <li>
            <Link to="/helpcenter" className="help-center-menu-btn active" onClick={() => setIsSidebarOpen(false)}>
               <HelpCircle size={18} /> {t("helpCenter")}
            </Link>
          </li>
          <li>
            <Link to="/dealers" className="help-center-menu-btn" onClick={() => setIsSidebarOpen(false)}>
            <ShoppingBag size={18} />  {t("dealers")}
            </Link>
          </li>
          <li>
            <Link to="/agents" className="help-center-menu-btn" onClick={() => setIsSidebarOpen(false)}>
             <Users size={18} />   {t("agents")}
            </Link>
          </li>
        </ul>

        {/* ================= LANGUAGE ================= */}
        <div className="help-center-language-section">
          <h6>{t("chooseLanguage")}</h6>
          <select
            className="help-center-language-select"
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="bn">বাংলা</option>
            <option value="as">অসমীয়া</option>
            <option value="ta">தமிழ்</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="mr">मराठी</option>
          </select>
        </div>
      </div>

      {/* ================= OVERLAY FOR MOBILE ================= */}
      {isMobile && isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ================= RIGHT CONTENT ================= */}
      <div className={`help-center-content ${isMobile ? 'mobile-view' : ''}`}>
        
        {/* HERO */}
        <div className="help-center-hero">
          <Headphones size={80} />
          <h2>{t("helpCenterTitle")}</h2>
        </div>

        {/* SUPPORT CARDS */}
        <div className="help-center-cards">
          
          {/* EMAIL SUPPORT */}
          <div className="support-card">
            <h4>
              <Mail size={20} /> {t("emailSupport")}
            </h4>
            <p>{t("emailSupportDesc")}</p>

            {/* <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=essentialaquatechindia@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="support-email-btn"
            >
              <Mail size={18} /> {t("emailUs")}
            </a> */}

<a
  href="mailto:essentialaquatechindia@gmail.com?subject=Support Request&body=Hello, I need help regarding..."
  className="support-email-btn"
>
  <Mail size={18} /> {t("emailUs")}
</a>




            <div className="support-info">
              <Clock size={16} /> {t("responseTime")}
            </div>
          </div>

          {/* PHONE SUPPORT */}
          <div className="support-card">
            <h4>
              <Phone size={20} /> {t("phoneSupport")}
            </h4>
            <p>{t("callUsDirectly")}</p>

            <a href="tel:+919046226703" className="support-phone-btn">
              <Phone size={18} /> +91 9046226703
            </a>

            <div className="support-info">
              <Clock size={16} /> {t("workHours")}
            </div>
          </div>
        </div>

        {/* LEGAL DOCUMENTS */}
        <div className="policy-links">
          <h4>{t("legalDocuments")}</h4>

          <div className="policy-links-grid">
            <Link to="/terms" className="policy-link">
              <FileText size={18} /> {t("terms")}
            </Link>

            <Link to="/privacy" className="policy-link">
              <FileText size={18} /> {t("privacy")}
            </Link>

            <Link to="/cancellation" className="policy-link">
              <FileText size={18} /> {t("cancellation")}
            </Link>

            <Link to="/refund" className="policy-link">
              <FileText size={18} /> {t("refund")}
            </Link>
          </div>
        </div>
      </div>

      {/* ================= WHATSAPP FLOATING BUTTON ================= */}
      <a 
        href="https://wa.me/15557433394?text=Chat_Support"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title="WhatsApp पर चैट करें"
      >
        <img 
          src="/WhatsApp.jpg"
          alt="WhatsApp" 
          className="whatsapp-icon"
          onError={(e) => {
            e.target.src = "https://cdn-icons-png.flaticon.com/512/220/220236.png";
          }}
        />
      </a>
    </div>
  );
}

export default HelpCenter;
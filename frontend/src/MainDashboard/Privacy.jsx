

// // Privacy.jsx
// import React from "react";
// import "./Privacy.css";

// function Privacy() {
//   return (
//     <div className="privacy-privacy-wrap">
//       <div className="privacy-privacy-card">
//         <header className="privacy-privacy-header">
//           <h1 className="privacy-privacy-title">Privacy Policy</h1>
//         </header>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">Information We Collect</h2>
//           <ul className="privacy-privacy-list">
//             <li>Personal Information (name, contact, address, payment details)</li>
//             <li>Usage data of website/app</li>
//             <li>Transaction data (order history, payment history)</li>
//             <li>Communication data (emails, messages)</li>
//           </ul>
//         </section>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">How We Use Your Information</h2>
//           <ul className="privacy-privacy-list">
//             <li>To provide and improve services</li>
//             <li>Process orders, payments & deliveries</li>
//             <li>Customer support</li>
//             <li>Send updates & promotions</li>
//             <li>Fraud prevention & legal compliance</li>
//           </ul>
//         </section>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">Data Sharing & Security</h2>
//           <ul className="privacy-privacy-list">
//             <li>No selling or renting user data</li>
//             <li>Shared only with trusted payment/logistic partners</li>
//             <li>Strong security protection</li>
//           </ul>
//         </section>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">Cookies & Tracking</h2>
//           <p>
//             We use cookies to enhance experience. You can disable cookies in browser settings.
//           </p>
//         </section>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">User Rights</h2>
//           <ul className="privacy-privacy-list">
//             <li>Access, update or delete your data anytime</li>
//             <li>Opt-out of marketing emails anytime</li>
//           </ul>
//         </section>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">Retention of Data</h2>
//           <p>Data is kept only as long as needed for operations or legal reasons.</p>
//         </section>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">Updates to Policy</h2>
//           <p>We may update this policy anytime.</p>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default Privacy;






// // Privacy.jsx
// import React from "react";
// import { useTranslation } from "react-i18next";
// import "./Privacy.css";

// function Privacy() {
//   const { t } = useTranslation();

//   return (
//     <div className="privacy-privacy-wrap">
//       <div className="privacy-privacy-card">
//         <header className="privacy-privacy-header">
//           <h1 className="privacy-privacy-title">{t('privacyPolicy')}</h1>
//         </header>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">{t('informationWeCollect')}</h2>
//           <ul className="privacy-privacy-list">
//             <li>{t('collectPersonalInfo')}</li>
//             <li>{t('collectUsageData')}</li>
//             <li>{t('collectTransactionData')}</li>
//             <li>{t('collectCommunicationData')}</li>
//           </ul>
//         </section>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">{t('howWeUseInfo')}</h2>
//           <ul className="privacy-privacy-list">
//             <li>{t('useForService')}</li>
//             <li>{t('useForProcessing')}</li>
//             <li>{t('useForSupport')}</li>
//             <li>{t('useForUpdates')}</li>
//             <li>{t('useForSecurity')}</li>
//           </ul>
//         </section>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">{t('dataSharingSecurity')}</h2>
//           <ul className="privacy-privacy-list">
//             <li>{t('noDataSelling')}</li>
//             <li>{t('dataSharingPartners')}</li>
//             <li>{t('dataSecurity')}</li>
//           </ul>
//         </section>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">{t('cookiesTracking')}</h2>
//           <p>{t('cookiesText')}</p>
//         </section>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">{t('userRights')}</h2>
//           <ul className="privacy-privacy-list">
//             <li>{t('rightAccessData')}</li>
//             <li>{t('rightOptOut')}</li>
//           </ul>
//         </section>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">{t('dataRetention')}</h2>
//           <p>{t('dataRetentionText')}</p>
//         </section>

//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">{t('policyUpdates')}</h2>
//           <p>{t('policyUpdatesText')}</p>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default Privacy;









// Privacy.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "./Privacy.css";

function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="privacy-privacy-wrap">
      <div className="privacy-privacy-card">
        {/* Header */}
        <header className="privacy-privacy-header">
          <h1 className="privacy-privacy-title">{t('privacyPolicy')}</h1>
          <p className="privacy-update-date">Last Updated: January 2024</p>
        </header>

        {/* Information We Collect */}
        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('informationWeCollect')}</h2>
          <div className="privacy-data-category">
            <h4>Personal Information</h4>
            <ul className="privacy-privacy-list">
              <li>{t('collectPersonalInfo')}</li>
            </ul>
          </div>
          
          <div className="privacy-data-category">
            <h4>Usage Data</h4>
            <ul className="privacy-privacy-list">
              <li>{t('collectUsageData')}</li>
            </ul>
          </div>
          
          <div className="privacy-data-category">
            <h4>Transaction Data</h4>
            <ul className="privacy-privacy-list">
              <li>{t('collectTransactionData')}</li>
            </ul>
          </div>
          
          <div className="privacy-data-category">
            <h4>Communication Data</h4>
            <ul className="privacy-privacy-list">
              <li>{t('collectCommunicationData')}</li>
            </ul>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('howWeUseInfo')}</h2>
          <ul className="privacy-privacy-list">
            <li>{t('useForService')}</li>
            <li>{t('useForProcessing')}</li>
            <li>{t('useForSupport')}</li>
            <li>{t('useForUpdates')}</li>
            <li>{t('useForSecurity')}</li>
          </ul>
        </section>

        {/* Data Sharing & Security */}
        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('dataSharingSecurity')}</h2>
          <ul className="privacy-privacy-list">
            <li>{t('noDataSelling')}</li>
            <li>{t('dataSharingPartners')}</li>
            <li>{t('dataSecurity')}</li>
          </ul>
        </section>

        {/* Cookies & Tracking */}
        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('cookiesTracking')}</h2>
          <p className="privacy-paragraph">{t('cookiesText')}</p>
          <div className="privacy-cookie-types">
            <p><strong>Essential Cookies:</strong> Required for basic functionality</p>
            <p><strong>Analytics Cookies:</strong> Help us improve our services</p>
            <p><strong>Marketing Cookies:</strong> Used for personalized content</p>
          </div>
        </section>

        {/* User Rights */}
        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('userRights')}</h2>
          <ul className="privacy-privacy-list">
            <li>{t('rightAccessData')}</li>
            <li>{t('rightOptOut')}</li>
            <li>{t('rightCorrection') || "Right to correct inaccurate data"}</li>
            <li>{t('rightDeletion') || "Right to request data deletion"}</li>
          </ul>
        </section>

        {/* Data Retention */}
        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('dataRetention')}</h2>
          <p className="privacy-paragraph">{t('dataRetentionText')}</p>
          <p className="privacy-note">
            <strong>Note:</strong> We retain your data only for as long as necessary 
            to fulfill the purposes outlined in this policy.
          </p>
        </section>

        {/* Policy Updates */}
        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('policyUpdates')}</h2>
          <p className="privacy-paragraph">{t('policyUpdatesText')}</p>
          <p className="privacy-notification">
            We will notify you of any significant changes via email or 
            through notifications on our platform.
          </p>
        </section>

        {/* Footer */}
        <footer className="privacy-footer-note">
          <p className="privacy-contact-text">
            {t('contactForQueries') || "For privacy-related questions, contact us at:"}
            <br />
            <a href="mailto:24x7@essentiapaquatech.com" className="privacy-email">
              24x7@essentiapaquatech.com
            </a>
          </p>
          <p className="privacy-copyright">
            © 2024 Your Company Name. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Privacy;
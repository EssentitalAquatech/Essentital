

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






// Privacy.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "./Privacy.css";

function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="privacy-privacy-wrap">
      <div className="privacy-privacy-card">
        <header className="privacy-privacy-header">
          <h1 className="privacy-privacy-title">{t('privacyPolicy')}</h1>
        </header>

        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('informationWeCollect')}</h2>
          <ul className="privacy-privacy-list">
            <li>{t('collectPersonalInfo')}</li>
            <li>{t('collectUsageData')}</li>
            <li>{t('collectTransactionData')}</li>
            <li>{t('collectCommunicationData')}</li>
          </ul>
        </section>

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

        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('dataSharingSecurity')}</h2>
          <ul className="privacy-privacy-list">
            <li>{t('noDataSelling')}</li>
            <li>{t('dataSharingPartners')}</li>
            <li>{t('dataSecurity')}</li>
          </ul>
        </section>

        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('cookiesTracking')}</h2>
          <p>{t('cookiesText')}</p>
        </section>

        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('userRights')}</h2>
          <ul className="privacy-privacy-list">
            <li>{t('rightAccessData')}</li>
            <li>{t('rightOptOut')}</li>
          </ul>
        </section>

        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('dataRetention')}</h2>
          <p>{t('dataRetentionText')}</p>
        </section>

        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('policyUpdates')}</h2>
          <p>{t('policyUpdatesText')}</p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
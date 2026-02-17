




// // Privacy.jsx
// import React from "react";
// import { useTranslation } from "react-i18next";
// import "./Privacy.css";

// function Privacy() {
//   const { t } = useTranslation();

//   return (
//     <div className="privacy-privacy-wrap">
//       <div className="privacy-privacy-card">
//         {/* Header */}
//         <header className="privacy-privacy-header">
//           <h1 className="privacy-privacy-title">{t('privacyPolicy')}</h1>
//           {/* <p className="privacy-update-date">Last Updated: January 2024</p> */}
//         </header>

//         {/* Information We Collect */}
//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">{t('informationWeCollect')}</h2>
//           <div className="privacy-data-category">
//             <h4>Personal Information</h4>
//             <ul className="privacy-privacy-list">
//               <li>{t('collectPersonalInfo')}</li>
//             </ul>
//           </div>
          
//           <div className="privacy-data-category">
//             <h4>Usage Data</h4>
//             <ul className="privacy-privacy-list">
//               <li>{t('collectUsageData')}</li>
//             </ul>
//           </div>
          
//           <div className="privacy-data-category">
//             <h4>Transaction Data</h4>
//             <ul className="privacy-privacy-list">
//               <li>{t('collectTransactionData')}</li>
//             </ul>
//           </div>
          
//           <div className="privacy-data-category">
//             <h4>Communication Data</h4>
//             <ul className="privacy-privacy-list">
//               <li>{t('collectCommunicationData')}</li>
//             </ul>
//           </div>
//         </section>

//         {/* How We Use Information */}
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

//         {/* Data Sharing & Security */}
//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">{t('dataSharingSecurity')}</h2>
//           <ul className="privacy-privacy-list">
//             <li>{t('noDataSelling')}</li>
//             <li>{t('dataSharingPartners')}</li>
//             <li>{t('dataSecurity')}</li>
//           </ul>
//         </section>

//         {/* Cookies & Tracking */}
//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">{t('cookiesTracking')}</h2>
//           <p className="privacy-paragraph">{t('cookiesText')}</p>
//           <div className="privacy-cookie-types">
//             <p><strong>Essential Cookies:</strong> Required for basic functionality</p>
//             <p><strong>Analytics Cookies:</strong> Help us improve our services</p>
//             <p><strong>Marketing Cookies:</strong> Used for personalized content</p>
//           </div>
//         </section>

//         {/* User Rights */}
//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">{t('userRights')}</h2>
//           <ul className="privacy-privacy-list">
//             <li>{t('rightAccessData')}</li>
//             <li>{t('rightOptOut')}</li>
//             <li>{t('rightCorrection') || "Right to correct inaccurate data"}</li>
//             <li>{t('rightDeletion') || "Right to request data deletion"}</li>
//           </ul>
//         </section>

//         {/* Data Retention */}
//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">{t('dataRetention')}</h2>
//           <p className="privacy-paragraph">{t('dataRetentionText')}</p>
//           <p className="privacy-note">
//             <strong>Note:</strong> We retain your data only for as long as necessary 
//             to fulfill the purposes outlined in this policy.
//           </p>
//         </section>

//         {/* Policy Updates */}
//         <section className="privacy-privacy-section">
//           <h2 className="privacy-privacy-subtitle">{t('policyUpdates')}</h2>
//           <p className="privacy-paragraph">{t('policyUpdatesText')}</p>
//           <p className="privacy-notification">
//             We will notify you of any significant changes via email or 
//             through notifications on our platform.
//           </p>
//         </section>

       
// <footer className="privacy-footer-note">
//   <p className="privacy-contact-text">
//     {t("contactForQueries")}
//     <strong className="privacy-email">
//       24x7@essentialaquatech.com
//     </strong>
//   </p>

//   <p className="privacy-copyright">
//     Copyright © 2024 Essential Aquatech P.V.T L.T.D
//   </p>
// </footer>



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
          {/* <p className="privacy-update-date">Last Updated: January 2024</p> */}
        </header>

        {/* Information We Collect */}
        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('informationWeCollect')}</h2>
          <div className="privacy-data-category">
            {/* Use the new key for "Personal Information" */}
            <h4>{t('personalInformation')}</h4>
            <ul className="privacy-privacy-list">
              <li>{t('collectPersonalInfo')}</li>
            </ul>
          </div>
          
          <div className="privacy-data-category">
            {/* Use the new key for "Usage Data" */}
            <h4>{t('usageData')}</h4>
            <ul className="privacy-privacy-list">
              <li>{t('collectUsageData')}</li>
            </ul>
          </div>
          
          <div className="privacy-data-category">
            {/* Use the new key for "Transaction Data" */}
            <h4>{t('transactionData')}</h4>
            <ul className="privacy-privacy-list">
              <li>{t('collectTransactionData')}</li>
            </ul>
          </div>
          
          <div className="privacy-data-category">
            {/* Use the new key for "Communication Data" */}
            <h4>{t('communicationData')}</h4>
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
            {/* Use translation keys for cookie descriptions */}
            <p><strong>{t('essentialCookies')}</strong> {t('essentialCookiesDesc')}</p>
            <p><strong>{t('analyticsCookies')}</strong> {t('analyticsCookiesDesc')}</p>
            <p><strong>{t('marketingCookies')}</strong> {t('marketingCookiesDesc')}</p>
          </div>
        </section>

        {/* User Rights */}
        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('userRights')}</h2>
          <ul className="privacy-privacy-list">
            <li>{t('rightAccessData')}</li>
            <li>{t('rightOptOut')}</li>
            {/* Use the translation keys directly */}
            <li>{t('rightCorrection')}</li>
            <li>{t('rightDeletion')}</li>
          </ul>
        </section>

        {/* Data Retention */}
        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('dataRetention')}</h2>
          <p className="privacy-paragraph">{t('dataRetentionText')}</p>
          <p className="privacy-note">
            {/* Consider making this note translatable as well */}
            <strong>Note:</strong> {t('dataRetentionNote') || "We retain your data only for as long as necessary to fulfill the purposes outlined in this policy."}
          </p>
        </section>

        {/* Policy Updates */}
        <section className="privacy-privacy-section">
          <h2 className="privacy-privacy-subtitle">{t('policyUpdates')}</h2>
          <p className="privacy-paragraph">{t('policyUpdatesText')}</p>
          <p className="privacy-notification">
            {/* Use the new translation key for the notification sentence */}
            {t('policyChangeNotification')}
          </p>
        </section>

       
        <footer className="privacy-footer-note">
          <p className="privacy-contact-text">
            {t("contactForQueries")}
            <strong className="privacy-email">
              24x7@essentialaquatech.com
            </strong>
          </p>

          <p className="privacy-copyright">
            {t('copyright', { year: 2024, company: 'Essential Aquatech P.V.T L.T.D' })}
          </p>
        </footer>

      </div>
    </div>
  );
}

export default Privacy;
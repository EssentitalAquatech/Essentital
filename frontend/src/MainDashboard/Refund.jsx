






// // Refund.jsx
// import React from "react";
// import { useTranslation } from "react-i18next";
// import "./Refund.css";

// function Refund() {
//   const { t } = useTranslation();

//   return (
//     <div className="refund-refund-wrap">
//       <div className="refund-refund-card">
//         <header className="refund-refund-header">
//           <h1 className="refund-refund-title">{t('refundPolicy')}</h1>
//         </header>

//         <section className="refund-refund-section">
//           <h2 className="refund-refund-subtitle">{t('refundAvailable')}</h2>
//           <ul className="refund-refund-list">
//             <li>{t('refundDamaged')}</li>
//             <li>{t('refundWrongProduct')}</li>
//             <li>{t('refundStockIssue')}</li>
//             <li>{t('refundServiceIssue')}</li>
//           </ul>
//         </section>

//         <section className="refund-refund-section">
//           <h2 className="refund-refund-subtitle">{t('nonRefundable')}</h2>
//           <ul className="refund-refund-list">
//             <li>{t('nonRefundableUsed')}</li>
//             <li>{t('nonRefundableDigital')}</li>
//             <li>{t('nonRefundableCustom')}</li>
//           </ul>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default Refund;




// Refund.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "./Refund.css";

function Refund() {
  const { t } = useTranslation();

  return (
    <div className="refund-refund-wrap">
      <div className="refund-refund-card">
        {/* Header */}
        <header className="refund-refund-header">
          <h1 className="refund-refund-title">{t('refundPolicy') || "Refund Policy"}</h1>
          <p className="refund-update-date">Effective Date: January 2024</p>
        </header>

        {/* Refund Available Section */}
        <section className="refund-refund-section">
          <h2 className="refund-refund-subtitle">{t('refundAvailable') || "Refund Available"}</h2>
          <ul className="refund-refund-list">
            <li>{t('refundDamaged') || "Damaged or defective products"}</li>
            <li>{t('refundWrongProduct') || "Wrong product delivered"}</li>
            <li>{t('refundStockIssue') || "Stock unavailability"}</li>
            <li>{t('refundServiceIssue') || "Service not provided as promised"}</li>
          </ul>
        </section>

        {/* Non-Refundable Section */}
        <section className="refund-refund-section">
          <h2 className="refund-refund-subtitle">{t('nonRefundable') || "Non-Refundable"}</h2>
          <ul className="refund-refund-list">
            <li>{t('nonRefundableUsed') || "Used or opened products"}</li>
            <li>{t('nonRefundableDigital') || "Digital products after download"}</li>
            <li>{t('nonRefundableCustom') || "Custom or personalized items"}</li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="refund-footer">
          <p>For refund requests, contact: support@company.com</p>
          <p>© 2024 Company Name. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Refund;
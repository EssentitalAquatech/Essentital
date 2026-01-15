

// // Cancellation.jsx
// import React from "react";
// import "./Cancellation.css";

// function Cancellation() {
//   return (
//     <div className="cancel-cancel-wrap">
//       <div className="cancel-cancel-card">
//         <header className="cancel-cancel-header">
//           <h1 className="cancel-cancel-title">Cancellation Policy</h1>
//         </header>

//         <section className="cancel-cancel-section">
//           <ul className="cancel-cancel-list">
//             <li>Orders can be cancelled within 24 hours if not shipped.</li>
//             <li>Contact support via email or phone for cancellation.</li>
//             <li>Shipped orders cannot be cancelled.</li>
//           </ul>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default Cancellation;





// // Cancellation.jsx
// import React from "react";
// import { useTranslation } from "react-i18next";
// import "./Cancellation.css";

// function Cancellation() {
//   const { t } = useTranslation();

//   return (
//     <div className="cancel-cancel-wrap">
//       <div className="cancel-cancel-card">
//         <header className="cancel-cancel-header">
//           <h1 className="cancel-cancel-title">{t('cancellationPolicy')}</h1>
//         </header>

//         <section className="cancel-cancel-section">
//           <ul className="cancel-cancel-list">
//             <li>{t('cancellationWindow')}</li>
//             <li>{t('cancellationContact')}</li>
//             <li>{t('noCancellationShipped')}</li>
//           </ul>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default Cancellation;






// Cancellation.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "./Cancellation.css";

function Cancellation() {
  const { t } = useTranslation();

  return (
    <div className="cancel-cancel-wrap">
      <div className="cancel-cancel-card">
        {/* Header */}
        <header className="cancel-cancel-header">
          <h1 className="cancel-cancel-title">{t('cancellationPolicy')}</h1>
          <p className="cancel-update-date">Effective Date: January 2024</p>
        </header>

        {/* Main Policy Section */}
        <section className="cancel-cancel-section">
          <ul className="cancel-cancel-list">
            <li>
              <strong>Cancellation Window:</strong> {t('cancellationWindow') || 
              "Orders can be cancelled within 24 hours of placement. After this period, cancellations may not be possible."}
            </li>
            <li>
              <strong>How to Cancel:</strong> {t('cancellationContact') || 
              "To cancel an order, please contact our customer support team via email or phone. Provide your order number and details."}
            </li>
            <li>
              <strong>Shipped Orders:</strong> {t('noCancellationShipped') || 
              "Once an order has been shipped, it cannot be cancelled. You may return the item according to our return policy."}
            </li>
          </ul>

          {/* Refund Information */}
          <div className="cancel-refund-info">
            <h3>📋 Refund Information</h3>
            <p>If your cancellation is accepted:</p>
            <ul>
              <li>Refunds are processed within 5-7 business days</li>
              <li>The refund will be issued to your original payment method</li>
              <li>Processing fees may not be refundable</li>
            </ul>
          </div>

          {/* Important Note */}
          <div className="cancel-important-note">
            <h3>⚠️ Important Notice</h3>
            <p>
              Customized or personalized items cannot be cancelled once production has begun. 
              Digital products and services are non-refundable unless specified.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <footer className="cancel-contact-info">
          <p className="cancel-contact-text">
            For cancellation requests or questions:
          </p>
          <a href="mailto:support@company.com" className="cancel-email">
            support@company.com
          </a>
          <p className="cancel-copyright">
            © 2024 Your Company Name. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Cancellation;
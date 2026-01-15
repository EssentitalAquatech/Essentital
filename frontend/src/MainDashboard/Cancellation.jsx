

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









// Cancellation.jsx - Simple Version
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
          <h1 className="cancel-cancel-title">{t('cancellationPolicy') || "Cancellation Policy"}</h1>
          <p className="cancel-update-date">Effective Date: January 2024</p>
        </header>

        {/* Main Policy Section */}
        <section className="cancel-cancel-section">
          <ul className="cancel-cancel-list">
            <li>
              <strong>Order Cancellation:</strong> 
              Orders can be cancelled within 24 hours of placement, provided they have not been processed or shipped.
            </li>
            <li>
              <strong>How to Cancel:</strong> 
              To cancel an order, customer must contact our support team via customer support, email and phone.
            </li>
            <li>
              <strong>Shipped Orders:</strong> 
              Once an order has been shipped it cannot be canceled.
            </li>
          </ul>

          {/* Contact Information */}
          <div className="cancel-contact-info">
            <p className="cancel-contact-text">
              For cancellation requests, contact us at:
            </p>
            <a href="mailto:24x7@essentiapaquatech.com" className="cancel-email">
              24x7@essentiapaquatech.com
            </a>
            <p className="cancel-copyright">
              © 2024 Company Name. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Cancellation;
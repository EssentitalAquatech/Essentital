




// // Terms.jsx
// import React from "react";
// import { useTranslation } from "react-i18next";
// import "./Terms.css";

// function Terms() {
//   const { t } = useTranslation();

//   return (
//     <div className="terms-outer-wrap">
//       <div className="terms-main-wrap">
//         <div className="terms-content-card">
//           <header className="terms-main-header">
//             <h1 className="terms-main-title">{t('termsAndConditions')}</h1>
//           </header>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">{t('definitions')}</h2>
//             <p><strong>{t('company')}</strong> {t('companyDefinition')}</p>
//             <p><strong>{t('user')}</strong> {t('userDefinition')}</p>
//             <p>
//               <strong>{t('services')}</strong> {t('servicesDefinition')}
//             </p>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">{t('userResponsibility')}</h2>
//             <ul className="terms-ul-list">
//               <li>{t('userResponsibility1')}</li>
//               <li>{t('userResponsibility2')}</li>
//               <li>{t('userResponsibility3')}</li>
//               <li>{t('userResponsibility4')}</li>
//             </ul>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">{t('ordersPaymentsRefunds')}</h2>
//             <ul className="terms-ul-list">
//               <li>{t('orderRequirement')}</li>
//               <li>{t('paymentRequirement')}</li>
//               <li>{t('refundCondition')}</li>
//               <li>{t('refundTimeframe')}</li>
//               <li>{t('priceVariation')}</li>
//             </ul>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">{t('serviceAvailability')}</h2>
//             <ul className="terms-ul-list">
//               <li>{t('serviceAvailability1')}</li>
//               <li>{t('serviceAvailability2')}</li>
//             </ul>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">{t('liabilityLimitation')}</h2>
//             <p>{t('liabilityLimitationText')}</p>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">{t('intellectualProperty')}</h2>
//             <p>{t('intellectualPropertyText')}</p>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">{t('privacyDataProtection')}</h2>
//             <p>{t('privacyDataProtectionText')}</p>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">{t('serviceTermination')}</h2>
//             <p>{t('serviceTerminationText')}</p>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">{t('governingLawDisputes')}</h2>
//             <p>{t('governingLawText')}</p>
//             <p>{t('disputeResolution')}</p>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">{t('termsChanges')}</h2>
//             <p>{t('termsChangesText')}</p>
//           </section>

//           <footer className="terms-content-footer">
//             <p>
//               {t('contactForQueries')} <strong>{t('companyEmail')}</strong>
//             </p>
//           </footer>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Terms;



// Terms.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "./Terms.css";

function Terms() {
  const { t } = useTranslation();

  return (
    <div className="terms-outer-wrap">
      <div className="terms-main-wrap">
        <div className="terms-content-card">
          {/* Header */}
          <header className="terms-main-header">
            <h1 className="terms-main-title">{t('termsAndConditions')}</h1>
            <p className="terms-update-date">Last Updated: January 2024</p>
          </header>

          {/* Definitions Section */}
          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('definitions')}</h2>
            <div className="terms-definition-group">
              <p className="terms-definition-item">
                <strong className="terms-definition-term">{t('company')}</strong>
                <span className="terms-definition-text">{t('companyDefinition')}</span>
              </p>
              <p className="terms-definition-item">
                <strong className="terms-definition-term">{t('user')}</strong>
                <span className="terms-definition-text">{t('userDefinition')}</span>
              </p>
              <p className="terms-definition-item">
                <strong className="terms-definition-term">{t('services')}</strong>
                <span className="terms-definition-text">{t('servicesDefinition')}</span>
              </p>
            </div>
          </section>

          {/* User Responsibility Section */}
          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('userResponsibility')}</h2>
            <ul className="terms-ul-list">
              <li className="terms-list-item">{t('userResponsibility1')}</li>
              <li className="terms-list-item">{t('userResponsibility2')}</li>
              <li className="terms-list-item">{t('userResponsibility3')}</li>
              <li className="terms-list-item">{t('userResponsibility4')}</li>
            </ul>
          </section>

          {/* Orders, Payments & Refunds Section */}
          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('ordersPaymentsRefunds')}</h2>
            <ul className="terms-ul-list">
              <li className="terms-list-item">{t('orderRequirement')}</li>
              <li className="terms-list-item">{t('paymentRequirement')}</li>
              <li className="terms-list-item">{t('refundCondition')}</li>
              <li className="terms-list-item">{t('refundTimeframe')}</li>
              <li className="terms-list-item">{t('priceVariation')}</li>
            </ul>
          </section>

          {/* Service Availability Section */}
          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('serviceAvailability')}</h2>
            <ul className="terms-ul-list">
              <li className="terms-list-item">{t('serviceAvailability1')}</li>
              <li className="terms-list-item">{t('serviceAvailability2')}</li>
            </ul>
          </section>

          {/* Liability Limitation Section */}
          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('liabilityLimitation')}</h2>
            <p className="terms-paragraph">{t('liabilityLimitationText')}</p>
          </section>

          {/* Intellectual Property Section */}
          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('intellectualProperty')}</h2>
            <p className="terms-paragraph">{t('intellectualPropertyText')}</p>
          </section>

          {/* Privacy & Data Protection Section */}
          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('privacyDataProtection')}</h2>
            <p className="terms-paragraph">{t('privacyDataProtectionText')}</p>
          </section>

          {/* Service Termination Section */}
          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('serviceTermination')}</h2>
            <p className="terms-paragraph">{t('serviceTerminationText')}</p>
          </section>

          {/* Governing Law & Disputes Section */}
          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('governingLawDisputes')}</h2>
            <div className="terms-paragraph-group">
              <p className="terms-paragraph">{t('governingLawText')}</p>
              <p className="terms-paragraph">{t('disputeResolution')}</p>
            </div>
          </section>

          {/* Terms Changes Section */}
          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('termsChanges')}</h2>
            <p className="terms-paragraph">{t('termsChangesText')}</p>
          </section>

          {/* Footer */}
          {/* <footer className="terms-content-footer">
            <p className="terms-contact-text">
              {t('contactForQueries')} 
              <strong className="terms-email">{t('companyEmail')}</strong>
            </p>
            <p className="terms-copyright">
              © 2024 Your Company Name. All rights reserved.
            </p>
          </footer> */}

<footer className="terms-content-footer">
  <p className="terms-contact-text">
    {t('contactForQueries')} 
    <strong className="terms-email">
      24x7@essentiapaquatech.com
    </strong>
  </p>
  <p className="terms-copyright">
    © 2024 Essentia Paquatech. All rights reserved.
  </p>
</footer>


        </div>
      </div>
    </div>
  );
}

export default Terms;
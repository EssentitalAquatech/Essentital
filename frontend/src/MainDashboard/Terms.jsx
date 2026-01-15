


// // Terms.jsx
// import React from "react";
// import "./Terms.css";

// function Terms() {
//   return (
//     <div className="terms-outer-wrap">
//       <div className="terms-main-wrap">
//         <div className="terms-content-card">
//           <header className="terms-main-header">
//             <h1 className="terms-main-title">Terms &amp; Conditions</h1>
//           </header>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">Definitions</h2>
//             <p><strong>“Company”</strong> refers to Essential Aquatech.</p>
//             <p><strong>“User”</strong> refers to anyone using our services.</p>
//             <p>
//               <strong>“Services”</strong> include fish medicines, feed supplements,
//               fingerlings, market connections, technical support and field services.
//             </p>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">Responsibility of Users</h2>
//             <ul className="terms-ul-list">
//               <li>Users must provide accurate information.</li>
//               <li>Users are responsible for keeping login details safe.</li>
//               <li>Users must follow all relevant laws.</li>
//               <li>Users should implement our products as directed.</li>
//             </ul>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">Orders, Payments &amp; Refunds</h2>
//             <ul className="terms-ul-list">
//               <li>Orders must be placed from the official website.</li>
//               <li>Payments must be through official channels.</li>
//               <li>Refunds only for damaged or defective products.</li>
//               <li>Refunds must be requested within 7 days.</li>
//               <li>Prices may vary anytime.</li>
//             </ul>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">Availability of services</h2>
//             <ul className="terms-ul-list">
//               <li>We aim to keep services always available.</li>
//               <li>We are not responsible for delays due to unexpected situations.</li>
//             </ul>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">Limitation of Liability</h2>
//             <p>
//               We are not responsible for losses or damages resulting from use of our
//               products or services.
//             </p>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">Intellectual Property</h2>
//             <p>
//               The brand name, logo and content belong to Essential Aquatech.
//               Unauthorized use or sharing is prohibited.
//             </p>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">Privacy and Data Protection</h2>
//             <p>
//               We respect user privacy and protect data. Information will not be shared
//               without permission.
//             </p>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">Service Termination</h2>
//             <p>
//               We may suspend services if terms are violated. Users may request account
//               closure.
//             </p>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">Governing Law &amp; Disputes</h2>
//             <p>All terms follow applicable jurisdiction laws.</p>
//             <p>Any disputes will be settled through arbitration or legal action.</p>
//           </section>

//           <section className="terms-content-section">
//             <h2 className="terms-section-subtitle">Changes to Terms</h2>
//             <p>We may update terms anytime. Continued use means acceptance.</p>
//           </section>

//           <footer className="terms-content-footer">
//             <p>
//               For queries, contact us at: <strong>3ai.essentialaquatech@gmail.com</strong>
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
          <header className="terms-main-header">
            <h1 className="terms-main-title">{t('termsAndConditions')}</h1>
          </header>

          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('definitions')}</h2>
            <p><strong>{t('company')}</strong> {t('companyDefinition')}</p>
            <p><strong>{t('user')}</strong> {t('userDefinition')}</p>
            <p>
              <strong>{t('services')}</strong> {t('servicesDefinition')}
            </p>
          </section>

          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('userResponsibility')}</h2>
            <ul className="terms-ul-list">
              <li>{t('userResponsibility1')}</li>
              <li>{t('userResponsibility2')}</li>
              <li>{t('userResponsibility3')}</li>
              <li>{t('userResponsibility4')}</li>
            </ul>
          </section>

          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('ordersPaymentsRefunds')}</h2>
            <ul className="terms-ul-list">
              <li>{t('orderRequirement')}</li>
              <li>{t('paymentRequirement')}</li>
              <li>{t('refundCondition')}</li>
              <li>{t('refundTimeframe')}</li>
              <li>{t('priceVariation')}</li>
            </ul>
          </section>

          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('serviceAvailability')}</h2>
            <ul className="terms-ul-list">
              <li>{t('serviceAvailability1')}</li>
              <li>{t('serviceAvailability2')}</li>
            </ul>
          </section>

          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('liabilityLimitation')}</h2>
            <p>{t('liabilityLimitationText')}</p>
          </section>

          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('intellectualProperty')}</h2>
            <p>{t('intellectualPropertyText')}</p>
          </section>

          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('privacyDataProtection')}</h2>
            <p>{t('privacyDataProtectionText')}</p>
          </section>

          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('serviceTermination')}</h2>
            <p>{t('serviceTerminationText')}</p>
          </section>

          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('governingLawDisputes')}</h2>
            <p>{t('governingLawText')}</p>
            <p>{t('disputeResolution')}</p>
          </section>

          <section className="terms-content-section">
            <h2 className="terms-section-subtitle">{t('termsChanges')}</h2>
            <p>{t('termsChangesText')}</p>
          </section>

          <footer className="terms-content-footer">
            <p>
              {t('contactForQueries')} <strong>{t('companyEmail')}</strong>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Terms;
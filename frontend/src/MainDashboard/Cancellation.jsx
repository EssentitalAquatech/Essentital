

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





// Cancellation.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "./Cancellation.css";

function Cancellation() {
  const { t } = useTranslation();

  return (
    <div className="cancel-cancel-wrap">
      <div className="cancel-cancel-card">
        <header className="cancel-cancel-header">
          <h1 className="cancel-cancel-title">{t('cancellationPolicy')}</h1>
        </header>

        <section className="cancel-cancel-section">
          <ul className="cancel-cancel-list">
            <li>{t('cancellationWindow')}</li>
            <li>{t('cancellationContact')}</li>
            <li>{t('noCancellationShipped')}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Cancellation;
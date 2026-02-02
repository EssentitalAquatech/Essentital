// import React from "react";

// function Astronomical() {
//   return (
//     <div style={{ width: "100%", height: "100vh" }}>
//       <iframe
//         src="https://essentialaquatechastrodashboard.netlify.app/"
//         title="Astronomical Dashboard"
//         style={{
//           width: "100%",
//           height: "100%",
//           border: "none",
//         }}
//       />
//     </div>
//   );
// }

// export default Astronomical;



// import React from "react";

// function Astronomical() {
//   return (
//     <div style={{ width: "100%", height: "100vh" }}>
//       <iframe
//         src="https://d2vy9m5vkf9fe2.cloudfront.net/"
//         title="Astronomical Dashboard"
//         style={{
//           width: "100%",
//           height: "100%",
//           border: "none",
//         }}
//       />
//     </div>
//   );
// }

// export default Astronomical;
















import React from "react";

function Astronomical() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        // src="https://d2vy9m5vkf9fe2.cloudfront.net/"
         src="https://essentialaquatechastrodashboard.netlify.app/"
        title="Astronomical Dashboard"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allow="geolocation"
        allowFullScreen
      />
    </div>
  );
}

export default Astronomical;

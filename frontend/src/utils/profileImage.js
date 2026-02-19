// import { getImageUrl } from "./api";

// export const getProfileImage = (userId) => {
//   const timestamp = localStorage.getItem("photoUpdateTime") || Date.now();
//   return userId
//     ? `${getImageUrl(userId, "profile")}?t=${timestamp}`
//     : "/profile.png";
// };





import { getImageUrl } from "./api";

export const getProfileImage = (userId) => {
  if (!userId) return "/profile.png";
  
  const timestamp = localStorage.getItem("photoUpdateTime") || Date.now();
  
  // ✅ DIRECTLY CONSTRUCT THE URL - YEH SAHI TARIKA HAI
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2008";
  return `${API_URL}/api/images/${userId}/profile?t=${timestamp}`;
};
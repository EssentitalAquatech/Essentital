import { getImageUrl } from "./api";

export const getProfileImage = (userId) => {
  const timestamp = localStorage.getItem("photoUpdateTime") || Date.now();
  return userId
    ? `${getImageUrl(userId, "profile")}?t=${timestamp}`
    : "/profile.png";
};

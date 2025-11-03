export const isTokenValid = () => {
  const token = localStorage.getItem("adminToken"); 
  console.log("🔍 Checking token:", token);

  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    const valid = payload.exp && payload.exp > now;

    console.log("📅 Token valid:", valid);
    return valid;
  } catch (err) {
    console.error("❌ Invalid token:", err);
    return false;
  }
};

export const checkAuthAndHospital = () => {
  console.log("⚙️ Checking auth and hospital...");
  if (!isTokenValid()) {
    console.log("🚫 Token invalid — redirecting to /login");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("hospitalId");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isHospitalLoggedIn");
    localStorage.removeItem("adminName");
    localStorage.removeItem("role");
    return { redirect: "/login" };
  }

  const hospitalId = localStorage.getItem("hospitalId");
  console.log("🏥 Hospital ID found:", hospitalId);

  if (hospitalId) {
    console.log("➡️ Redirecting to /hospital (HospitalLayout)");
    return { redirect: "/hospital" };
  }

  console.log("➡️ Redirecting to /hospital-login");
  return { redirect: "/hospital-login" };
};

// Test OTP generation with the actual JWT token from the logs

function generateOTP(token: string): string {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash << 5) - hash + token.charCodeAt(i);
    hash = hash & hash;
  }
  const otp = Math.abs(hash % 1000000)
    .toString()
    .padStart(6, "0");
  return otp;
}

// The actual token from your log
const actualToken = "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRoYXJ1c2hhZGVudXdhbjM1QGdtYWlsLmNvbSIsImlhdCI6MTc2Nzg3MTY3NSwiZXhwIjoxNzY3ODcyNTc1fQ.4oetEQxHiFgdyumoeVtwGqLabqMFpJjNH-jbU-C4t2c";

const otp = generateOTP(actualToken);

console.log("Token:", actualToken);
console.log("Generated OTP:", otp);
console.log("Expected OTP: 852435");
console.log("Match:", otp === "852435" ? "✅" : "❌");

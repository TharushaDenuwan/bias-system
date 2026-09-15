// Test OTP generation consistency

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

// Test with sample tokens
const testToken1 = "abc123def456";
const testToken2 = "xyz789uvw012";

console.log("Testing OTP generation consistency:\n");

// Test 1: Same token should produce same OTP
const otp1a = generateOTP(testToken1);
const otp1b = generateOTP(testToken1);
console.log(`Token: ${testToken1}`);
console.log(`  OTP (1st call): ${otp1a}`);
console.log(`  OTP (2nd call): ${otp1b}`);
console.log(`  Consistent: ${otp1a === otp1b ? "✅" : "❌"}\n`);

// Test 2: Different tokens should produce different OTPs
const otp2 = generateOTP(testToken2);
console.log(`Token: ${testToken2}`);
console.log(`  OTP: ${otp2}`);
console.log(`  Different from first: ${otp1a !== otp2 ? "✅" : "❌"}\n`);

// Test 3: Real-world example
const realToken = "e8f9a7b6c5d4e3f2a1b0c9d8e7f6a5b4";
const realOTP = generateOTP(realToken);
console.log(`Real token example: ${realToken}`);
console.log(`  Generated OTP: ${realOTP}`);
console.log(`  OTP length: ${realOTP.length} (should be 6)`);

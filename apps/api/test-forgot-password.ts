import { emailService } from "./src/lib/email";

/**
 * Test script for forgot password email functionality
 * This script tests the password reset email service
 */
async function testForgotPasswordEmail() {
  console.log("🧪 Testing Forgot Password Email Service\n");
  console.log("=" .repeat(60));

  // Test email - replace with a real email address you have access to
  const testEmail = "your-test-email@example.com";
  
  // Generate a test reset URL and token
  const testToken = "test-reset-token-123456";
  const resetUrl = `http://localhost:3000/reset-password?token=${testToken}`;

  console.log("\n📧 Test Configuration:");
  console.log(`   Email: ${testEmail}`);
  console.log(`   Reset URL: ${resetUrl}`);
  console.log(`   SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`   SMTP Port: ${process.env.SMTP_PORT}`);
  console.log(`   SMTP User: ${process.env.SMTP_USER}`);
  console.log(`   Email From: ${process.env.EMAIL_FROM}`);

  try {
    console.log("\n📨 Sending password reset email...");
    
    await emailService.sendPasswordResetEmail(testEmail, resetUrl, testToken);
    
    console.log("\n✅ SUCCESS!");
    console.log("=" .repeat(60));
    console.log("Password reset email sent successfully!");
    console.log(`Check the inbox of: ${testEmail}`);
    console.log("\nThe email should contain:");
    console.log("  - A 'Reset Password' button");
    console.log("  - The reset URL link");
    console.log("  - Expiration notice (1 hour)");
    console.log("=" .repeat(60));
  } catch (error) {
    console.error("\n❌ FAILED!");
    console.error("=" .repeat(60));
    console.error("Error details:", error);
    
    if (error instanceof Error) {
      console.error("\nError message:", error.message);
      
      // Provide helpful debugging tips
      console.error("\n💡 Troubleshooting Tips:");
      
      if (error.message.includes("SMTP")) {
        console.error("  - Verify SMTP credentials in .env file");
        console.error("  - Check that SMTP_HOST and SMTP_PORT are correct");
        console.error("  - Ensure SMTP_USER and SMTP_PASS are valid");
      }
      
      if (error.message.includes("authentication")) {
        console.error("  - Double-check your SMTP password");
        console.error("  - Verify your SMTP username is correct");
        console.error("  - Check if your email provider requires app-specific passwords");
      }
      
      if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
        console.error("  - Check your internet connection");
        console.error("  - Verify firewall isn't blocking port 587");
        console.error("  - Try using a different network");
      }
    }
    
    console.error("=" .repeat(60));
    process.exit(1);
  }
}

// Run the test
console.log("\n🚀 Starting Forgot Password Email Test");
console.log("Make sure to update the testEmail variable before running!\n");

testForgotPasswordEmail().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});

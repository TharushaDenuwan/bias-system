import nodemailer from "nodemailer";

async function testSMTP() {
  console.log("Testing SMTP Configuration...\n");

  const config = {
    host: process.env.SMTP_HOST || "smtp.titan.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM,
  };

  console.log("Configuration:");
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  User: ${config.user}`);
  console.log(`  From: ${config.from}`);
  console.log(`  Pass: ${config.pass ? "[HIDDEN]" : "[NOT SET]"}\n`);

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: false,
    requireTLS: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    debug: true, // Enable debug output
    logger: true, // Log to console
  });

  try {
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully!\n");

    // Try sending a test email
    console.log("Sending test email...");
    const info = await transporter.sendMail({
      from: config.from,
      to: config.user, // Send to self
      subject: "SMTP Test Email",
      text: "This is a test email to verify SMTP configuration.",
      html: "<p>This is a test email to verify SMTP configuration.</p>",
    });

    console.log("✅ Test email sent successfully!");
    console.log(`Message ID: ${info.messageId}`);
  } catch (error) {
    console.error("❌ SMTP test failed:");
    console.error(error);

    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        console.log("\n💡 Troubleshooting tips:");
        console.log("  - Check if the SMTP host is correct");
        console.log(
          "  - Verify the port number (587 for STARTTLS, 465 for SSL)"
        );
        console.log("  - Check if your firewall is blocking the connection");
        console.log("  - Try using a different network or VPN");
      } else if (error.message.includes("EAUTH")) {
        console.log("\n💡 Troubleshooting tips:");
        console.log("  - Verify your SMTP username and password");
        console.log(
          "  - Check if special characters in password need escaping"
        );
        console.log("  - Ensure your email account allows SMTP access");
      }
    }
  }
}

testSMTP();

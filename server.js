const express = require("express");
require("dotenv").config();
const nodemailer = require("nodemailer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const loadLinkTemplate = (verificationLink, appName) => {
  const htmlFilePath = path.join(
    __dirname,
    "./templates/email-link-verification.html"
  );
  if (!fs.existsSync(htmlFilePath)) {
    throw new Error("Email template file not found");
  }
  let htmlTemplate = fs.readFileSync(htmlFilePath, "utf8");
  htmlTemplate = htmlTemplate.replace(/{{app_name}}/g, appName);
  htmlTemplate = htmlTemplate.replace(
    /{{verification_link}}/g,
    verificationLink
  );
  return htmlTemplate;
};
const loadCodeTemplate = (verificationCode, appName) => {
  const htmlFilePath = path.join(
    __dirname,
    "./templates/email-code-verifiacation.html"
  );
  if (!fs.existsSync(htmlFilePath)) {
    throw new Error("Email template file not found");
  }
  let htmlTemplate = fs.readFileSync(htmlFilePath, "utf8");
  htmlTemplate = htmlTemplate.replace(/{{app_name}}/g, appName);
  htmlTemplate = htmlTemplate.replace(
    /{{verification_code}}/g,
    verificationCode
  );
  return htmlTemplate;
};
const loadForgetPasswordLinkTemplate = (forgetPasswordLink, appName) => {
  const htmlFilePath = path.join(
    __dirname,
    "./templates/email-link-forget-password.html"
  );
  if (!fs.existsSync(htmlFilePath)) {
    throw new Error("Email template file not found");
  }
  let htmlTemplate = fs.readFileSync(htmlFilePath, "utf8");
  htmlTemplate = htmlTemplate.replace(/{{app_name}}/g, appName);
  htmlTemplate = htmlTemplate.replace(
    /{{forget_password_link}}/g,
    forgetPasswordLink
  );
  return htmlTemplate;
};

const loadForgetPasswordCodeTemplate = (forgetPasswordCode, appName) => {
  const htmlFilePath = path.join(
    __dirname,
    "./templates/forget-password-code.html"
  );
  if (!fs.existsSync(htmlFilePath)) {
    throw new Error("Email template file not found");
  }
  let htmlTemplate = fs.readFileSync(htmlFilePath, "utf8");
  htmlTemplate = htmlTemplate.replace(/{{app_name}}/g, appName);
  htmlTemplate = htmlTemplate.replace(
    /{{forget_password_code}}/g,
    forgetPasswordCode
  );
  return htmlTemplate;
};

const sendVerificationLink = async (req, res) => {
  const { email, verificationLink, appName } = req.body;
  const mailOptions = {
    from: process.env.OUTLOOK_EMAIL,
    to: email,
    subject: "Verify Your Email Address",
    html: loadLinkTemplate(verificationLink, appName),
  };
  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: `Email successfully sent to: ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.error(`Error sending email: ${error.message}`);
  }
};
const sendVerificationCode = async (req, res) => {
  const { email, verificationCode, appName } = req.body;
  const mailOptions = {
    from: process.env.OUTLOOK_EMAIL,
    to: email,
    subject: "Verify Your Email Address",
    html: loadCodeTemplate(verificationCode, appName),
  };
  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: `Email successfully sent to: ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.error(`Error sending email: ${error.message}`);
  }
};

const sendForgetPasswordLink = async (req, res) => {
  const { email, forgetPasswordLink, appName } = req.body;
  const mailOptions = {
    from: process.env.OUTLOOK_EMAIL,
    to: email,
    subject: "Verify Your Email Address",
    html: loadForgetPasswordLinkTemplate(forgetPasswordLink, appName),
  };
  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: `Email successfully sent to: ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.error(`Error sending email: ${error.message}`);
  }
};

const sendForgetPasswordCode = async (req, res) => {
  const { email, forgetPasswordCode, appName } = req.body;
  const mailOptions = {
    from: process.env.OUTLOOK_EMAIL,
    to: email,
    subject: "Verify Your Email Address",
    html: loadForgetPasswordCodeTemplate(forgetPasswordCode, appName),
  };
  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: `Email successfully sent to: ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.error(`Error sending email: ${error.message}`);
  }
};
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is Up and Running" });
});

app.post("/send-verification-link", sendVerificationLink);
app.post("/send-verification-code", sendVerificationCode);
app.post("/send-forget-password-link", sendForgetPasswordLink);
app.post("/send-forget-password-code", sendForgetPasswordCode);

app.use("*", (req, res) => {
  res.status(404).send("Route not found");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

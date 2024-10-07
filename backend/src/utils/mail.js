const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const path = require("path");
const fs = require("fs").promises; // Use promises API for async file handling

// Create a reusable transporter instance outside the function
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Function to read HTML template files asynchronously
const readHTMLFile = async (filePath) => {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    console.error(`Error reading HTML file: ${error.message}`);
    throw error;
  }
};

// Generic function to send an email using the provided template and replacements
const sendMail = async (email, subject, templateName, replacements, attachments = []) => {
  try {
    // Read and compile the HTML template
    const templatePath = path.join(__dirname, `./templates/${templateName}.mail.html`);
    const html = await readHTMLFile(templatePath);
    const compiledTemplate = handlebars.compile(html);
    const htmlToSend = compiledTemplate(replacements);

    // Define the email options
    const mailOptions = {
      from: `"nhom chim bu" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlToSend,
      attachments,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}: ${info.response}`);
    return { email, subject, info };
  } catch (error) {
    console.error(`Failed to send email to ${email}: ${error.message}`);
    throw error;
  }
};

// Function to prepare and send a confirmation email
const sendConfirmationMail = async (user) => {
  if (!user) throw new Error("User instance is required to send a confirmation email.");

  const replacements = {
    firstname: user.firstname,
    lastname: user.lastname,
    link_to: `${process.env.URL_SERVER}/verify?token=${user.aToken}`, // Assuming `aToken` is a column in your `users` model
  };
  const attachments = [
    {
      filename: "mail.png",
      path: path.join(__dirname, `./images/mail.png`),
      cid: "unique@account.confirmation",
    },
  ];
  const subject = "[nhom chim bu] Verify your email address";
  return await sendMail(user.email, subject, "verify", replacements, attachments);
};

// Function to prepare and send an account activation email
const sendSuccessActivationMail = async (user) => {
  if (!user) throw new Error("User instance is required to send an account activation email.");

  const replacements = {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
  };
  const attachments = [
    {
      filename: "verified.png",
      path: path.join(__dirname, `./images/verified.png`),
      cid: "unique@account.verified",
    },
  ];
  const subject = "[nhom chim bu] Account verified";
  return await sendMail(user.email, subject, "accountverified", replacements, attachments);
};

// Function to prepare and send a password recovery email
const sendRecoveryMail = async (user) => {
  if (!user) throw new Error("User instance is required to send a password recovery email.");

  const replacements = {
    firstname: user.firstname,
    lastname: user.lastname,
    link_to: `${process.env.URL_SERVER}/newpassword?token=${user.rToken}`, // Assuming `rToken` is a column in your `users` model for password recovery
  };
  const attachments = [
    {
      filename: "resetpass.png",
      path: path.join(__dirname, `./images/resetpass.png`),
      cid: "unique@reset-password",
    },
  ];
  const subject = "[nhom chim bu] Password Recovery";
  return await sendMail(user.email, subject, "resetpassword", replacements, attachments);
};

// Export the email functions
module.exports = {
  sendConfirmationMail,
  sendSuccessActivationMail,
  sendRecoveryMail,
};

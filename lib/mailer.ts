import nodemailer from "nodemailer";
import { getUserPDF } from "@/lib/getUserPdf";
import { getEmailTemplateBySlug } from "./email_template";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
function decodeHTML(html: string) {
  return html
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
function replaceVariables(template: string, variables: Record<string, string>) {
  let output = template;

  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`\\$\\{${key}\\}`, "g");
    output = output.replace(regex, variables[key]);
  });

  return output;
}

const capitalizeName = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};




export async function sendOTPEmail(email: string, otp: string) {
  try {
    const { subject, template } = await getEmailTemplateBySlug("otp_code");

    // ✅ Step 1: Decode HTML
    const decodedTemplate = decodeHTML(template);

    // ✅ Step 2: Inject variables
    const finalHTML = replaceVariables(decodedTemplate, {
      email,
      otp,
    });

    // ✅ Step 3: Send email
    await transporter.sendMail({
      from: `"Hayaibu Talent" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `<div style="background-color:#f2f0ff; color:#333333;  padding-top:20px; padding-bottom:20px;">${finalHTML}  
      </div>`,
    });
  } catch (error) {
    console.error("Email Error:", error);
  }
}

export async function sendFormSubmissionEmail(
  userId: any,
  email: string,
  name: string,
) {
  try {
    console.log("sent the fomr submition mail");
    const { buffer, filename } = await getUserPDF(userId);
    const { subject, template } =
      await getEmailTemplateBySlug("form_submission");
    const decodedTemplate = decodeHTML(template);
    const finalHTML = replaceVariables(decodedTemplate, {
      name: capitalizeName(name),
      email,
    });
    await transporter.sendMail({
      from: `"Hayaibu Talent" <${process.env.EMAIL_USER}>`,
      to: email,
      cc: process.env.ADMIN_MAIL,
      subject,
      html: `<div style="background-color:#faf9ff; color:#333333;  padding-top:20px; padding-bottom:20px;">${finalHTML}  
      </div>`,

      // ✅ Attachment stays same
      attachments: [
        {
          filename,
          content: buffer,
          contentType: "application/pdf",
        },
      ],
    });
  } catch (error) {
    console.error("Form Email Error:", error);
  }
}

export async function sendApprovalPendingEmail(name: string, email: string) {
  try {
    // ✅ 1. Fetch template from API
    const { subject, template } =
      await getEmailTemplateBySlug("approval_pending");

    // ⚠️ Make sure slug exists in DB

    // ✅ 2. Decode HTML
    const decodedTemplate = decodeHTML(template);

    // ✅ 3. Prepare variables
    const finalHTML = replaceVariables(decodedTemplate, {
      name: capitalizeName(name),
      email,
    });

    // ✅ 4. Send email
    await transporter.sendMail({
      from: `"Hayaibu Talent" <${process.env.EMAIL_USER}>`,
      to: email,
      cc: process.env.ADMIN_MAIL,
      subject,
      html: `<div style="background-color:#faf9ff; color:#333333;  padding-top:20px; padding-bottom:20px;">${finalHTML}  
      </div>`,
    });
  } catch (error) {
    console.error("Approval Pending Email Error:", error);
  }
}

export async function sendUserApprovalEmail(email: string, name: string) {
  try {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard`;
    const { subject, template } = await getEmailTemplateBySlug("application_approved");
    const decodedTemplate = decodeHTML(template);
    const finalHTML = replaceVariables(decodedTemplate, {
      name: capitalizeName(name),
      dashboardUrl,
    });

    // ✅ 5. Send email
    await transporter.sendMail({
      from: `"Hayaibu Talent" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `<div style="background-color:#faf9ff; color:#333333;  padding-top:20px; padding-bottom:20px;">${finalHTML}  
      </div>`,
    });
  } catch (error) {
    console.error("User Approval Email Error:", error);
  }
}

export async function sendUserRejectionEmail(email: string, name: string) {
  try {
    // ✅ 1. Prepare dynamic values
    const dashboardUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard`;

    // ✅ 2. Fetch template
    const { subject, template } = await getEmailTemplateBySlug("application_rejected");

    // ⚠️ Make sure slug = "user_rejected" exists in DB

    // ✅ 3. Decode HTML
    const decodedTemplate = decodeHTML(template);

    // ✅ 4. Replace variables
    const finalHTML = replaceVariables(decodedTemplate, {
      name: capitalizeName(name),
      dashboardUrl,
    });

    // ✅ 5. Send email
    await transporter.sendMail({
      from: `"Hayaibu Talent" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `<div style="background-color:#faf9ff; color:#333333;  padding-top:20px; padding-bottom:20px;">${finalHTML}  
      </div>`,
    });
  } catch (error) {
    console.error("User Rejection Email Error:", error);
  }
}

export async function sendAccountCreatedEmail(email: string, name: string) {
  try {
    // ✅ 1. Prepare dynamic values
    const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

    // ✅ 2. Fetch template from API
    const { subject, template } =
      await getEmailTemplateBySlug("account_created");

    // ⚠️ Make sure slug = "account_created" exists in DB

    // ✅ 3. Decode HTML
    const decodedTemplate = decodeHTML(template);

    // ✅ 4. Replace variables
    const finalHTML = replaceVariables(decodedTemplate, {
      name: capitalizeName(name),
      loginUrl,
    });

    // ✅ 5. Send email
    await transporter.sendMail({
      from: `"Hayaibu Talent" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `<div style="background-color:#faf9ff; color:#333333;  padding-top:20px; padding-bottom:20px;">${finalHTML}  
      </div>`,
    });
  } catch (error) {
    console.error("Account Created Email Error:", error);
  }
}

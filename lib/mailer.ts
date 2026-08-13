import nodemailer from "nodemailer";
import { getUserPDF } from "@/lib/getUserPdf";
import { getEmailTemplateBySlug2 } from "./server/emailTemplates";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Connection Failed:", error.message);
  } else {
    console.log("✅ SMTP Connected Successfully");
  }
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
export function formatLine(input: string): string {
  if (!input) return "";

  return input
    .replace(/-/g, " ") // remove dashes
    .trim()
    .split(" ")
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const capitalizeName = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};



export async function sendOTPEmail(email: string, otp: string) {
  try {
    const { subject, template } = await getEmailTemplateBySlug2("otp_code");
    const decodedTemplate = decodeHTML(template);
    const finalHTML = replaceVariables(decodedTemplate, {
      email,
      otp,
    });
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
  type:string
) {
  try {
    const { buffer, filename } = await getUserPDF(userId);
    const { subject, template } = await getEmailTemplateBySlug2("form_submission");
    const decodedTemplate = decodeHTML(template);
    const finalHTML = replaceVariables(decodedTemplate, {
      name: capitalizeName(name),
      email,
      type:formatLine(type)
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

export async function sendApprovalPendingEmail(name: string, email: string, type:string) {
  try {
    // ✅ 1. Fetch template from API
    const { subject, template } =
      await getEmailTemplateBySlug2("approval_pending");

    // ⚠️ Make sure slug exists in DB

    // ✅ 2. Decode HTML
    const decodedTemplate = decodeHTML(template);

    // ✅ 3. Prepare variables
    const finalHTML = replaceVariables(decodedTemplate, {
      name: capitalizeName(name),
      email,
      type:formatLine(type)
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

export async function sendUserApprovalEmail(email: string, name: string, type:string) {
  try {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard`;
    const { subject, template } = await getEmailTemplateBySlug2("application_approved");
    const decodedTemplate = decodeHTML(template);
    const finalHTML = replaceVariables(decodedTemplate, {
      name: capitalizeName(name),
      dashboardUrl,
      type:formatLine(type)
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

export async function sendUserRejectionEmail(email: string, name: string, type:string) {
  try {
    // ✅ 1. Prepare dynamic values
    const dashboardUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard`;

    // ✅ 2. Fetch template
    const { subject, template } = await getEmailTemplateBySlug2("application_rejected");

    // ⚠️ Make sure slug = "user_rejected" exists in DB

    // ✅ 3. Decode HTML
    const decodedTemplate = decodeHTML(template);

    // ✅ 4. Replace variables
    const finalHTML = replaceVariables(decodedTemplate, {
      name: capitalizeName(name),
      dashboardUrl,
      type:formatLine(type)
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
      await getEmailTemplateBySlug2("account_created");

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

export async function sendContactFormEmail(
  name: string,
  email: string,
  phone: string,
  enquiryType: string,
  subject: string,
  message: string
) {
  try {
    await transporter.sendMail({
      from: `"Hayaibu Talent" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_MAIL,
      replyTo: email,

      subject: `New Contact Form - ${subject}`,

      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:30px;">
            
            <div style="
              max-width:650px;
              margin:auto;
              background:#ffffff;
              border-radius:12px;
              padding:30px;
              box-shadow:0 4px 15px rgba(0,0,0,0.08);
            ">

              <h2 style="color:#6d28d9; margin-bottom:25px;">
                New Contact Form Submission
              </h2>

              <p>
                A new message has been submitted through the Hayaibu Talent
                contact form.
              </p>

              <hr style="border:none;border-top:1px solid #eee;margin:25px 0;" />

              <p>
                <strong>Name:</strong><br />
                ${name}
              </p>

              <p>
                <strong>Email:</strong><br />
                ${email}
              </p>

              <p>
                <strong>Phone:</strong><br />
                ${phone || "Not provided"}
              </p>

              <p>
                <strong>Enquiry Type:</strong><br />
                ${enquiryType || "General Enquiry"}
              </p>

              <p>
                <strong>Subject:</strong><br />
                ${subject}
              </p>

              <p>
                <strong>Message:</strong><br />
                ${message.replace(/\n/g, "<br />")}
              </p>

              <hr style="border:none;border-top:1px solid #eee;margin:25px 0;" />

              <p style="font-size:13px;color:#777;">
                This email was automatically generated from the
                Hayaibu Talent website contact form.
              </p>

            </div>

          </body>
        </html>
      `,
    });

    console.log("✅ Contact email sent successfully");

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ Contact Email Error:", error);

    // IMPORTANT: let API know that sending failed
    throw error;
  }
}







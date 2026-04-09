import nodemailer from "nodemailer";
import { getUserPDF } from "@/lib/getUserPdf";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const capitalizeName = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export async function sendOTPEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `"Hayaibu Talent" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
   <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#F4F6FA" style="background-color: #F4F6FA; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Email Container: White background, rounded corners, modern shadow -->
        <table width="100%" max-width="560" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width: 560px; width: 100%; background-color: #FFFFFF; border-radius: 32px; box-shadow: 0 25px 45px -12px rgba(0, 0, 0, 0.15), 0 8px 18px rgba(0, 0, 0, 0.05); overflow: hidden; border-collapse: separate;">
          <tr>
            <td style="padding: 0;">
              <!-- Header with subtle brand bar (accent color line) -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 0;">
                    <div style="height: 6px; background: linear-gradient(90deg, #5C49D8 0%, #8B7AEE 100%); width: 100%;"></div>
                  </td>
                </tr>
              </table>
              
              <!-- Main content area -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 40px 32px 20px 32px;">
                    <!-- Icon / logo placeholder (modern minimal) -->
                    <div style="text-align: center; margin-bottom: 16px;">
                      <div style="display: inline-block; background-color: #F0EEFF; width: 64px; height: 64px; border-radius: 32px; text-align: center; line-height: 64px;">
                        <span style="font-size: 34px;">✉️</span>
                      </div>
                    </div>
                    
                    <!-- Main Heading: Verify Your Email -->
                    <h1 style="font-size: 32px; font-weight: 700; color: #1A1F36; margin: 0 0 8px 0; text-align: center; letter-spacing: -0.5px;">Verify Your Email</h1>
                    
                    <!-- Subheading with accent color -->
                    <p style="font-size: 16px; font-weight: 500; color: #5C49D8; margin: 0 0 24px 0; text-align: center; text-transform: uppercase; letter-spacing: 0.8px;">One-Time Password</p>
                    
                    <!-- Description text -->
                    <p style="font-size: 16px; color: #5B677B; text-align: center; margin: 0 0 8px 0; line-height: 1.5;">Use the secure verification code. This code is valid for the next <strong style="color: #5C49D8;">5 minutes</strong>.</p>
                  </td>
                </tr>
                
                <!-- OTP Code Card: Modern card style -->
                <tr>
                  <td style="padding: 8px 32px 20px 32px;">
                    <div style="background-color: #F9FAFF; border-radius: 28px; padding: 28px 20px; text-align: center; border: 1px solid #EDEFF5; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                      <!-- OTP label -->
                      <p style="font-size: 13px; font-weight: 600; color: #5C49D8; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 12px 0;">Verification Code</p>
                      <!-- Dynamic OTP value with letter spacing -->
                      <h1 style="font-size: 52px; font-weight: 800; color: #1A1F36; letter-spacing: 12px; margin: 0; background: #FFFFFF; display: inline-block; padding: 12px 24px; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); font-family: monospace, 'Courier New', 'SF Mono', monospace;">${otp}</h1>
                    </div>
                  </td>
                </tr>
                
                <!-- Expiry + additional info -->
                <tr>
                  <td style="padding: 8px 32px 24px 32px;">
                    <div style="text-align: center; background: #FFFFFF; border-radius: 20px;">
                      <p style="font-size: 14px; color: #7C879A; margin: 0 0 16px 0; line-height: 1.5;">If you didn't request this code, you can safely ignore this email.</p>
                      <!-- Subtle divider -->
                      <div style="height: 1px; background: #E9ECF2; width: 100%; margin: 20px 0 16px 0;"></div>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer with brand colors -->
                <tr>
                  <td style="padding: 16px 32px 32px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                      <tr>
                        <td align="center" style="padding: 0;">
                          <p style="font-size: 12px; color: #A5AFC0; margin: 0 0 8px 0;">&copy; 2026 Hayaibu Talent. All rights reserved.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <!-- End main container -->
        
        <!-- Small note for email clients -->
        <table width="100%" max-width="560" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width: 560px; width: 100%; margin-top: 24px;">
          <tr>
            <td align="center" style="padding: 16px 20px;">
              <p style="font-size: 11px; color: #9BA3B5; text-align: center; margin: 0;">This is an automated message, please do not reply. If you have any questions, visit our Help Center.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
    `,
  });
}

export async function sendFormSubmissionEmail(
  userId: any,
  email: string,
  name: string,
  submittedAt: string,
) {
  const { buffer, filename } = await getUserPDF(userId);
  await transporter.sendMail({
    from: `"Hayaibu Talent" <${process.env.EMAIL_USER}>`,
    to: email,
    cc: process.env.ADMIN_MAIL,
    subject: "Form Submitted Successfully",
    html: `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#F4F6FA">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          
          <table width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 32px; box-shadow: 0 25px 45px -12px rgba(0,0,0,0.15); overflow: hidden;">
            
            <!-- Top gradient bar -->
            <tr>
              <td>
                <div style="height: 6px; background: linear-gradient(90deg, ##5C49D8, ##5C49D8);"></div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px 32px; text-align: center;">
                
                <!-- Icon -->
                <div style="margin-bottom: 16px;">
                  <div style="display: inline-block; background: #ECFDF5; width: 64px; height: 64px; border-radius: 50%; line-height: 64px;">
                    <span style="font-size: 32px;">✅</span>
                  </div>
                </div>

                <!-- Title -->
                <h1 style="font-size: 28px; color: #111827; margin-bottom: 10px;">
                  Submission Successful
                </h1>

                <!-- Message -->
                <p style="color: #6B7280; font-size: 16px; margin-bottom: 24px;">
                  Thank you <strong>${capitalizeName(name)}</strong>, your form has been submitted successfully. Our team wil contact you soon.
                </p>

                <!-- Info Card -->
                <div style="background: #F9FAFB; border-radius: 20px; padding: 20px; text-align: left;">
                  
                  <p style="margin: 8px 0; font-size: 14px;">
                    <strong>Name:</strong> ${capitalizeName(name)}
                  </p>

                  <p style="margin: 8px 0; font-size: 14px;">
                    <strong>Email:</strong> ${email}
                  </p>

                  <p style="margin: 8px 0; font-size: 14px;">
                    <strong>Submitted At:</strong> ${submittedAt}
                  </p>

                </div>

                <!-- Footer text -->
                <p style="margin-top: 24px; font-size: 13px; color: #9CA3AF;">
                  We will review your submission and get back to you shortly.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="text-align:center; padding: 20px;">
                <p style="font-size: 12px; color: #9CA3AF;">
                  © 2026 Hayaibu Talent
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
    `,
    attachments: [
      {
        filename,
        content: buffer,
        contentType: "application/pdf",
      },
    ],
  });
}

export async function sendApprovalPendingEmail(
  name: string,
  email: string,
  submittedAt: string
) {
  await transporter.sendMail({
    from: `"Hayaibu Talent" <${process.env.EMAIL_USER}>`,
    to: email,
    cc: process.env.ADMIN_MAIL,
    subject: "Approval Pending - Action Required",

    html: `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#F4F6FA">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          
          <table width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 32px; box-shadow: 0 25px 45px -12px rgba(0,0,0,0.15); overflow: hidden;">
            
            <!-- Top bar -->
            <tr>
              <td>
                <div style="height: 6px; background: linear-gradient(90deg, #F59E0B, #F97316);"></div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px 32px; text-align: center;">

                <!-- Icon -->
                <div style="margin-bottom: 16px;">
                  <div style="display: inline-block; background: #FFFBEB; width: 64px; height: 64px; border-radius: 50%; line-height: 64px;">
                    <span style="font-size: 32px;">⏳</span>
                  </div>
                </div>

                <!-- Title -->
                <h1 style="font-size: 26px; color: #111827; margin-bottom: 10px;">
                  Approval Pending
                </h1>

                <!-- Message -->
                <p style="color: #6B7280; font-size: 16px; margin-bottom: 24px;">
                  Hello <strong>${capitalizeName(name)}</strong>, your submission is currently under review by our admin team.
                  You are not yet eligible to proceed to the next step until approval is granted.
                </p>

                <!-- Info Card -->
                <div style="background: #F9FAFB; border-radius: 20px; padding: 20px; text-align: left;">
                  
                  <p style="margin: 8px 0; font-size: 14px;">
                    <strong>Name:</strong> ${capitalizeName(name)}
                  </p>

                  <p style="margin: 8px 0; font-size: 14px;">
                    <strong>Email:</strong> ${email}
                  </p>

                  <p style="margin: 8px 0; font-size: 14px;">
                    <strong>Status:</strong> Pending Approval
                  </p>

                  <p style="margin: 8px 0; font-size: 14px;">
                    <strong>Submitted At:</strong> ${submittedAt}
                  </p>

                </div>

                <!-- Warning Box -->
                <div style="margin-top: 20px; padding: 14px; background: #FEF3C7; border-radius: 12px;">
                  <p style="margin: 0; font-size: 13px; color: #92400E;">
                    ⚠️ You will not be able to proceed to the next steps until the admin approves your application.
                  </p>
                </div>

                <!-- Footer message -->
                <p style="margin-top: 24px; font-size: 13px; color: #9CA3AF;">
                  You will be notified immediately once your application is reviewed.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="text-align:center; padding: 20px;">
                <p style="font-size: 12px; color: #9CA3AF;">
                  © 2026 Hayaibu Talent
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
    `,
  });
}

export async function sendUserApprovalEmail(email: string, name: string) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard`;

  await transporter.sendMail({
    from: `"Hayaibu Talent" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Application Approved 🎉",
    html: `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#F4F6FA">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          
          <table width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 32px; box-shadow: 0 25px 45px -12px rgba(0,0,0,0.15); overflow: hidden;">
            
            <!-- Top bar -->
            <tr>
              <td>
                <div style="height: 6px; background: linear-gradient(90deg, #5C49D8, #8B7AEE);"></div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px 32px; text-align: center;">

                <!-- Icon -->
                <div style="margin-bottom: 16px;">
                  <div style="display:inline-block; background:#ECFDF5; width:64px; height:64px; border-radius:50%; line-height:64px;">
                    <span style="font-size:32px;">🎉</span>
                  </div>
                </div>

                <!-- Title -->
                <h1 style="font-size: 28px; color: #111827; margin-bottom: 10px;">
                  Congratulations ${capitalizeName(name)}!
                </h1>

                <!-- Message -->
                <p style="color:#6B7280; font-size:16px; margin-bottom:24px;">
                  Your application has been <strong style="color:#10B981;">approved</strong> by our admin team.
                  You can now proceed to the next steps and complete your profile.
                </p>

                <!-- Button -->
                <a href="${dashboardUrl}" style="
                  display:inline-block;
                  padding:12px 24px;
                  background:#5C49D8;
                  color:#fff;
                  border-radius:12px;
                  text-decoration:none;
                  font-weight:600;
                ">
                  Go to Dashboard
                </a>

                <!-- Footer note -->
                <p style="margin-top:24px; font-size:13px; color:#9CA3AF;">
                  We’re excited to have you onboard!
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="text-align:center; padding: 20px;">
                <p style="font-size:12px; color:#9CA3AF;">
                  © 2026 Hayaibu Talent
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
    `,
  });
}

export async function sendUserRejectionEmail(email: string, name: string) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard`;

  await transporter.sendMail({
    from: `"Hayaibu Talent" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Application Update",
    html: `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#F4F6FA">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          
          <table width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 32px; box-shadow: 0 25px 45px -12px rgba(0,0,0,0.15); overflow: hidden;">
            
            <!-- Top bar -->
            <tr>
              <td>
                <div style="height: 6px; background: linear-gradient(90deg, #EF4444, #F87171);"></div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px 32px; text-align: center;">

                <!-- Icon -->
                <div style="margin-bottom: 16px;">
                  <div style="display:inline-block; background:#FEF2F2; width:64px; height:64px; border-radius:50%; line-height:64px;">
                    <span style="font-size:32px;">❌</span>
                  </div>
                </div>

                <!-- Title -->
                <h1 style="font-size: 28px; color: #111827; margin-bottom: 10px;">
                  Application Not Approved
                </h1>

                <!-- Message -->
                <p style="color:#6B7280; font-size:16px; margin-bottom:24px;">
                  Dear <strong>${capitalizeName(name)}</strong>, unfortunately your application was <strong style="color:#EF4444;">not approved</strong> at this time.
                  This may be due to incorrect or incomplete information.
                </p>

                <p style="color:#6B7280; font-size:14px; margin-bottom:24px;">
                  Please review your details carefully and resubmit your application.
                </p>

                <!-- Button -->
                <a href="${dashboardUrl}" style="
                  display:inline-block;
                  padding:12px 24px;
                  background:#EF4444;
                  color:#fff;
                  border-radius:12px;
                  text-decoration:none;
                  font-weight:600;
                ">
                  Review Application
                </a>

                <!-- Footer note -->
                <p style="margin-top:24px; font-size:13px; color:#9CA3AF;">
                  You can contact support if you believe this was a mistake.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="text-align:center; padding: 20px;">
                <p style="font-size:12px; color:#9CA3AF;">
                  © 2026 Hayaibu Talent
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
    `,
  });
}

export async function sendAccountCreatedEmail(email: string, name: string) {
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

  await transporter.sendMail({
    from: `"Hayaibu Talent" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Account Created Successfully 🎉",
    html: `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#F4F6FA">
      <tr>
        <td align="center" style="padding: 40px 20px;">

          <table width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 32px; box-shadow: 0 25px 45px -12px rgba(0,0,0,0.15); overflow: hidden;">

            <!-- Top gradient bar -->
            <tr>
              <td>
                <div style="height: 6px; background: linear-gradient(90deg, #5C49D8, #8B7AEE);"></div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px 32px; text-align: center;">

                <!-- Icon -->
                <div style="margin-bottom: 16px;">
                  <div style="display:inline-block; background:#EEF2FF; width:64px; height:64px; border-radius:50%; line-height:64px;">
                    <span style="font-size:32px;">👤</span>
                  </div>
                </div>

                <!-- Title -->
                <h1 style="font-size: 28px; color: #111827; margin-bottom: 10px;">
                 Welcome, ${capitalizeName(name)}!
                </h1>

                <!-- Message -->
                <p style="color:#6B7280; font-size:16px; margin-bottom:24px;">
                  Your account has been <strong style="color:#5C49D8;">created successfully</strong>.
                  You can now log in and start using your dashboard.
                </p>

                <!-- Button -->
                <a href="${loginUrl}" style="
                  display:inline-block;
                  padding:12px 24px;
                  background:#5C49D8;
                  color:#fff;
                  border-radius:12px;
                  text-decoration:none;
                  font-weight:600;
                ">
                  Login to Your Account
                </a>

                <!-- Footer note -->
                <p style="margin-top:24px; font-size:13px; color:#9CA3AF;">
                  If you did not create this account, please contact support immediately.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="text-align:center; padding: 20px;">
                <p style="font-size:12px; color:#9CA3AF;">
                  © 2026 Hayaibu Talent
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
    `,
  });
}

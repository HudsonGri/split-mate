import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525,
  secure: false,
  auth: {
    user: "hudsong.dev",
    pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
  },
});

export async function sendInvitationEmails(emails, groupName, groupCode) {
  const mailOptions = {
    from: '"Split Mate" <test@hudsong.dev>',
    to: "example@example.com", // this is ignored when using BCC
    bcc: emails.join(","),
    subject: "Invitation to Join Group",
    text: `You have been invited to join the group '${groupName}'. Use the invite code ${groupCode} to join at: https://example.com/join`,
    html: `<p>You have been invited to join the group '${groupName}'. Use the invite code <strong>${groupCode}</strong> to join at: <a href="https://example.com/join">Join Group</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Invitation emails sent successfully.");
    return true;
  } catch (error) {
    console.error("Failed to send emails:", error);
    return false;
  }
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  tenantName?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: "mock" | "resend" | "smtp";
  previewUrl?: string;
}

// In-memory log of sent emails during development/testing
export interface LoggedEmail {
  id: string;
  to: string;
  subject: string;
  html: string;
  timestamp: Date;
  tenantName?: string;
}

const sentEmailsHistory: LoggedEmail[] = [];

export function getSentEmails(): LoggedEmail[] {
  return [...sentEmailsHistory].reverse();
}

export function clearSentEmails() {
  sentEmailsHistory.length = 0;
}

export async function sendEmail(options: SendEmailOptions): Promise<EmailResult> {
  const provider = (process.env.EMAIL_PROVIDER || "mock").toLowerCase();

  // MOCK / SANDBOX PROVIDER
  if (provider === "mock" || !process.env.RESEND_API_KEY) {
    const mockId = `mock-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const logged = {
      id: mockId,
      to: options.to,
      subject: options.subject,
      html: options.html,
      timestamp: new Date(),
      tenantName: options.tenantName,
    };
    sentEmailsHistory.push(logged);
    if (sentEmailsHistory.length > 50) sentEmailsHistory.shift();

    console.log(`[EMAIL SANDBOX] [${options.tenantName || "SaaS"}] To: ${options.to} | Subject: "${options.subject}"`);
    return {
      success: true,
      messageId: mockId,
      provider: "mock",
    };
  }

  // RESEND PROVIDER
  if (provider === "resend" && process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM_ADDRESS || "Social Backup <onboarding@resend.dev>",
          to: [options.to],
          subject: options.subject,
          html: options.html,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.message || "Failed to send email via Resend",
          provider: "resend",
        };
      }
      return {
        success: true,
        messageId: data.id,
        provider: "resend",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Network error sending email",
        provider: "resend",
      };
    }
  }

  return {
    success: false,
    error: `Unknown email provider: ${provider}`,
    provider: "mock",
  };
}

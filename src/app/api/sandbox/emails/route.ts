import { NextResponse } from "next/server";
import { getSentEmails, clearSentEmails } from "@/lib/email";

export async function GET() {
  const emails = getSentEmails();
  return NextResponse.json({
    provider: process.env.EMAIL_PROVIDER || "mock",
    count: emails.length,
    emails,
  });
}

export async function DELETE() {
  clearSentEmails();
  return NextResponse.json({ success: true, message: "Historial de pruebas limpiado." });
}

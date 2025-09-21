import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, company, engagement, message } = await request.json();

const data = await resend.emails.send({
  from: 'Portfolio <onboarding@resend.dev>',
  to: 'zaimelyafi@gmail.com',
  subject: `New Work Inquiry from ${name}`,
  replyTo: email,
  html: `
    <h2>New Work Inquiry</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Company:</strong> ${company || '-'}</p>
    <p><strong>Types of Collaboration:</strong> ${engagement || '-'}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `,
});



    return NextResponse.json({ 
      message: 'Email sent successfully',
      data 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
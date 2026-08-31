import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Connect to MongoDB
    await connectToDatabase();

    // Create a new contact message
    const newMessage = new Contact({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      subject: data.subject,
      message: data.message,
    });

    await newMessage.save();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to save contact message:", error);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}

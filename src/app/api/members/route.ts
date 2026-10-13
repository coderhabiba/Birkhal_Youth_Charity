import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Member from '@/models/Member';
import { processBase64Image } from '@/lib/uploadHelper';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Connect to MongoDB
    await connectToDatabase();

    const photoUrl = data.photoUrl && data.photoUrl.startsWith('data:image')
      ? processBase64Image(data.photoUrl, 'member')
      : (data.photoUrl || undefined);

    // Create a new member with pending status
    const newMember = new Member({
      nameBn: data.nameBn,
      nameEn: data.nameEn || '',
      fatherHusbandName: data.fatherHusbandName || data.fatherName || '',
      motherName: data.motherName,
      dateOfBirth: data.dateOfBirth || data.dob || '',
      bloodGroup: data.bloodGroup || undefined,
      mobileNumber: data.mobileNumber,
      whatsappNumber: data.whatsappNumber || '',
      email: data.email || undefined,
      nidOrBirthCert: data.nidOrBirthCert || data.nidOrBirthReg || '',
      presentAddress: data.presentAddress,
      permanentAddress: data.permanentAddress,
      photoUrl,
      status: 'pending', // Explicitly pending until admin approves
    });

    const savedMember = await newMember.save();

    return NextResponse.json({ success: true, member: savedMember }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to register member:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to register" }, { status: 500 });
  }
}

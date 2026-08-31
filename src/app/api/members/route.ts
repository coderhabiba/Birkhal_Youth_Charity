import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Member from '@/models/Member';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Connect to MongoDB
    await connectToDatabase();

    // Create a new member
    const newMember = new Member({
      nameBn: data.nameBn,
      nameEn: data.nameEn,
      fatherHusbandName: data.fatherHusbandName,
      motherName: data.motherName,
      dateOfBirth: data.dateOfBirth,
      bloodGroup: data.bloodGroup || undefined,
      mobileNumber: data.mobileNumber,
      email: data.email || undefined,
      nidOrBirthCert: data.nidOrBirthCert,
      presentAddress: data.presentAddress,
      permanentAddress: data.permanentAddress,
      photoUrl: data.photoUrl || undefined,
    });

    const savedMember = await newMember.save();

    return NextResponse.json({ success: true, member: savedMember }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to register member:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to register" }, { status: 500 });
  }
}

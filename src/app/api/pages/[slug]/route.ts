import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import CustomPage from "@/models/CustomPage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    
    const page = await CustomPage.findOne({ slug }).lean();
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    
    return NextResponse.json(page);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch page" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const data = await request.json();

    const updated = await CustomPage.findOneAndUpdate(
      { slug },
      {
        titleBn: data.titleBn,
        titleEn: data.titleEn,
        subtitleBn: data.subtitleBn,
        subtitleEn: data.subtitleEn,
        bannerImage: data.bannerImage,
        showInNavbar: Boolean(data.showInNavbar),
        showInFooter: Boolean(data.showInFooter),
        status: data.status || "published",
        sections: data.sections || []
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const deleted = await CustomPage.findOneAndDelete({ slug });
    if (!deleted) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Page deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete page" }, { status: 500 });
  }
}

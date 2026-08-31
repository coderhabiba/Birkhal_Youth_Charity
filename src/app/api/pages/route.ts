import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import CustomPage from "@/models/CustomPage";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";
    
    const query = publishedOnly ? { status: "published" } : {};
    const pages = await CustomPage.find(query).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json(pages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    // Validate required fields
    if (!data.titleBn || !data.titleEn || !data.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    // Clean slug
    const cleanSlug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/--+/g, "-");
    
    // Check for existing slug
    const existing = await CustomPage.findOne({ slug: cleanSlug });
    if (existing) {
      return NextResponse.json({ error: "A page with this URL slug already exists" }, { status: 400 });
    }

    const newPage = await CustomPage.create({
      ...data,
      slug: cleanSlug,
      sections: data.sections || []
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create page" }, { status: 500 });
  }
}

import connectToDatabase from "@/lib/mongodb";
import CustomPage from "@/models/CustomPage";
import { notFound } from "next/navigation";
import { CustomPageClient } from "./custom-page-client";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const page = await CustomPage.findOne({ slug, status: "published" }).lean();
  
  if (!page) {
    return {
      title: "Page Not Found | বীরখাল সমাজ কল্যাণ যুব সংগঠন",
    };
  }

  return {
    title: `${page.titleBn} | বীরখাল সমাজ কল্যাণ যুব সংগঠন`,
    description: page.subtitleBn || page.subtitleEn || "বীরখাল সমাজ কল্যাণ যুব সংগঠনের উদ্যোগ",
  };
}

export default async function DynamicCustomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDatabase();

  const page = await CustomPage.findOne({ slug }).lean();

  if (!page) {
    notFound();
  }

  // Serialize Mongoose doc
  const serializedPage = {
    ...page,
    _id: page._id.toString(),
    createdAt: page.createdAt?.toISOString(),
    updatedAt: page.updatedAt?.toISOString(),
  };

  return <CustomPageClient page={serializedPage as any} />;
}

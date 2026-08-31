import mongoose, { Schema, Document } from "mongoose";

export interface IPageSection {
  id: string;
  type: "hero" | "text_block" | "cards_grid" | "image_gallery" | "faq_accordion" | "cta_box";
  titleBn?: string;
  titleEn?: string;
  contentBn?: string;
  contentEn?: string;
  bannerImage?: string;
  buttonTextBn?: string;
  buttonTextEn?: string;
  buttonUrl?: string;
  items?: Array<{
    titleBn?: string;
    titleEn?: string;
    descBn?: string;
    descEn?: string;
    image?: string;
    link?: string;
  }>;
}

export interface ICustomPage extends Document {
  titleBn: string;
  titleEn: string;
  slug: string;
  subtitleBn?: string;
  subtitleEn?: string;
  bannerImage?: string;
  showInNavbar: boolean;
  showInFooter: boolean;
  status: "published" | "draft";
  sections: IPageSection[];
  createdAt: Date;
  updatedAt: Date;
}

const CustomPageSchema: Schema = new Schema(
  {
    titleBn: { type: String, required: true },
    titleEn: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    subtitleBn: { type: String, default: "" },
    subtitleEn: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    showInNavbar: { type: Boolean, default: false },
    showInFooter: { type: Boolean, default: false },
    status: { type: String, enum: ["published", "draft"], default: "published" },
    sections: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.CustomPage || mongoose.model<ICustomPage>("CustomPage", CustomPageSchema);

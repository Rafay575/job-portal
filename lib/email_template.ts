import axios from "axios";
import pool from "@/lib/db";
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/email-template`;

// ✅ CREATE Email Template
export const createEmailTemplate = async (data: {
  slug: string;
  subject: string;
  template: string;
  variables?: any;
}) => {
  try {
    const res = await axios.post(BASE_URL, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

// ✅ GET ALL Email Templates
export const getAllEmailTemplates = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

// ✅ GET ONE (by slug)
export const getEmailTemplateBySlug = async (slug: string) => {
    if (!slug) {
      return;
    }
  try {
    const res = await axios.get(`${BASE_URL}/${slug}`);
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.error || "Failed to fetch email template";
    throw error;
  }
};



// ✅ UPDATE (by ID via query)
export const updateEmailTemplate = async ({
  id,
  slug,
  subject,
  template,
  variables,
}: {
  id: number | string | null;
  slug: string;
  subject: string;
  template: string;
  variables?: any;
}) => {
  if (!id) {
    throw new Error("ID is required");
  }

  try {
    const res = await axios.put(`${BASE_URL}?id=${id}`, {
      slug,
      subject,
      template,
      variables,
    });

    return res.data;
  } catch (error: any) {
    throw error;
  }
};

// ✅ DELETE (by slug)
export const deleteEmailTemplate = async (slug: string) => {
  if (!slug) {
    throw new Error("slug is required");
  }

  try {
    const res = await axios.delete(`${BASE_URL}/${slug}`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

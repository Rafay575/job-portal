import axios from "axios";
import { toast } from "react-hot-toast";


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

    const message = res?.data?.message || "Created successfully";
    toast.success(message);

    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.error || "Failed to create email template";

    toast.error(message);
    throw error;
  }
};

// ✅ GET ALL Email Templates
export const getAllEmailTemplates = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.error || "Failed to fetch email templates";

    toast.error(message);
    throw error;
  }
};

// ✅ GET ONE (by slug)
export const getEmailTemplateBySlug = async (slug: string) => {
    if (!slug) {
      toast.error("slug is required");
      return;
    }
  try {
    const res = await axios.get(`${BASE_URL}/${slug}`);
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.error || "Failed to fetch email template";

    toast.error(message);
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
  try {
    if (!id) {
      toast.error("ID is required");
      return;
    }
    const res = await axios.put(`${BASE_URL}?id=${id}`, {
      slug,
      subject,
      template,
      variables,
    });

    const message = res?.data?.message || "Updated successfully";
    toast.success(message);

    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.error || "Update failed";

    toast.error(message);
    throw error;
  }
};

// ✅ DELETE (by slug)
export const deleteEmailTemplate = async (slug: string) => {
    if (!slug) {
      toast.error("slug is required");
      return;
    }
  try {
    const res = await axios.delete(`${BASE_URL}/${slug}`);

    const message = res?.data?.message || "Deleted successfully";
    toast.success(message);

    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.error || "Delete failed";

    toast.error(message);
    throw error;
  }
};

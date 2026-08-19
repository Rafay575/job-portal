import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getJobById } from "@/lib/getJobs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ============================================================
    // PAGINATION
    // ============================================================

    const pageParam = Number(searchParams.get("page") || "1");
    const limitParam = Number(searchParams.get("limit") || "10");

    const page =
      Number.isFinite(pageParam) && pageParam > 0
        ? Math.floor(pageParam)
        : 1;

    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(Math.floor(limitParam), 100)
        : 10;

    // ============================================================
    // FILTERS
    // ============================================================

    const search = (searchParams.get("search") || "")
      .trim()
      .toLowerCase();

    const category = (searchParams.get("category") || "")
      .trim()
      .toLowerCase();

    const positionType = (searchParams.get("positionType") || "")
      .trim()
      .toLowerCase();

    // ============================================================
    // 1. GET APPLICATIONS + USER DETAILS
    // ============================================================

    const [applications] = await db.query(
      `
      SELECT
        aj.id AS applicationId,
        aj.user_id AS userId,
        aj.job_id AS jobId,
        aj.applied_at AS appliedAt,

        u.name AS userName,
        u.email AS userEmail

      FROM applied_jobs aj

      INNER JOIN users u
        ON u.id = aj.user_id

      ORDER BY aj.applied_at DESC
      `
    );

    const applicationRows = applications as any[];

    // ============================================================
    // 2. GET JOB DETAILS FROM EXTERNAL API
    // ============================================================

    const enrichedData = await Promise.all(
      applicationRows.map(async (application) => {
        let job = null;

        try {
          const response = await getJobById(
            String(application.jobId)
          );

          if (response?.success && response?.data) {
            job = response.data;
          }
        } catch (error) {
          console.error(
            `Failed to fetch job ${application.jobId}:`,
            error
          );
        }

        return {
          applicationId: application.applicationId,

          appliedAt: application.appliedAt,

          user: {
            id: application.userId,
            name: application.userName,
            email: application.userEmail,
          },

          job: job
            ? {
                sale_id: job.sale_id,
                title: job.title,
                category: job.category,
                position_type: job.position_type,
                salary: job.salary,
                office: job.office,
                unit: job.unit,
                region: job.region,
                status: job.status,
                created: job.created,
              }
            : {
                sale_id: application.jobId,
                title: "Job unavailable",
                category: "N/A",
                position_type: "N/A",
                salary: "N/A",
                office: "",
                unit: "",
                region: "",
                status: "unavailable",
                created: "N/A",
              },
        };
      })
    );

    // ============================================================
    // 3. GET FILTER OPTIONS
    // ============================================================

    const categories = Array.from(
      new Set(
        enrichedData
          .map((item) => item.job.category)
          .filter(
            (value) =>
              value &&
              value !== "N/A"
          )
      )
    ).sort();

    const positionTypes = Array.from(
      new Set(
        enrichedData
          .map((item) => item.job.position_type)
          .filter(
            (value) =>
              value &&
              value !== "N/A"
          )
      )
    ).sort();

    // ============================================================
    // 4. SEARCH
    // ============================================================

    let filteredData = enrichedData;

    if (search) {
      filteredData = filteredData.filter((item) => {
        const searchableValues = [
          item.user.id,
          item.user.name,
          item.user.email,

          item.job.sale_id,
          item.job.title,
          item.job.category,
          item.job.position_type,
          item.job.salary,
          item.job.office,
          item.job.unit,
          item.job.region,
          item.job.status,
          item.job.created,

          item.appliedAt,
        ];

        return searchableValues.some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(search)
        );
      });
    }

    // ============================================================
    // 5. CATEGORY FILTER
    // ============================================================

    if (category) {
      filteredData = filteredData.filter(
        (item) =>
          String(item.job.category || "")
            .toLowerCase() === category
      );
    }

    // ============================================================
    // 6. POSITION TYPE FILTER
    // ============================================================

    if (positionType) {
      filteredData = filteredData.filter(
        (item) =>
          String(item.job.position_type || "")
            .toLowerCase() === positionType
      );
    }

    // ============================================================
    // 7. PAGINATION
    // ============================================================

    const total = filteredData.length;

    const totalPages =
      total === 0
        ? 0
        : Math.ceil(total / limit);

    // If requested page is beyond available pages,
    // return empty data instead of throwing an error.
    const validPage =
      totalPages > 0
        ? Math.min(page, totalPages)
        : 1;

    const startIndex =
      (validPage - 1) * limit;

    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + limit
    );

    // ============================================================
    // RESPONSE
    // ============================================================

    return NextResponse.json({
      success: true,

      data: paginatedData,

      pagination: {
        page: validPage,
        limit,

        total,
        totalPages,

        hasNextPage:
          validPage < totalPages,

        hasPreviousPage:
          validPage > 1,
      },

      filters: {
        categories,
        positionTypes,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch applied jobs:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch applied jobs",
      },
      {
        status: 500,
      }
    );
  }
}
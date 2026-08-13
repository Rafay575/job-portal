// lib/utils/groupApplications.ts

import type {
  AppliedJob,
  GroupedUserApplications,
} from "@/types/appliedJobs";

export function groupApplicationsByUser(
  applications: AppliedJob[]
): GroupedUserApplications[] {
  const grouped = new Map<number, GroupedUserApplications>();

  for (const application of applications) {
    const userId = application.user.id;

    if (!grouped.has(userId)) {
      grouped.set(userId, {
        user: application.user,
        applications: [],
        totalApplications: 0,
        latestAppliedAt: application.appliedAt,
      });
    }

    const userGroup = grouped.get(userId)!;

    userGroup.applications.push(application);

    userGroup.totalApplications =
      userGroup.applications.length;

    // Keep latest application date
    if (
      new Date(application.appliedAt).getTime() >
      new Date(userGroup.latestAppliedAt).getTime()
    ) {
      userGroup.latestAppliedAt =
        application.appliedAt;
    }
  }

  // Sort applications INSIDE each user
  for (const group of grouped.values()) {
    group.applications.sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() -
        new Date(a.appliedAt).getTime()
    );
  }

  // Sort users by their latest application
  return Array.from(grouped.values()).sort(
    (a, b) =>
      new Date(b.latestAppliedAt).getTime() -
      new Date(a.latestAppliedAt).getTime()
  );
}
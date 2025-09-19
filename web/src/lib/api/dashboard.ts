import {
  DashboardStats,
  Application,
  CalendarEvent,
  ProgressData,
  Internship,
  RecentActivity
} from "@/types/dashboard";

import { CLIENT_CONFIG } from "@/config/client";

const API_BASE_URL = CLIENT_CONFIG.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

// Dashboard Stats API
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalInternships: 150,
      appliedInternships: 12,
      shortlistedApplications: 3,
      profileCompletion: 85,
    };
  }
}

// Applications API
export async function getApplications(limit = 10): Promise<Application[]> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/applications?limit=${limit}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [
      {
        id: "1",
        internshipId: "int-1",
        internshipTitle: "Full Stack Developer Intern",
        company: "TechCorp India",
        appliedDate: "2025-01-15",
        status: "shortlisted",
        stipend: 25000,
        duration: "6 months",
        location: "Bangalore",
      },
      {
        id: "2",
        internshipId: "int-2",
        internshipTitle: "Data Science Intern",
        company: "Analytics Pro",
        appliedDate: "2025-01-10",
        status: "reviewing",
        stipend: 30000,
        duration: "4 months",
        location: "Mumbai",
      },
    ];
  }
}

// Calendar Events API
export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/calendar/events`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [
      {
        id: "1",
        title: "Technical Interview - TechCorp",
        date: "2025-01-25T10:00:00Z",
        type: "interview",
        description: "Round 2 technical interview for Full Stack Developer position",
        internshipId: "int-1",
      },
      {
        id: "2",
        title: "Application Deadline - StartupXYZ",
        date: "2025-01-30T23:59:59Z",
        type: "deadline",
        description: "Last date to apply for Product Manager Intern",
      },
    ];
  }
}

// Progress Data API
export async function getProgressData(): Promise<ProgressData> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/dashboard/progress`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch progress data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching progress data:', error);
    return {
      applications: [
        { month: "Oct", applied: 8, shortlisted: 2, selected: 0 },
        { month: "Nov", applied: 12, shortlisted: 4, selected: 1 },
        { month: "Dec", applied: 15, shortlisted: 6, selected: 2 },
        { month: "Jan", applied: 10, shortlisted: 3, selected: 1 },
      ],
    };
  }
}

// Recommended Internships API
export async function getRecommendedInternships(limit = 5): Promise<Internship[]> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/internships/recommended?limit=${limit}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recommended internships');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recommended internships:', error);
    return [
      {
        id: "rec-1",
        title: "Frontend Developer Intern",
        company: "WebTech Solutions",
        description: "Work on modern React applications",
        requirements: ["React", "JavaScript", "CSS"],
        skills: ["React", "TypeScript", "Tailwind CSS"],
        stipend: 28000,
        duration: "6 months",
        location: "Remote",
        type: "remote",
        applicationDeadline: "2025-02-15",
        startDate: "2025-03-01",
        isRecommended: true,
        matchPercentage: 92,
      },
    ];
  }
}

// Recent Activity API
export async function getRecentActivity(limit = 10): Promise<RecentActivity[]> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/dashboard/activity?limit=${limit}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recent activity');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [
      {
        id: "1",
        type: "application",
        title: "Applied to Full Stack Developer",
        description: "Your application has been submitted successfully",
        timestamp: "2025-01-15T10:30:00Z",
      },
      {
        id: "2",
        type: "shortlist",
        title: "Shortlisted for Data Science Intern",
        description: "Congratulations! You've been shortlisted for the next round",
        timestamp: "2025-01-14T15:45:00Z",
      },
    ];
  }
}

// Helper function to get auth token (implement based on your auth system)
function getAuthToken(): string {
  // This should be implemented based on your authentication system
  // For now, returning empty string as placeholder
  return '';
}

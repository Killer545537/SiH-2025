import {
  DashboardStats,
  Application,
  CalendarEvent,
  ProgressData,
  Internship,
  RecentActivity
} from "@/types/dashboard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Dashboard Stats API
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return mock data as fallback
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
    const response = await fetch(`${API_BASE_URL}/api/applications?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching applications:', error);
    // Return mock data as fallback
    return [
      {
        id: "1",
        internshipId: "int-1",
        internshipTitle: "Full Stack Developer Intern",
        company: "TechCorp India",
        appliedDate: "2024-01-15",
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
        appliedDate: "2024-01-10",
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
    const response = await fetch(`${API_BASE_URL}/api/calendar/events`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    // Return mock data as fallback
    return [
      {
        id: "1",
        title: "Technical Interview - TechCorp",
        date: "2024-01-25T10:00:00Z",
        type: "interview",
        description: "Round 2 technical interview for Full Stack Developer position",
        internshipId: "int-1",
      },
      {
        id: "2",
        title: "Application Deadline - StartupXYZ",
        date: "2024-01-30T23:59:59Z",
        type: "deadline",
        description: "Last date to apply for Product Manager Intern",
      },
    ];
  }
}

// Progress Data API
export async function getProgressData(): Promise<ProgressData> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/progress`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch progress data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching progress data:', error);
    // Return mock data as fallback
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
    const response = await fetch(`${API_BASE_URL}/api/internships/recommended?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recommended internships');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recommended internships:', error);
    // Return mock data as fallback
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
        applicationDeadline: "2024-02-15",
        startDate: "2024-03-01",
        isRecommended: true,
        matchPercentage: 92,
      },
    ];
  }
}

// Recent Activity API
export async function getRecentActivity(limit = 10): Promise<RecentActivity[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/activity?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recent activity');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    // Return mock data as fallback
    return [
      {
        id: "1",
        type: "application",
        title: "Applied to Full Stack Developer",
        description: "Your application has been submitted successfully",
        timestamp: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        type: "shortlist",
        title: "Shortlisted for Data Science Intern",
        description: "Congratulations! You've been shortlisted for the next round",
        timestamp: "2024-01-14T15:45:00Z",
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

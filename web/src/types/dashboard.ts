// Types for dashboard data
export interface DashboardStats {
  totalInternships: number;
  appliedInternships: number;
  shortlistedApplications: number;
  profileCompletion: number;
}

export interface Application {
  id: string;
  internshipId: string;
  internshipTitle: string;
  company: string;
  appliedDate: string;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'rejected' | 'selected';
  stipend: number;
  duration: string;
  location: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  stipend: number;
  duration: string;
  location: string;
  type: 'remote' | 'onsite' | 'hybrid';
  applicationDeadline: string;
  startDate: string;
  isRecommended: boolean;
  matchPercentage?: number;
}

export interface RecentActivity {
  id: string;
  type: 'application' | 'shortlist' | 'recommendation' | 'profile_update';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'interview' | 'deadline' | 'start_date' | 'assessment';
  description?: string;
  internshipId?: string;
}

export interface ProgressData {
  applications: Array<{
    month: string;
    applied: number;
    shortlisted: number;
    selected: number;
  }>;
}

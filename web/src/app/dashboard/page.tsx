"use client";

import { useEffect, useState } from "react";
import {
  DashboardStats,
  Application,
  CalendarEvent,
  ProgressData,
  Internship,
  RecentActivity
} from "@/types/dashboard";
import {
  getDashboardStats,
  getApplications,
  getCalendarEvents,
  getProgressData,
  getRecommendedInternships,
  getRecentActivity,
} from "@/lib/api/dashboard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ApplicationsTable } from "@/components/dashboard/ApplicationsTable";
import { Calendar } from "@/components/dashboard/Calendar";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { UserNav } from "@/components/dashboard/UserNav";
import { ModeToggle } from "@/components/dashboard/ModeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  FileText,
  CheckCircle,
  TrendingUp,
  Star,
  Clock,
  MapPin,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

// Mock user data
const mockUser = {
  displayName: 'John Doe',
  primaryEmail: 'john.doe@example.com',
};

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [recommendedInternships, setRecommendedInternships] = useState<Internship[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [
          statsData,
          applicationsData,
          eventsData,
          progressDataResult,
          recommendedData,
          activityData,
        ] = await Promise.all([
          getDashboardStats(),
          getApplications(5),
          getCalendarEvents(),
          getProgressData(),
          getRecommendedInternships(3),
          getRecentActivity(5),
        ]);

        setStats(statsData);
        setApplications(applicationsData);
        setEvents(eventsData);
        setProgressData(progressDataResult);
        setRecommendedInternships(recommendedData);
        setRecentActivity(activityData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Remove user dependency - always fetch data
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block w-64 bg-card border-r">
          <div className="p-6">
            <h2 className="text-lg font-semibold">PM Internship</h2>
          </div>
          <div className="px-4 pb-4">
            <DashboardNav />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-card border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {mockUser.displayName || "Student"}!
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ModeToggle />
                <UserNav />
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Total Internships"
                value={stats?.totalInternships || 0}
                description="Available opportunities"
                icon={Users}
                trend={{ value: 12, isPositive: true }}
              />
              <DashboardCard
                title="Applied"
                value={stats?.appliedInternships || 0}
                description="Applications submitted"
                icon={FileText}
                trend={{ value: 8, isPositive: true }}
              />
              <DashboardCard
                title="Shortlisted"
                value={stats?.shortlistedApplications || 0}
                description="Moving to next round"
                icon={CheckCircle}
                trend={{ value: 25, isPositive: true }}
              />
              <DashboardCard
                title="Profile Complete"
                value={`${stats?.profileCompletion || 0}%`}
                description="Complete for better matches"
                icon={TrendingUp}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Applications and Progress */}
              <div className="lg:col-span-2 space-y-6">
                <ApplicationsTable applications={applications} />
                {progressData && <ProgressChart data={progressData} />}
              </div>

              {/* Right Column - Calendar and Recommendations */}
              <div className="space-y-6">
                <Calendar events={events} />

                {/* Recommended Internships */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Recommended for You
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recommendedInternships.map((internship) => (
                      <div
                        key={internship.id}
                        className="p-4 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{internship.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {internship.company}
                            </p>
                          </div>
                          {internship.matchPercentage && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {internship.matchPercentage}% match
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {internship.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {internship.duration}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">₹{internship.stipend.toLocaleString()}/month</span>
                          <Button size="sm" asChild>
                            <Link href={`/internships/${internship.id}`}>
                              View Details
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                    {recommendedInternships.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Complete your profile to get personalized recommendations</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {recentActivity.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                          <p className="text-sm">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Profile Completion Banner */}
            {stats && stats.profileCompletion < 100 && (
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-2">Complete Your Profile</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Complete your profile to get better internship recommendations
                        and increase your chances of selection.
                      </p>
                      <Progress value={stats.profileCompletion} className="w-64" />
                    </div>
                    <Button asChild>
                      <Link href="/profile">Complete Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

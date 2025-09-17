import { Application } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ApplicationsTableProps {
  applications: Application[];
}

const statusColors = {
  applied: "bg-blue-100 text-blue-800",
  reviewing: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  selected: "bg-purple-100 text-purple-800",
};

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium">Internship</th>
                <th className="text-left py-2 px-4 font-medium">Company</th>
                <th className="text-left py-2 px-4 font-medium">Applied Date</th>
                <th className="text-left py-2 px-4 font-medium">Status</th>
                <th className="text-left py-2 px-4 font-medium">Stipend</th>
                <th className="text-left py-2 px-4 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{application.internshipTitle}</div>
                    <div className="text-sm text-muted-foreground">
                      {application.location}
                    </div>
                  </td>
                  <td className="py-3 px-4">{application.company}</td>
                  <td className="py-3 px-4">
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="secondary"
                      className={statusColors[application.status]}
                    >
                      {application.status.charAt(0).toUpperCase() +
                       application.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">₹{application.stipend.toLocaleString()}</td>
                  <td className="py-3 px-4">{application.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No applications yet. Start applying to internships!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
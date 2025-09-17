import { CalendarEvent } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface CalendarProps {
  events: CalendarEvent[];
}

const eventTypeColors = {
  interview: "bg-blue-100 text-blue-800",
  deadline: "bg-red-100 text-red-800",
  start_date: "bg-green-100 text-green-800",
  assessment: "bg-yellow-100 text-yellow-800",
};

const eventTypeIcons = {
  interview: "👥",
  deadline: "⏰",
  start_date: "🚀",
  assessment: "📝",
};

export function Calendar({ events }: CalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50"
            >
              <div className="text-2xl">{eventTypeIcons[event.type]}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className={eventTypeColors[event.type]}
                  >
                    {event.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {new Date(event.date).toLocaleDateString()} at{" "}
                  {new Date(event.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming events</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import ActivityCard from "@/components/ui/activity-card";
import DateFilter from "@/components/ui/date-filter";
import { useQuery } from "@tanstack/react-query";
import { ActivityPost } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isEqual, parseISO } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function Home() {
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const { data: activities, isLoading } = useQuery<ActivityPost[]>({
    queryKey: ["/api/activities"],
  });

  // Filter activities by date if a filter is set
  const filteredActivities = activities && filterDate
    ? activities.filter(activity => {
        // This is a simple approach for demonstration
        // In a real app, we would use proper date parsing and comparison
        try {
          // Try to extract the date part from activity.date regardless of format
          const dateString = activity.date.toLowerCase();
          if (dateString.includes('today') || dateString.includes('hour') || dateString.includes('minute')) {
            // Today's activities
            return isEqual(
              new Date(filterDate).setHours(0, 0, 0, 0),
              new Date().setHours(0, 0, 0, 0)
            );
          } else if (dateString.includes('yesterday')) {
            // Yesterday's activities
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return isEqual(
              new Date(filterDate).setHours(0, 0, 0, 0),
              yesterday.setHours(0, 0, 0, 0)
            );
          } else if (dateString.includes('day')) {
            // "X days ago" format - try to extract the number
            const daysAgo = parseInt(dateString.match(/\d+/)?.[0] || '0');
            if (daysAgo > 0) {
              const pastDate = new Date();
              pastDate.setDate(pastDate.getDate() - daysAgo);
              return isEqual(
                new Date(filterDate).setHours(0, 0, 0, 0),
                pastDate.setHours(0, 0, 0, 0)
              );
            }
          }
          return false;
        } catch (e) {
          return false;
        }
      })
    : activities;

  return (
    <PageContainer title="Home">
      {/* Add Date Filter Component */}
      {activities && activities.length > 0 && (
        <DateFilter 
          activities={activities} 
          onFilterChange={setFilterDate} 
        />
      )}
      
      {/* Filter Active Alert */}
      {filterDate && (
        <Alert className="mb-4 bg-primary/10 border-primary/20">
          <InfoIcon className="h-4 w-4 text-primary" />
          <AlertDescription>
            Showing activities for {format(filterDate, "MMMM d, yyyy")}
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        // Loading skeletons
        Array(3).fill(0).map((_, i) => (
          <div key={i} className="mb-6">
            <Skeleton className="w-full h-48 mb-4" />
            <Skeleton className="w-1/4 h-5 mb-2" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        ))
      ) : filteredActivities && filteredActivities.length > 0 ? (
        filteredActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-neutral-500">
            {filterDate 
              ? "No activities found for the selected date." 
              : "No activities found."}
          </p>
        </div>
      )}
    </PageContainer>
  );
}

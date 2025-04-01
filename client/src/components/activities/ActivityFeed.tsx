import { useState } from 'react';
import { Activity } from '@/lib/types';
import ActivityCard from './ActivityCard';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/Spinner';

interface ActivityFeedProps {
  activities: Activity[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  emptyMessage?: string;
}

export default function ActivityFeed({ 
  activities, 
  isLoading = false, 
  hasMore = false, 
  onLoadMore, 
  emptyMessage = "No activities to display" 
}: ActivityFeedProps) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const handleLoadMore = async () => {
    if (onLoadMore && !isLoadingMore) {
      setIsLoadingMore(true);
      await onLoadMore();
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map(activity => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
      
      {hasMore && (
        <div className="flex justify-center pt-2 pb-6">
          <Button 
            variant="outline" 
            onClick={handleLoadMore} 
            disabled={isLoadingMore}
            className="w-full max-w-xs"
          >
            {isLoadingMore ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

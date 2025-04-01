import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { Activity, Child } from '@/lib/types';
import ActivityFeed from '@/components/activities/ActivityFeed';
import QuickLinks from '@/components/common/QuickLinks';
import { School } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import TCApi from '@/lib/api-service';
import { useToast } from '@/hooks/use-toast';
import Spinner from '@/components/ui/Spinner';

export default function ChildProfile() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [child, setChild] = useState<Child | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Quick links specific to a child
  const quickLinks = [
    { id: '1', title: 'Reports', icon: 'assignment', url: `/child/${id}/reports` },
    { id: '2', title: 'Gallery', icon: 'photo_library', url: `/child/${id}/gallery` },
    { id: '3', title: 'Notes', icon: 'note', url: `/child/${id}/notes` },
    { id: '4', title: 'Goals', icon: 'flag', url: `/child/${id}/goals` },
  ];
  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, use the TCApi
        // const childData = await TCApi.getChildById(parseInt(id));
        // const activitiesData = await TCApi.getActivities({ child_id: parseInt(id) });
        
        // For now, using sample data
        const sampleChild: Child = {
          id: parseInt(id),
          firstName: 'Cecilia',
          nickname: 'Cece',
          lastName: 'Emanuele',
          fullName: 'Cecilia (Cece) Emanuele',
          avatar: 'https://dhabtygr2920s.cloudfront.net/webpack/images/missing_small_square-e98270b89d59a1b93d02f8502ec70e46.png',
          classroom: {
            id: 30873,
            name: 'Cedars C',
            teacher: 'Miss Samantha'
          }
        };
        
        const sampleActivities: Activity[] = [
          {
            id: 1,
            title: 'Working on Knobbed Cylinders',
            description: 'Cecilia (Cece) E working on assembling the Knobbed Cylinders job. -Miss Samantha',
            date: '2023-03-31T12:00:00Z',
            className: 'Cedars C',
            teacher: 'Miss Samantha',
            imageUrl: 'https://source.unsplash.com/random/800x600/?montessori,education',
            likes: 2,
            comments: 0,
            childId: parseInt(id)
          },
          {
            id: 2,
            title: 'Outdoor Playtime',
            description: 'Group play at the playground during outdoor time. Cecilia enjoyed playing on the slide with her friends.',
            date: '2023-03-31T14:30:00Z',
            className: 'Cedars C',
            teacher: 'Miss Elizabeth',
            imageUrl: 'https://source.unsplash.com/random/800x600/?playground,children',
            likes: 3,
            comments: 1,
            childId: parseInt(id)
          }
        ];
        
        setChild(sampleChild);
        setActivities(sampleActivities);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error loading data',
          description: 'Could not load child profile or activities',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, toast]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error state
  if (!child) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-red-500">Child not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Child profile header */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">{child.fullName}</h1>
        <div className="flex items-center mt-1 text-sm text-gray-600">
          <School className="h-3.5 w-3.5 mr-1" />
          {child.classroom?.name}
        </div>
      </div>
      
      {/* Child's activities */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Activities</h2>
        <ActivityFeed 
          activities={activities} 
          isLoading={false} 
          hasMore={false}
          emptyMessage={`No activities available for ${child.firstName}`}
        />
      </div>
      
      {/* Quick links */}
      <QuickLinks links={quickLinks} />
      
      {/* Footer */}
      <footer className="px-4 py-6 mt-4 bg-white border-t border-gray-200">
        <div className="text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Transparent Classroom</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/terms">
              <a className="text-gray-500 hover:text-primary">Terms</a>
            </Link>
            <Link href="/privacy">
              <a className="text-gray-500 hover:text-primary">Privacy</a>
            </Link>
            <Link href="/help">
              <a className="text-gray-500 hover:text-primary">Help</a>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

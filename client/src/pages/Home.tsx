import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Activity, Child, QuickLink } from '@/lib/types';
import ActivityFeed from '@/components/activities/ActivityFeed';
import QuickLinks from '@/components/common/QuickLinks';
import { useAuth } from '@/hooks/use-auth';
import TCApi from '@/lib/api-service';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Sample quick links
  const quickLinks: QuickLink[] = [
    { id: '1', title: 'Progress Reports', icon: 'description', url: '/reports' },
    { id: '2', title: 'Schedule', icon: 'event', url: '/schedule' },
    { id: '3', title: 'Messages', icon: 'message', url: '/messages' },
    { id: '4', title: 'Gallery', icon: 'photo_library', url: '/gallery' },
  ];
  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, use the TCApi
        // const activitiesData = await TCApi.getActivities();
        // const childrenData = await TCApi.getChildren();
        
        // For demonstration purposes, using sample data
        const sampleData: Activity[] = [
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
            childId: 708743
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
            childId: 708743
          }
        ];
        
        // Sample children data
        const sampleChildren: Child[] = [
          {
            id: 708743,
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
          }
        ];
        
        setActivities(sampleData);
        setChildren(sampleChildren);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error loading data',
          description: 'Could not load activities or children',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  return (
    <div className="min-h-full">
      {/* Welcome section */}
      <div className="px-4 py-5 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome {user ? `, ${user.firstName}` : ' to Transparent Classroom'}
        </h1>
        <p className="text-gray-600 mt-1">
          Your child's learning journey at your fingertips
        </p>
      </div>
      
      {/* Children section (if multiple) */}
      {children.length > 1 && (
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Your Children</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {children.map(child => (
              <Link key={child.id} href={`/child/${child.id}`}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    {child.avatar ? (
                      <img src={child.avatar} alt={child.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                        {child.firstName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="mt-1 text-sm font-medium text-center">
                    {child.firstName}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Recent activities */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Recent Activities</h2>
        <ActivityFeed 
          activities={activities} 
          isLoading={isLoading} 
          hasMore={false}
          emptyMessage="No recent activities to display. Check back soon!"
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

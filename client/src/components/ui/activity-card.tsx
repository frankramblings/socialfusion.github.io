import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MoreVertical, Download, Share, Maximize } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActivityPost } from "@/lib/types";

interface ActivityCardProps {
  activity: ActivityPost;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  // Function to download the image
  const downloadImage = () => {
    if (!activity.imageUrl) return;
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = activity.imageUrl;
    
    // Extract a filename from the classroom and date
    const cleanDate = activity.date.replace(/[^\w]/g, '_');
    const fileName = `${activity.classroom.replace(/\s+/g, '_')}_${cleanDate}.jpg`;
    
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to open the image in full size in a new tab
  const viewFullImage = () => {
    if (activity.imageUrl) {
      window.open(activity.imageUrl, '_blank');
    }
  };
  
  // Function to share the activity (simplified)
  const shareActivity = () => {
    if (navigator.share) {
      navigator.share({
        title: `Activity from ${activity.classroom}`,
        text: activity.content.replace(/<[^>]*>/g, ''),
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      // Copy a link to the clipboard
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard');
    }
  };

  return (
    <Card className="mb-6 overflow-hidden">
      {activity.imageUrl && (
        <div className="relative">
          <img 
            src={activity.imageUrl} 
            className="w-full h-48 object-cover" 
            alt="Activity" 
          />
          <div className="absolute top-2 right-2 flex gap-2">
            {/* Download Button */}
            <Button 
              size="icon"
              variant="ghost" 
              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
              onClick={downloadImage}
              title="Download Image"
            >
              <Download className="h-5 w-5 text-neutral-600" />
            </Button>
            
            {/* Menu Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="icon"
                  variant="ghost" 
                  className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                >
                  <MoreVertical className="h-5 w-5 text-neutral-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={downloadImage}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={viewFullImage}>
                  <Maximize className="h-4 w-4 mr-2" />
                  View Full Size
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareActivity}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
      
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center">
          <span className="font-medium">{activity.classroom}</span>
          <span className="text-sm text-neutral-500 ml-2">{activity.date}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="mb-2" dangerouslySetInnerHTML={{ __html: activity.content }}></p>
      </CardContent>
      
      {activity.comments && activity.comments.length > 0 && (
        <CardFooter className="bg-neutral-50 p-3 border-t border-neutral-100">
          {activity.comments.map((comment, index) => (
            <div key={index} className="flex items-start mb-2 last:mb-0">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={comment.authorImage} />
                <AvatarFallback>{comment.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-baseline">
                  <span className="font-medium text-sm">{comment.author}</span>
                  <span className="text-xs text-neutral-500 ml-2">{comment.date}</span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}

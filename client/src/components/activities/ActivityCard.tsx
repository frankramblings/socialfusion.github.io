import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, MoreVertical } from 'lucide-react';
import { Activity } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(activity.likes);
  
  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md active:scale-[0.98]">
      {activity.imageUrl && (
        <div className="w-full h-48 bg-gray-100 relative">
          <img 
            src={activity.imageUrl} 
            alt={activity.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="p-4 pb-0 flex flex-row justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{activity.title}</h3>
          <p className="text-sm text-gray-600">
            {formatDate(activity.date)} • {activity.className}
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Save</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="text-gray-700">{activity.description}</p>
        
        <div className="mt-3 text-xs text-gray-500">
          Teacher: {activity.teacher}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center text-xs px-2 ${liked ? 'text-primary' : 'text-gray-600'}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-3.5 w-3.5 mr-1" />
            {likeCount > 0 ? likeCount : 'Like'}
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-xs px-2 text-gray-600"
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1" />
          {activity.comments > 0 ? activity.comments : 'Comment'}
        </Button>
      </CardFooter>
    </Card>
  );
}

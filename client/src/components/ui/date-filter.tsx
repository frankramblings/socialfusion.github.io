import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Camera } from "lucide-react";
import { format, isEqual, parseISO } from "date-fns";
import { ActivityPost } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DateFilterProps {
  activities: ActivityPost[];
  onFilterChange: (date: Date | undefined) => void;
}

export default function DateFilter({ activities, onFilterChange }: DateFilterProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onFilterChange(selectedDate);
  };
  
  // Function to filter activities by the selected date
  const getActivitiesOnDate = () => {
    if (!date) return [];
    
    // Filter activities by date
    return activities.filter(activity => {
      // This is a simple approach for demonstration
      // In a real app, we would use proper date parsing and comparison
      try {
        // Try to extract the date part from activity.date regardless of format
        const dateString = activity.date.toLowerCase();
        if (dateString.includes('today') || dateString.includes('hour') || dateString.includes('minute')) {
          // Today's activities
          return isEqual(
            new Date(date).setHours(0, 0, 0, 0),
            new Date().setHours(0, 0, 0, 0)
          );
        } else if (dateString.includes('yesterday')) {
          // Yesterday's activities
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          return isEqual(
            new Date(date).setHours(0, 0, 0, 0),
            yesterday.setHours(0, 0, 0, 0)
          );
        } else if (dateString.includes('day')) {
          // "X days ago" format - try to extract the number
          const daysAgo = parseInt(dateString.match(/\d+/)?.[0] || '0');
          if (daysAgo > 0) {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - daysAgo);
            return isEqual(
              new Date(date).setHours(0, 0, 0, 0),
              pastDate.setHours(0, 0, 0, 0)
            );
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    });
  };
  
  // Function to download images to camera roll (web implementation)
  const handleSaveToCamera = async () => {
    if (!date) return;
    
    setIsDownloading(true);
    
    try {
      // Get activities for the selected date
      const activitiesOnDate = getActivitiesOnDate();
      
      // Collect all image URLs from matching activities
      const imageUrls = activitiesOnDate
        .filter(activity => activity.imageUrl)
        .map(activity => activity.imageUrl as string);
      
      if (imageUrls.length === 0) {
        alert("No images found for the selected date");
        setIsDownloading(false);
        return;
      }
      
      // On a real mobile device with a native app, we would use platform-specific
      // APIs to save directly to the camera roll. For web, we'll use the File System
      // Access API if supported, or fall back to standard downloads.
      
      if ('showSaveFilePicker' in window) {
        // Using modern File System Access API (Chrome, Edge)
        const options = {
          suggestedName: `Classroom_Photos_${format(date, 'yyyy-MM-dd')}.zip`,
          types: [{
            description: 'ZIP Archive',
            accept: {'application/zip': ['.zip']}
          }]
        };
        
        alert("Your photos are being prepared for download. Select a location to save them.");
        
        // In a real app, we would create a ZIP file containing all images
        // For the demo, we'll just download them individually
        for (const url of imageUrls) {
          const link = document.createElement('a');
          link.href = url;
          const fileName = `photo_${imageUrls.indexOf(url) + 1}_${format(date, 'yyyy-MM-dd')}.jpg`;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } else {
        // Fallback for browsers without File System Access API
        alert(`Downloading ${imageUrls.length} photos to your device. These will be saved to your downloads folder.`);
        
        for (const url of imageUrls) {
          const link = document.createElement('a');
          link.href = url;
          const fileName = `photo_${imageUrls.indexOf(url) + 1}_${format(date, 'yyyy-MM-dd')}.jpg`;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      alert(`${imageUrls.length} photos have been downloaded. On a real mobile app, these would be saved directly to your camera roll.`);
    } catch (error) {
      console.error('Error downloading images:', error);
      alert('There was an error downloading the images. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Filter by date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      {date && (
        <Button 
          variant="primary"
          className="gap-2"
          onClick={handleSaveToCamera}
          disabled={isDownloading}
        >
          <Camera className="h-4 w-4" />
          <span>Save All to Camera Roll</span>
        </Button>
      )}
      
      {date && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleDateSelect(undefined)}
          className="text-xs"
        >
          Clear filter
        </Button>
      )}
    </div>
  );
}
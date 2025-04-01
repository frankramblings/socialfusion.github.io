import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { copyToClipboard, generateBookmarkletCode } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface InstallInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallInstructions({ isOpen, onClose }: InstallInstructionsProps) {
  const { isIOS } = useMobile();
  const { toast } = useToast();
  
  const baseUrl = window.location.origin;
  const bookmarkletCode = generateBookmarkletCode(baseUrl);
  
  const handleCopyBookmarklet = async () => {
    const success = await copyToClipboard(bookmarkletCode);
    if (success) {
      toast({
        title: "Copied!",
        description: "Bookmarklet code copied to clipboard.",
      });
    } else {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Install Transparent Classroom</DialogTitle>
          <DialogDescription>
            Choose your preferred installation method
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={isIOS ? "pwa-ios" : "pwa-android"} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="pwa">Add to Home</TabsTrigger>
            <TabsTrigger value="bookmarklet">Bookmarklet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pwa" className="space-y-4 mt-4">
            <h3 className="font-medium">Install as App (Recommended)</h3>
            {isIOS ? (
              <ol className="list-decimal ml-5 space-y-2 text-sm">
                <li>Tap the <span className="px-1 py-0.5 bg-gray-100 rounded text-xs">Share</span> button</li>
                <li>Scroll down and tap <b>Add to Home Screen</b></li>
                <li>Tap <b>Add</b> in the upper right corner</li>
              </ol>
            ) : (
              <ol className="list-decimal ml-5 space-y-2 text-sm">
                <li>Tap the menu (three dots) in your browser</li>
                <li>Select <b>Install app</b> or <b>Add to Home Screen</b></li>
                <li>Follow the on-screen instructions</li>
              </ol>
            )}
            <div className="bg-yellow-50 p-3 rounded-md text-sm">
              <p className="text-yellow-800">
                After installation, the app will be available on your home screen for quick access.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="bookmarklet" className="space-y-4 mt-4">
            <h3 className="font-medium">Using Bookmarklet</h3>
            <p className="text-sm text-gray-600">
              A bookmarklet allows you to enhance the Transparent Classroom website with a single tap.
            </p>
            
            <ol className="list-decimal ml-5 space-y-2 text-sm">
              <li>Copy the bookmarklet code below</li>
              <li>Create a new bookmark in your browser</li>
              <li>Paste the code as the URL</li>
              <li>Name it "TC Mobile" or similar</li>
              <li>Save the bookmark</li>
              <li>When visiting Transparent Classroom, tap the bookmark to enhance the interface</li>
            </ol>
            
            <div className="relative">
              <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                {bookmarkletCode}
              </pre>
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute top-1 right-1" 
                onClick={handleCopyBookmarklet}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

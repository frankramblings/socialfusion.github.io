import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMobile } from '@/hooks/use-mobile';
import { ChevronLeft, Copy, Share2, PlusCircle, BookMarked } from 'lucide-react';
import { copyToClipboard, generateBookmarkletCode } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function InstallPage() {
  const { isIOS } = useMobile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(isIOS ? 'ios' : 'android');
  
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
    <div className="container mx-auto px-4 py-6 max-w-md">
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        
        <h1 className="text-2xl font-bold">Install Transparent Classroom</h1>
        <p className="text-gray-600 mt-1">
          Choose your preferred installation method
        </p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="pwa">Add to Home Screen</TabsTrigger>
          <TabsTrigger value="bookmarklet">Bookmarklet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pwa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Install as App</CardTitle>
              <CardDescription>
                Get the best experience by installing as a home screen app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isIOS ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                        <span>1</span>
                      </div>
                      <div>
                        <p>Tap the <Share2 className="inline h-4 w-4 mx-1" /> share button in your browser</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                        <span>2</span>
                      </div>
                      <div>
                        <p>Scroll down and tap <strong>Add to Home Screen</strong></p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                        <span>3</span>
                      </div>
                      <div>
                        <p>Tap <strong>Add</strong> in the upper right corner</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                        <span>1</span>
                      </div>
                      <div>
                        <p>Tap the menu (three dots) in your browser</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                        <span>2</span>
                      </div>
                      <div>
                        <p>Select <strong>Install app</strong> or <strong>Add to Home Screen</strong></p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                        <span>3</span>
                      </div>
                      <div>
                        <p>Follow the on-screen instructions</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800">
                  After installation, you can access the app directly from your home screen without opening the browser.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <PlusCircle className="h-5 w-5 text-primary" />
                <p className="text-sm">Enjoy a native app-like experience!</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookmarklet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Install as Bookmarklet</CardTitle>
              <CardDescription>
                Enhance Transparent Classroom with a single tap
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <span>1</span>
                  </div>
                  <div>
                    <p>Copy the bookmarklet code below</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2" 
                      onClick={handleCopyBookmarklet}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Copy Code
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <span>2</span>
                  </div>
                  <div>
                    <p>Create a new bookmark in your browser</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <span>3</span>
                  </div>
                  <div>
                    <p>Paste the code as the URL</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <span>4</span>
                  </div>
                  <div>
                    <p>Name it "TC Mobile" or something similar</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <span>5</span>
                  </div>
                  <div>
                    <p>When visiting Transparent Classroom, tap the bookmark to enhance the interface</p>
                  </div>
                </div>
              </div>
              
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
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <BookMarked className="h-5 w-5 text-primary" />
                <p className="text-sm">Works on any device with bookmarks!</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

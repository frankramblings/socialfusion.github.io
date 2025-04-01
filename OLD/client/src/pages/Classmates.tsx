import PageContainer from "@/components/layout/PageContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Child } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

export default function Classmates() {
  const [, navigate] = useLocation();
  
  const { data: classmates, isLoading } = useQuery<Child[]>({
    queryKey: ["/api/classmates"],
  });

  const handleChildClick = (id: number) => {
    navigate(`/child/${id}`);
  };

  return (
    <PageContainer title="Classmates">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading skeletons
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : classmates && classmates.length > 0 ? (
          classmates.map((child) => (
            <Card 
              key={child.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleChildClick(child.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={child.avatarUrl} alt={child.firstName} />
                    <AvatarFallback>{child.firstName[0]}{child.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{child.firstName} {child.lastName}</h3>
                    <p className="text-sm text-neutral-500">{child.classroom}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 col-span-full">
            <p className="text-neutral-500">No classmates found.</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

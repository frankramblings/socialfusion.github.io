import PageContainer from "@/components/layout/PageContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Contact } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";

export default function Directory() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: contacts, isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/directory"],
  });

  const filteredContacts = contacts?.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer title="Directory">
      <div className="mb-6">
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array(5).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex gap-3 mt-3 sm:mt-0">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredContacts && filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <Card key={contact.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="text-sm text-neutral-500">{contact.role}</p>
                  </div>
                  <div className="flex gap-3 mt-3 sm:mt-0">
                    {contact.email && (
                      <a 
                        href={`mailto:${contact.email}`} 
                        className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20"
                      >
                        <Mail className="h-5 w-5 text-primary" />
                      </a>
                    )}
                    {contact.phone && (
                      <a 
                        href={`tel:${contact.phone}`} 
                        className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20"
                      >
                        <Phone className="h-5 w-5 text-primary" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-500">No contacts found matching your search.</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

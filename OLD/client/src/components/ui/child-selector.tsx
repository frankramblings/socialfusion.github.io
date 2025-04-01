import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useState } from "react";

export default function ChildSelector() {
  const [, navigate] = useLocation();
  const [currentChild, setCurrentChild] = useState("708743");
  
  const handleChildChange = (value: string) => {
    setCurrentChild(value);
    navigate(`/child/${value}`);
  };

  return (
    <div className="flex items-center px-4 py-2 bg-primary-light text-white">
      <div className="flex-1">
        <Select
          value={currentChild}
          onValueChange={handleChildChange}
        >
          <SelectTrigger className="bg-primary text-white border-primary-dark focus:ring-white">
            <SelectValue placeholder="Select a child" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="708743">Cecilia (Cece)</SelectItem>
            {/* Additional children would be added here */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

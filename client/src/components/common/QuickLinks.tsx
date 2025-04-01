import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { QuickLink } from "@/lib/types";

interface QuickLinksProps {
  links: QuickLink[];
}

export default function QuickLinks({ links }: QuickLinksProps) {
  return (
    <div className="px-4 py-5 mt-2 bg-gray-50">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Quick Links</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {links.map(link => (
          <Link key={link.id} href={link.url}>
            <Card className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center justify-center hover:shadow cursor-pointer transition-shadow">
              <span className="material-icons text-primary mb-2">{link.icon}</span>
              <span className="text-sm font-medium text-gray-700 text-center">{link.title}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
}

export default function PageContainer({ children, title }: PageContainerProps) {
  return (
    <main className="container mx-auto px-4 py-4 pb-20 md:pb-6">
      {title && (
        <section className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <h1 className="text-2xl font-medium mb-2 md:mb-0 md:mr-4">{title}</h1>
          </div>
          <div className="h-1 bg-neutral-300 w-full mt-2 mb-4 rounded"></div>
        </section>
      )}
      {children}
    </main>
  );
}

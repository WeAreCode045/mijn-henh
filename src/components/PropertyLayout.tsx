
import { Suspense } from "react";
import { AppSidebar } from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-estate-800"></div>
  </div>
);

export const PropertyLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className={`flex-1 ${isMobile ? 'p-3' : 'p-4'} overflow-x-hidden`}>
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}


import { Suspense } from "react";
import { AppSidebar } from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Spinner } from "@/components/ui/spinner";

export const PropertyLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className={`flex-1 ${isMobile ? 'p-3' : 'p-4'} overflow-x-hidden`}>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Spinner className="h-8 w-8 border-2" />
          </div>
        }>
          {children}
        </Suspense>
      </main>
    </div>
  );
}

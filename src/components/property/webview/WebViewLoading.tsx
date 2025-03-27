
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

interface WebViewLoadingProps {
  isDialog?: boolean;
}

export function WebViewLoading({ isDialog = false }: WebViewLoadingProps) {
  return (
    <div className={`${isDialog ? "" : "min-h-screen"} bg-white flex flex-col items-center justify-center p-4`}>
      <div className="flex justify-center mb-4">
        <Spinner className="h-8 w-8 border-2" />
      </div>
      <div className="max-w-md w-full space-y-4">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
}


import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function WebViewLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <LoadingSpinner size={40} />
      <p className="mt-4 text-gray-600">Loading property details...</p>
    </div>
  );
}

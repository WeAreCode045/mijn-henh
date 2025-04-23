
import { Spinner } from "@/components/ui/spinner";

export function WebViewLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Spinner className="h-10 w-10" />
      <p className="mt-4 text-gray-600">Loading property details...</p>
    </div>
  );
}

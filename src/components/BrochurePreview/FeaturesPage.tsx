
import { Card } from "@/components/ui/card";
import { PropertyFeature } from "@/types/property";

interface FeaturesPageProps {
  features: PropertyFeature[];
  address?: string;
}

export function FeaturesPage({ features, address }: FeaturesPageProps) {
  if (features.length === 0) return null;

  return (
    <Card className="w-full bg-white shadow-lg animate-fadeIn mb-8 p-6">
      <h3 className="text-xl font-semibold text-estate-700 mb-4">Kenmerken</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex items-center p-3 bg-estate-50 rounded-lg"
          >
            <div className="w-2 h-2 bg-estate-400 rounded-full mr-3"></div>
            <span className="text-estate-600">{feature.description}</span>
          </div>
        ))}
      </div>
      
      {address && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-estate-700 mb-4">Buurt</h3>
          <div className="w-full h-[300px] rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}`}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </Card>
  );
}

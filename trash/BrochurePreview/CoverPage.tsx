
import { Card } from "@/components/ui/card";
import { PropertyData } from "@/types/property";
import { Zap } from "lucide-react";

interface CoverPageProps {
  data: PropertyData;
  agencySettings: any;
  agencyLogo: string;
}

export function CoverPage({ data, agencySettings, agencyLogo }: CoverPageProps) {
  return (
    <Card className="w-full bg-white shadow-lg animate-fadeIn mb-8">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b">
        {agencyLogo && (
          <img
            src={agencyLogo}
            alt="Agency Logo"
            className="h-12 object-contain"
          />
        )}
        <h1 className="text-3xl font-bold text-estate-800">BROCHURE</h1>
        {agencySettings && (
          <div className="text-right text-sm space-y-1">
            <p className="font-bold flex items-center justify-end gap-2">
              <span>{agencySettings.phone}</span>
              <span className="text-estate-600">📞</span>
            </p>
            <p className="font-bold flex items-center justify-end gap-2">
              <span>{agencySettings.email}</span>
              <span className="text-estate-600">✉️</span>
            </p>
            <p className="font-bold flex items-center justify-end gap-2">
              <span>{agencySettings.address}</span>
              <span className="text-estate-600">📍</span>
            </p>
          </div>
        )}
      </div>

      {/* Featured Image */}
      {data.featuredImage && (
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={data.featuredImage}
            alt="Featured"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Grid Images */}
      {data.gridImages && data.gridImages.length > 0 && (
        <div className="grid grid-cols-4 gap-4 p-4">
          {data.gridImages.slice(0, 4).map((image, index) => (
            <div key={index} className="aspect-[4/3] overflow-hidden">
              <img
                src={image}
                alt={`Grid ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Title Footer */}
      <div className="bg-estate-600 text-white p-8">
        <h2 className="text-3xl font-bold mb-4">{data.title}</h2>
        <p className="text-2xl">€ {data.price}</p>
      </div>
    </Card>
  );
}

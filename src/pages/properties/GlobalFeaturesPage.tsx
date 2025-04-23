
import React from "react";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GlobalFeaturesPage = () => {
  const {
    settings,
    handleGlobalFeatureAdd,
    handleGlobalFeatureRemove,
    handleGlobalFeatureBulkUpdate,
    globalFeatures,
  } = useAgencySettings();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Global Features</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Property Global Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Feature Management Section */}
                <div className="space-y-4">
                  <div className="flex flex-col space-y-4">
                    {/* Add Feature Form */}
                    <div className="flex flex-col space-y-2">
                      <h3 className="text-lg font-medium">Add New Feature</h3>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          id="newFeature"
                          placeholder="Enter feature description"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const target = e.target as HTMLInputElement;
                              handleGlobalFeatureAdd(target.value);
                              target.value = '';
                            }
                          }}
                        />
                        <Button
                          onClick={(e) => {
                            const input = document.getElementById('newFeature') as HTMLInputElement;
                            handleGlobalFeatureAdd(input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    
                    {/* Bulk Update Form */}
                    <div className="flex flex-col space-y-2">
                      <h3 className="text-lg font-medium">Bulk Update Features</h3>
                      <div className="flex flex-col space-y-2">
                        <textarea
                          id="bulkFeatures"
                          placeholder="Enter features separated by new lines"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          rows={5}
                        />
                        <Button
                          onClick={(e) => {
                            const textarea = document.getElementById('bulkFeatures') as HTMLTextAreaElement;
                            const featuresText = textarea.value;
                            const featuresList = featuresText.split('\n')
                              .map(feature => feature.trim())
                              .filter(feature => feature.length > 0);
                            handleGlobalFeatureBulkUpdate(featuresList);
                            textarea.value = '';
                          }}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Features List Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Current Features</h3>
                  <div className="border rounded-md divide-y overflow-y-auto max-h-96">
                    {globalFeatures.length === 0 ? (
                      <div className="p-4 text-gray-500 italic">No global features defined</div>
                    ) : (
                      globalFeatures.map((feature) => (
                        <div key={feature.id} className="flex items-center justify-between p-3 hover:bg-gray-50">
                          <span>{feature.description}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleGlobalFeatureRemove(feature.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalFeaturesPage;

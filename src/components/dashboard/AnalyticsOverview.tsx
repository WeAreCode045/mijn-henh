
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformSupabaseData } from "@/components/property/webview/utils/transformSupabaseData";

export function AnalyticsOverview() {
  const { data: viewStats = [] } = useQuery({
    queryKey: ['property-views'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          object_id,
          property_web_views(count)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Most Viewed Properties</h3>
            <div className="space-y-2">
              {viewStats.map((stat) => (
                <div key={stat.id} className="flex items-center justify-between">
                  <span className="text-sm">{stat.title}</span>
                  <span className="text-sm font-medium">
                    {stat.property_web_views?.length || 0} views
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

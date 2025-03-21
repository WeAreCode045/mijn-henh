
import { supabase } from "@/integrations/supabase/client";

export const findValue = (possiblePaths: string[], element: Element): string => {
  for (const path of possiblePaths) {
    const value = path.split("/").reduce((current: Element | null, tag: string) => {
      if (!current) return null;
      const elements = current.getElementsByTagName(tag);
      return elements.length > 0 ? elements[0] : null;
    }, element)?.textContent?.trim();
    
    if (value) return value;
  }
  return "";
};

export const downloadAndStoreImage = async (url: string): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const functionUrl = `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/download-image`;

    console.log('Downloading image from URL:', url);

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ imageUrl: url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to download image: ${errorData.error || response.statusText}`);
    }

    const { publicUrl, error } = await response.json();
    if (error) throw new Error(error);

    console.log('Successfully downloaded and stored image:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error downloading/storing image:', error);
    return null;
  }
};

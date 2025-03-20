
interface EmptyPlacesStateProps {
  message?: string;
}

export function EmptyPlacesState({ 
  message = "No nearby places found. Try fetching location data to discover places near this property." 
}: EmptyPlacesStateProps) {
  return (
    <div className="text-center py-6 border border-dashed rounded-md">
      <p className="text-muted-foreground">
        {message}
      </p>
    </div>
  );
}


interface NoEventsMessageProps {
  isFiltered?: boolean;
}

export function NoEventsMessage({ isFiltered = false }: NoEventsMessageProps) {
  return (
    <div className="text-center py-6 text-muted-foreground">
      {isFiltered 
        ? "No events found for the selected filters"
        : "No upcoming events scheduled"
      }
    </div>
  );
}


import { TitleSection } from "./form/TitleSection";
import { DateTimeSection } from "./form/DateTimeSection";
import { PropertySection } from "./form/PropertySection";
import { UserSelectionSection } from "./form/UserSelectionSection";
import { DescriptionSection } from "./form/DescriptionSection";

interface AgendaDialogFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string | null;
  setDescription: (value: string | null) => void;
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
  time: string;
  setTime: (value: string) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (value: string | null) => void;
  additionalUsers?: string[];
  setAdditionalUsers?: (value: string[]) => void;
  availableUsers?: { id: string; name: string }[];
  usersLoading?: boolean;
}

export function AgendaDialogForm({
  title,
  setTitle,
  description,
  setDescription,
  date,
  setDate,
  time,
  setTime,
  selectedPropertyId,
  setSelectedPropertyId,
  additionalUsers = [],
  setAdditionalUsers = () => {},
  availableUsers = [],
  usersLoading = false
}: AgendaDialogFormProps) {
  
  console.log("AgendaDialogForm - Available users:", availableUsers);
  console.log("AgendaDialogForm - Users loading:", usersLoading);

  return (
    <div className="grid gap-4 py-4">
      <TitleSection 
        title={title} 
        setTitle={setTitle} 
      />
      
      <DateTimeSection 
        date={date}
        setDate={setDate}
        time={time}
        setTime={setTime}
      />

      <PropertySection 
        selectedPropertyId={selectedPropertyId}
        setSelectedPropertyId={setSelectedPropertyId}
      />

      <UserSelectionSection 
        additionalUsers={additionalUsers}
        setAdditionalUsers={setAdditionalUsers}
        availableUsers={availableUsers}
        usersLoading={usersLoading}
      />

      <DescriptionSection 
        description={description}
        setDescription={setDescription}
      />
    </div>
  );
}

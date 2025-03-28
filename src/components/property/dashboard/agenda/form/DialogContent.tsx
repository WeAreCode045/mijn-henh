
import { UserSelectionSection } from "@/components/property/dashboard/agenda/form/UserSelectionSection";
import { TitleSection } from "./TitleSection";
import { DateTimeSection } from "./DateTimeSection";
import { DescriptionSection } from "./DescriptionSection";

interface DialogContentProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  additionalUsers: string[];
  setAdditionalUsers: (users: string[]) => void;
  availableUsers: { id: string; name: string }[];
  usersLoading: boolean;
}

export function AgendaDialogContent({
  title,
  setTitle,
  description,
  setDescription,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  additionalUsers,
  setAdditionalUsers,
  availableUsers,
  usersLoading
}: DialogContentProps) {
  return (
    <div className="grid gap-4 py-4">
      <TitleSection 
        title={title} 
        setTitle={setTitle} 
      />
      
      <DateTimeSection 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        endDate={endDate}
        setEndDate={setEndDate}
        endTime={endTime}
        setEndTime={setEndTime}
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

import { AgendaSection } from "../agenda/AgendaSection";
import { Select, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectValue, SelectGroup, SelectPortal, SelectScrollDownButton, SelectScrollUpButton, SelectViewport } from "@radix-ui/react-select"; // Replace with the correct library if different

export function AgendaTabContent() {
  const agendaItems = []; // Define or fetch agenda items here
  const isLoading = false; // Define the loading state here

  return (
    <>
  <AgendaSection agendaItems={agendaItems} isLoading={isLoading} />
  <Select>
    <SelectTrigger>
      <SelectLabel>Select an option</SelectLabel>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectSeparator />
      <SelectItem value="option2">Option 2</SelectItem>
    </SelectContent>
  </Select>
</>
  );
} 
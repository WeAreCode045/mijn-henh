
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormInputProps {
  type: "text" | "email" | "tel" | "textarea";
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
}

export function FormInput({ 
  type, 
  name, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  rows = 4 
}: FormInputProps) {
  if (type === "textarea") {
    return (
      <Textarea
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
      />
    );
  }

  return (
    <Input
      placeholder={placeholder}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
    />
  );
}

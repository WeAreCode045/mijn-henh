
import { FormStepNavigation } from "../../form/FormStepNavigation";

interface ContentTabNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function ContentTabNavigation({
  currentStep,
  onStepClick,
}: ContentTabNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <FormStepNavigation
        currentStep={currentStep}
        onStepClick={onStepClick}
      />
    </div>
  );
}

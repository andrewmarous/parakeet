import OnboardingForm from "../../Forms/OnboardingForm/OnboardingForm";
import { Card } from "../Base";

export default function OnboardingCard() {
  return (
    <Card className="w-[28rem] p-6" withShadow>
      <OnboardingForm />
    </Card>
  );
}

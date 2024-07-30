import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/app/components/Inputs/InputOTP/InputOTP";
import { Label } from "@/app/components/Inputs/Label/Label";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../Base/Form/Form";
import { Step } from "../../Base/forms.types";
import { OnboardingSchema } from "../OnboardingForm";

const TeacherInfoElement = () => {
  const form = useFormContext<OnboardingSchema>();
  const {
    formState: { errors },
  } = form;

  return (
    <>
      <FormField
        control={form.control}
        name="inviteCode"
        render={({ field }) => (
          <FormItem>
            <Label htmlFor="code">Enter code</Label>
            <FormControl>
              <InputOTP
                {...field}
                maxLength={8}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                render={({ slots }) => (
                  <>
                    <InputOTPGroup>
                      {slots.slice(0, 8).map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} />
                      ))}
                    </InputOTPGroup>
                  </>
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const TeacherInfo: Step<OnboardingSchema> = {
  StepElement: <TeacherInfoElement />,
  title: "Invite Code",
  description: "Please enter your course invite code.",
  needsNavButtons: true,
  validateFields: [],
};

export default TeacherInfo;

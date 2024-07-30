"use client";

import CardRadioGroupItem from "@/app/components/Inputs/CardRadio/CardRadio";
import { Label } from "@/app/components/Inputs/Label/Label";
import RadioGroup from "@/app/components/Inputs/RadioGroup/RadioGroup";
import { useFormContext } from "react-hook-form";
import { PiChalkboardTeacherDuotone, PiStudentDuotone } from "react-icons/pi";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../Base/Form/Form";
import { Step } from "../../Base/forms.types";
import { OnboardingSchema } from "../OnboardingForm";

const AccountTypeElement = () => {
  const form = useFormContext<OnboardingSchema>();

  return (
    <div className="form-elements">
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <Label htmlFor="role">Sign up for Parakeet as a...</Label>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <CardRadioGroupItem
                      value={"teacher"}
                      option={{
                        value: "teacher",
                        label: "Teacher",
                        Icon: (
                          <PiChalkboardTeacherDuotone className="h-5 w-5" />
                        ),
                      }}
                      currentValue={field.value}
                    />
                  </FormControl>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <CardRadioGroupItem
                      value={"student"}
                      option={{
                        value: "student",
                        label: "Student",
                        Icon: <PiStudentDuotone className="h-5 w-5" />,
                      }}
                      currentValue={field.value}
                    />
                  </FormControl>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const AccountType: Step<OnboardingSchema> = {
  StepElement: <AccountTypeElement />,
  title: "Account Type",
  description: "Pick whether you are a teacher or student.",
  needsNavButtons: true,
  validateFields: ["role"],
};

export default AccountType;

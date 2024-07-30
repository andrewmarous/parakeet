"use client";

import useMultiStepForm from "@/app/hooks/useMultiStepForm/useMultiStepForm";
import { DefaultValues } from "react-hook-form";
import { Form } from "../Base/Form/Form";
import MultiFormLayout from "../Base/MultiFormLayout/MultiFormLayout";
import { Step } from "../Base/forms.types";

import { toast } from "@/app/hooks/useToast/useToast";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import onboardStudent from "./actions/onboardStudent";
import onboardTeacher from "./actions/onboardTeacher";
import AccountType from "./steps/AccountType";
import TeacherInfo from "./steps/TeacherInfo";

const UserSchema = z.object({
  role: z.enum(["teacher", "student"], {
    required_error: "You need to select a user type.",
  }),
  inviteCode: z.string().optional(),
});

const defaultValues: DefaultValues<OnboardingSchema> = {
  role: "teacher",
};

export type OnboardingSchema = z.infer<typeof UserSchema>;

export default function OnboardingForm() {
  const { user } = useUser();
  const { push } = useRouter();
  const { isLoaded } = useSignUp();
  const steps: Step<OnboardingSchema>[] = [AccountType, TeacherInfo];
  const [loading, setLoading] = useState(false);

  const {
    next,
    back,
    currentStep,
    isFirstStep,
    isLastStep,
    stepPosition,
    form,
  } = useMultiStepForm<OnboardingSchema>(steps, UserSchema, defaultValues, [
    {
      removeStepIndex: 1,
      condition: (data) => data.role === "student",
    },
  ]);

  if (!isLoaded) return null;

  const submit = async (data: OnboardingSchema) => {
    setLoading(true);
    try {
      if (data.role === "teacher") {
        await onboardTeacher(data);
        if (!user) {
          throw new Error("User not found.");
        }
        const userDetails = await user.reload();
        push("/teacher");
      } else {
        await onboardStudent(data);
        if (!user) {
          throw new Error("User not found.");
        }
        const userDetails = await user.reload();
        push("/student");
      }
    } catch (err: any) {
      handleOnboardingError(err);
    }
    setLoading(false);
  };

  const handleOnboardingError = (err: any) => {
    toast({
      title: "Uh oh!",
      description: "Something went wrong with onboarding.",
      variant: "error",
    });
    console.error("error: ", err);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
        <MultiFormLayout<OnboardingSchema>
          currentStep={currentStep}
          submitButtonText="Finish"
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          stepPosition={stepPosition}
          loading={loading}
          next={next}
          back={back}
          useWideButtons
        />
      </form>
    </Form>
  );
}


import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./InputOTP";

export default {
  title: "Components/InputOTP",
  component: InputOTP,
} as Meta<typeof InputOTP>;

const Template: StoryFn<typeof InputOTP> = (args) => (
  <InputOTP maxLength={6} render={({ slots }) => (
    <>
      <InputOTPGroup>
        {slots.slice(0, 3).map((slot, index) => (
          <InputOTPSlot key={index} {...slot} />
        ))}
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        {slots.slice(3).map((slot, index) => (
          <InputOTPSlot key={index + 3} {...slot} />
        ))}
      </InputOTPGroup>
    </>
  )} />
);

export const Default = Template.bind({});

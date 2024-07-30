import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { InputProps, TextInput } from "./TextInput";

export default {
  title: "Components/TextInput",
  component: TextInput,
} as Meta<typeof TextInput>;

const Template: StoryFn = (args) => (
  <TextInput {...args} />
)

export const Default = {
  render: (args: React.JSX.IntrinsicAttributes & InputProps & React.RefAttributes<HTMLInputElement>) => <TextInput {...args} />,
  args: {
    placeholder: "Type your message here.",
    id: "message",
    error: false,
    valid: false,
    disabled: false,
  }
}

export const Error = {
  render: (args: React.JSX.IntrinsicAttributes & InputProps & React.RefAttributes<HTMLInputElement>) => <TextInput {...args} />,
  args: {
    placeholder: "Type your message here.",
    id: "message",
    error: true,
    valid: false,
    disabled: false,
  }
}

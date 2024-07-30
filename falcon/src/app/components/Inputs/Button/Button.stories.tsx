import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { Button } from "./Button";

export default {
  title: "Components/Button",
  component: Button,
} as Meta<typeof Button>;

const Template: StoryFn = (args) => <Button {...args}>Example Button</Button>;

export const Default = Template.bind({});
Default.args = {
  // Add default props here
  variant: "primary",
  size: "default",
};

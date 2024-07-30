import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { NavigationBar } from "./NavigationBar";

export default {
  title: "Components/NavigationBar",
  component: NavigationBar,
} as Meta<typeof NavigationBar>;

const Template: StoryFn = (args) => <NavigationBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props here
  variant: "primary",
  size: "default",
};

import { Meta, StoryFn } from "@storybook/react";
import { TextArea } from "./TextArea"; // Update this path

export default {
  title: "Components/TextArea",
  component: TextArea,
} as Meta<typeof TextArea>;

const Template: StoryFn = (args) => (
  <TextArea placeholder="Type your message here." id="message" />
);

export const Default = Template.bind({});
Default.args = {
  "aria-label": "Example Textarea Group",
};

// Add more variations as needed

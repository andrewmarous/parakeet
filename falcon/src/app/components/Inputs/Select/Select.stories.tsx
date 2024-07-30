import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./Select";

export default {
  title: "Components/Select",
  component: Select,
} as Meta<typeof Select>;

const Template: StoryFn<typeof Select> = (args) => (
  <Select>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
)

export const Default = Template.bind({});
Default.args = {
  // 'aria-label': 'Example Select',
  // defaultValue: '1'
}
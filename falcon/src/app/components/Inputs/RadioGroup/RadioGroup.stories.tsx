import { Meta, StoryFn } from "@storybook/react";
import { Label } from "../Label/Label";
import { RadioGroup, RadioGroupItem } from "./RadioGroup"; // Update this path

export default {
  title: "Components/RadioGroup",
  component: RadioGroup,
} as Meta;

const Template: StoryFn = (args) => (
  (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Tommy" id="r1" />
        <Label htmlFor="r1">Tommy</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Jgro" id="r2" />
        <Label htmlFor="r2">Jgro</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Zack" id="r3" />
        <Label htmlFor="r3">Zack</Label>
      </div>
    </RadioGroup>
  )
)

export const Default = Template.bind({});
Default.args = {
  "aria-label": "Example Radio Group",
};

import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import AcademicIntegrityBarGraph, { Props } from './AcademicIntegrityBar';

export default {
  title: 'Components/AcademicIntegrityBarGraph',
  component: AcademicIntegrityBarGraph,
} as Meta;

const Template: StoryFn<Props> = (args) => <AcademicIntegrityBarGraph {...args} />;

export const Default = Template.bind({});
Default.args = {
  data: [
    { name: 'Group A', value: 8 },
    { name: 'Group B', value: 3 },
    { name: 'Group C', value: 1 },
  ],
};

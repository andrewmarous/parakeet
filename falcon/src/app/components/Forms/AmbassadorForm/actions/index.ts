"use server";
import Airtable from "airtable";

interface ApplicationSchema {
  name: string;
  email: string;
  school: string;
  grade: string;
  major?: string;
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const updateRecord = async (table: string, data: Airtable.FieldSet) => {
  try {
    const result = await base(table).create([
      {
        fields: data,
      },
    ]);
  } catch (error) {
    console.error(error);
  }
};

export default async function sendApplication(data: ApplicationSchema) {
  // Example usage
  await updateRecord(process.env.AIRTABLE_APPLICATION_TABLE!, {
    Name: data.name,
    Email: data.email,
    School: data.school,
    Grade: data.grade,
    Major: data.major,
    Status: "Applied",
  });
}

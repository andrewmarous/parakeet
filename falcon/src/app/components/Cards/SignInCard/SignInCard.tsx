"use client";

import SignInForm from "../../Forms/SignInForm/SignInForm";
import { Card } from "../Base";

export default function SignInCard() {
  return (
    <Card className="w-96 p-6" withShadow>
      <SignInForm />
    </Card>
  );
}

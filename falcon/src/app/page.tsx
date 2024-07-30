"use client";

import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "./components/Inputs/Button/Button";
import { NavigationBar } from "./components/NavigationBar/NavigationBar";

export default function Home() {
  return (
    <>
      <NavigationBar
        leftElement={
          <Link href={"/"}>
            <Image src={"logo.svg"} alt={"logo"} width={18} height={18} />
          </Link>
        }
        rightElement={
          <div className="flex flex-row gap-8 items-center">
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href="/auth/signin"
            >
              Sign In
            </Link>
            <Link
              className={buttonVariants({ variant: "primary" })}
              href="/auth/signup"
            >
              Sign Up
            </Link>
          </div>
        }
      />
      <div className="background-blur"></div>
      <main className="px-12">
        <div className="m-auto w-[800px] text-center mt-16">
          <p className="px-3 py-2 rounded-xl font-medium border border-blue-400 w-fit mx-auto bg-blue-50 text-blue-700 mb-5 text-sm">
            Sign up to get early access.
          </p>
          <h1 className="text-4xl font-semibold text-primary-600 leading-tight">
            An observability platform for education
          </h1>
          <p className="mt-4 mb-7 text-grey-600">
            Educators turn their course materials into a AI tutor for students,
            and we give key metrics on how students are understanding the
            material.
          </p>
          <div className="flex flex-row gap-4 mx-auto w-fit">
            <Link
              className={buttonVariants({ variant: "primary", size: "lg" })}
              href="/auth/signup"
            >
              Get Started
            </Link>
            <Link
              className={buttonVariants({ variant: "secondary", size: "lg" })}
              href="/ambassador"
            >
              Become an ambassador
            </Link>
          </div>
          <Image
            src={"/demo.png"}
            alt={"demo"}
            width={800}
            height={400}
            className="border border-grey-100 shadow-md rounded-lg mt-10"
          />
        </div>
        {/* <div className="mt-24 mx-auto w-[700px] text-center">
          <h3 className="text-3xl font-medium text-primary">
            Students get instant context-backed responses with sources
          </h3>
        </div> */}
      </main>
      <footer className="border-t border-grey-100 flex flex-row px-12 h-16 justify-between items-center mt-24 bg-grey-25 z-10">
        <Image src={"logo.svg"} alt={"logo"} width={18} height={18} />
        <p className="text-sm text-primary-800">
          Email us at:{" "}
          <a
            href="mailto:founders@tryparakeet.com"
            className="text-blue-500 underline"
          >
            founders@tryparakeet.com
          </a>
        </p>
      </footer>
    </>
  );
}

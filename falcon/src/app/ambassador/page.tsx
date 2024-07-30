"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { MdAutoGraph } from "react-icons/md";
import { PiChalkboardTeacherDuotone } from "react-icons/pi";
import AmbassadorForm from "../components/Forms/AmbassadorForm/AmbassadorForm";
import { buttonVariants } from "../components/Inputs/Button/Button";
import { NavigationBar } from "../components/NavigationBar/NavigationBar";

export default function AmbassadorPage() {
  const { user } = useUser();

  return (
    <>
      <NavigationBar
        leftElement={
          <Link href={"/"}>
            <Image src={"/logo.svg"} alt={"logo"} width={18} height={18} />
          </Link>
        }
        rightElement={
          user ? (
            <></>
          ) : (
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
          )
        }
      />
      <main className="px-12 max-w-[1200px] mx-auto">
        <div className="mt-24 flex flex-col justify-center items-center max-w-[700px] mx-auto">
          <p className="px-3 py-2 rounded-xl font-medium border border-blue-400 w-fit bg-blue-50 text-blue-700 mb-5 text-sm">
            Ambassador Program
          </p>
          <h1 className="text-4xl font-semibold text-primary-600 leading-tight">
            Help Make Learning Easier{" "}
          </h1>
          <p className="mt-5 text-grey-700 leading-6 text-normal text-center">
            Earn money by onboarding your teachers and fellow students in your
            courses to Parakeet. Show your peers how you use Parakeet to help
            you understand course material.
          </p>
          <div className="flex flex-row gap-8 mt-7">
            <div className="flex flex-row items-center">
              <FaCheck className="fill-grey-500 w-4" />
              <p className="ml-2 text-grey-700 text-sm">
                $200 per teacher onboarded
              </p>
            </div>
            <div className="flex flex-row items-center">
              <FaCheck className="fill-grey-500 w-4" />
              <p className="ml-2 text-grey-700 text-sm">
                Experience at a startup
              </p>
            </div>
            <div className="flex flex-row items-center">
              <FaCheck className="fill-grey-500 w-4" />
              <p className="ml-2 text-grey-700 text-sm">
                Bonuses for student onboarding
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <Link
              className={`${buttonVariants({ variant: "primary", size: "lg" })} mt-7`}
              href="#join"
            >
              Join Now
            </Link>
            <Link
              className={`${buttonVariants({ variant: "tertiary", size: "lg" })} mt-7`}
              href="#learn-more"
            >
              Learn more <FaArrowRight />
            </Link>
          </div>
        </div>
        <section className="mt-36" id="learn-more">
          <p className="text-sm font-medium text-blue-500">Requirements</p>
          <p className="font-medium text-xl text-primary-800">
            What do you have to do?
          </p>
          <div className="grid grid-cols-3 gap-16 mt-12">
            <div className="bg-gradient-to-b from-grey-50 to-grey-100 p-6 rounded-lg inset-shadow-transparent border border-grey-200">
              <div className="flex flex-row items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-100 inset-shadow-transparent w-fit rounded-lg">
                <PiChalkboardTeacherDuotone className="fill-blue-800 w-4" />
              </div>
              <p className="text-lg font-medium text-primary-800 mt-4">
                Meet with teachers
              </p>
              <p className="mt-2 text-sm leading-[1.5] text-grey-700">
                After onboarding enough students in your courses, meet with your
                professor to demonstrate how our platform can help them
                understand their class comprehension better.
              </p>
            </div>
            <div className="bg-gradient-to-b from-grey-50 to-grey-100 p-6 rounded-lg inset-shadow-transparent border border-grey-200">
              <div className="flex flex-row items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-100 inset-shadow-transparent w-fit rounded-lg">
                <BsFillPeopleFill className="fill-blue-800 w-4" />
              </div>
              <p className="text-lg font-medium text-primary-800 mt-4">
                Onboard your classmates
              </p>
              <p className="mt-2 text-sm leading-[1.5] text-grey-700">
                Sign up your friends in your class to Parakeet. Collect content
                from courses at your college and upload it to Parakeet.
              </p>
            </div>
            <div className="bg-gradient-to-b from-grey-50 to-grey-100 p-6 rounded-lg inset-shadow-transparent border border-grey-200">
              <div className="flex flex-row items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-100 inset-shadow-transparent w-fit rounded-lg">
                <MdAutoGraph className="fill-blue-800 w-4" />
              </div>
              <p className="text-lg font-medium text-primary-800 mt-4">
                Improve the product
              </p>
              <p className="mt-2 text-sm leading-[1.5] text-grey-700">
                Gain product experience by gathering feedback from your peers
                and teachers and coming up with solutions to build Parakeet.
              </p>
            </div>
          </div>
        </section>
        <section className="mt-36">
          <p className="text-sm font-medium text-blue-500">Background</p>
          <p className="font-medium text-xl text-primary-800">
            What are we looking for?{" "}
            <span className="text-grey-700 text-xs">(It&apos;s not a lot)</span>
          </p>
          <div className="mt-6 ml-14">
            <ol className="list-decimal space-y-4">
              <li className="font-medium text-grey-800">
                You love Parakeet and are currently using it in one or more of
                your classes.
              </li>
              <li className="font-medium text-grey-800">
                You want to help your teachers make learning easier.
              </li>
            </ol>
          </div>
        </section>

        <div
          id="join"
          className="mt-36 max-w-[40rem] mx-auto bg-white border border-grey-200 shadow-sm p-6 rounded-lg"
        >
          <p className="font-medium text-xl text-primary-800 mb-6">Apply now</p>
          <AmbassadorForm />
        </div>
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

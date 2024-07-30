"use client";

import { useEffect } from "react";
import { Oval } from "react-loader-spinner";
import { redirectToTeacherCourse } from "./actions";

export default function TeacherRedirectPage() {
  useEffect(() => {
    const _ = redirectToTeacherCourse();
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Oval
        visible={true}
        height="54"
        width="54"
        color="#313149"
        secondaryColor="rgba(0,0,0,0)"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
      />
    </div>
  );
}

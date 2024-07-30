import { authMiddleware } from "@clerk/nextjs";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Role, type SessionPublicMetadata } from "./types";

const teacherRoute = "/teacher";

const studentRoute = "/student";

const publicAuthRoutes = ["/ambassador"];

export default authMiddleware({
  afterAuth(auth, req, evt) {
    const sessionClaims: SessionPublicMetadata = auth.sessionClaims
      ?.publicMetadata as SessionPublicMetadata;

    if (publicAuthRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.next();
    }

    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // Redirect to onboarding if not completed
    if (
      auth.userId &&
      !sessionClaims.onboarding &&
      req.nextUrl.pathname !== "/auth/onboarding"
    ) {
      const onboardingUrl = new URL("/auth/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl, 308);
    }

    // Redirect to vendor if vendor trying to access non vendor route
    if (
      auth.userId &&
      sessionClaims.role &&
      sessionClaims.role === Role.TEACHER &&
      !req.nextUrl.pathname.startsWith(teacherRoute)
    ) {
      const teacher = new URL("/teacher", req.url);
      return NextResponse.redirect(teacher);
    }

    if (
      auth.userId &&
      sessionClaims.role &&
      sessionClaims.role === Role.STUDENT &&
      !req.nextUrl.pathname.startsWith(studentRoute)
    ) {
      const studentRoute = new URL("/student", req.url);
      return NextResponse.redirect(studentRoute);
    }

    return NextResponse.next();
  },

  publicRoutes: [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/auth/sso-callback",
    "/ambassador",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

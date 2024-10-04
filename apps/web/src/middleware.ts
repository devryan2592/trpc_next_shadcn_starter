import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getUser } from "./actions/auth.actions";

export default async function middleware(req: NextRequest, res: NextResponse) {
  // Check if the user is authenticated
  const accessToken = await getAccessToken();

  if (accessToken) {
    const user = await getUser();

    if (user) {
      console.log("user", user);
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL("/auth/sign-in", req.url));
}

// Auth Pages should be excluded from middleware
export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|favicon.ico).*)"],
};

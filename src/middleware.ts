import { NextRequest, NextResponse } from "next/server"; // Importing Next.js request and response utilities
import { getToken } from "next-auth/jwt"; // Importing function to get authentication token from NextAuth

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request }); // Retrieve user authentication token
  const url = request.nextUrl; // Get the current request URL

  // 🔹 If user is logged in, prevent access to sign-in/sign-up/verify pages
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 🔹 If user is NOT logged in, restrict access to protected routes
  if (
    !token &&
    (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/home"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 🔹 Allow request to proceed normally
  return NextResponse.next();
}

// ✅ Matching paths for middleware
export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/dashboard/:path*",
    "/home",
  ],
};

/* 
  🔑 Key Concepts:
  1️⃣ `getToken({ req })`: Fetches user authentication token from NextAuth.
  2️⃣ Redirect users based on authentication status:
      - Logged-in users can't access sign-in/sign-up pages.
      - Unauthenticated users can't access protected routes.
  3️⃣ `NextResponse.redirect(URL)`: Redirects users to the correct page.
  4️⃣ `NextResponse.next()`: Allows the request to continue if no restriction applies.
  5️⃣ `matcher`: Defines which routes the middleware applies to.
  6️⃣ Essential for securing pages and controlling user navigation dynamically.
*/

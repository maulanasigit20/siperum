import { createServerClient } from "@supabase/ssr";

import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(
  request: NextRequest
) {
  let response = NextResponse.next();

  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,
      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)
              ?.value;
          },

          set(name, value, options) {
            request.cookies.set({
              name,
              value,
              ...options,
            });

            response =
              NextResponse.next({
                request,
              });

            response.cookies.set({
              name,
              value,
              ...options,
            });
          },

          remove(name, options) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            });

            response =
              NextResponse.next({
                request,
              });

            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname =
    request.nextUrl.pathname;

  // PUBLIC ROUTES
  const publicRoutes = [
    "/login",
    "/register",
  ];

  const isPublicRoute =
    publicRoutes.includes(pathname);

  // kalau belum login dan buka protected route
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // kalau sudah login dan buka login/register
  if (user && isPublicRoute) {
    return NextResponse.redirect(
      new URL(
        "/dashboard",
        request.url
      )
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|uploads).*)",
  ],
};
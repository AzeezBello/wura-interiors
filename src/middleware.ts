import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * First line of defence for /admin: unauthenticated visitors are redirected to
 * the sign-in page. This is NOT the only check — the admin layout, every
 * server action and the database's row-level security each verify the
 * administrator again.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  if (!isSupabaseConfigured) {
    if (isLogin) return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { response, user } = await updateSession(request);

  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    if (pathname !== "/admin") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

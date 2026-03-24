import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const protectedPaths = ["/dashboard", "/resources"];

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Strip locale prefix to check the path
    const pathWithoutLocale = pathname.replace(/^\/(kk|ru|en)/, "") || "/";

    // Check if this is a protected route
    const isProtected = protectedPaths.some((p) => pathWithoutLocale.startsWith(p));

    if (isProtected) {
        // Check for Supabase auth cookies
        const hasAuthToken =
            request.cookies.has("sb-nvfvrbudxltzgqmazeos-auth-token") ||
            request.cookies.has("sb-nvfvrbudxltzgqmazeos-auth-token.0");

        if (!hasAuthToken) {
            // Redirect to login
            const locale = pathname.match(/^\/(kk|ru|en)/)?.[1] || "kk";
            const loginUrl = new URL(`/${locale}/auth/login`, request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ["/", "/(kk|ru|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};

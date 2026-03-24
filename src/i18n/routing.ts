import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
    locales: ["kk", "ru", "en"],
    defaultLocale: "kk",
});

export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);

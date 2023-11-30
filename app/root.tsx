import stylesheet from "~/tailwind.css";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import type {
  LinksFunction,
  MetaFunction,
  LoaderFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import { ClerkApp, ClerkErrorBoundary } from "@clerk/remix";

import { json } from "@remix-run/node";
import { useChangeLanguage } from "remix-i18next";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { property: "og:title", content: "OSShack" },
];

export const loader: LoaderFunction = (args) => rootAuthLoader(args, async ({ request }) => {
  let locale = await i18next.getLocale(request);
  return json({ locale });
})

export const ErrorBoundary = ClerkErrorBoundary();

export let handle = {
  i18n: "common",
};

function App() {
  let { locale } = useLoaderData();
  let { i18n } = useTranslation();
  useChangeLanguage(locale)
  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default ClerkApp(App);


/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next";
import i18n from "./i18n"; // The configuration file we created

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    ...i18n, // The same config we created for the server
    ns: getInitialNamespaces(),
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["htmlTag"],
      caches: [],
    },
  })
  .then(() => {
    // After i18next init, hydrate the app
    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <I18nextProvider i18n={i18next}>
            <RemixBrowser />
          </I18nextProvider>
        </StrictMode>
      );
    });
  });

import type { MetaFunction } from "@remix-run/node";
import Hero from "../components/Hero";
import Sponsors from "../components/Sponsors";
import WhyJoin from "../components/WhyJoin";
import Date from "../components/Date";
import Schedule from "../components/Schedule";
import SignupCTA from "../components/SignupCTA";
import Team from "../components/Team";
import Footer from "../components/Footer";

import i18next from "~/i18next.server";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "OSShack" },
    {
      name: "description",
      content:
        "Win $100k in prizes and contribute to open-source. Hosted in New York and remotely.",
    },
  ];
};

export let loader = async ({ request }) => {
  let t = await i18next.getFixedT(request);
  const resource = {
    Sponsors: t("Sponsors"),
    WhyJoin: t("WhyJoin"),
    Dashboard: t("Dashboard"),
    LogIn: t("LogIn"),
    HeroTextMain: t("HeroTextMain"),
    HeroTextMain2: t("HeroTextMain2"),
  };
  return json({ resource });
};

export default function Index() {
  let { resource } = useLoaderData();
  return (
    <main>
      <Hero resource={resource}/>
      <Sponsors />
      <WhyJoin />
      <Date />
      <Schedule />
      <SignupCTA />
      <Team />
      <Footer padding={true} />
    </main>
  );
}

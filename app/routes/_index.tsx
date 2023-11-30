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
    Schedule: t("Schedule"),
    About: t("About"),
    Dashboard: t("Dashboard"),
    LogIn: t("LogIn"),
    HeroTextMain: t("HeroTextMain"),
    HeroTextMain2: t("HeroTextMain2"),
    GoToDashboard: t("GoToDashboard"),
    SignUpToParticipate: t("SignUpToParticipate"),
    SponsorOSSHack: t("SponsorOSSHack"),
    ReadyToHack: t("ReadyToHack"),
    Prizes100K: t("Prizes100K"),
    PrizesDescription: t("PrizesDescription"),
    JobOpportunity: t("JobOpportunity"),
    JobOpportunityDescription: t("JobOpportunityDescription"),
    OSSExperts: t("OSSExperts"),
    OSSExpertsDescription: t("OSSExpertsDescription"),
    HackDate1: t("HackDate1"),
    HackDate2: t("HackDate2"),
    AwardDate: t("AwardDate"),
    KickOffParty: t("KickOffParty"),
    KickOffPartyDesc: t("KickOffPartyDesc"),
    LaunchPartyReg: t("LaunchPartyReg"),
    Morning: t("Morning"),
    MorningBreakfast: t("MorningBreakfast"),
    MorningOpeningSpeech: t("MorningOpeningSpeech"),
    MorningHacking: t("MorningHacking"),
    HackTime: t("HackTime"),
    HackLunch: t("HackLunch"),
    HackMoreHack: t("HackMoreHack"),
    HackDinner: t("HackDinner"),
    HackEvenMore: t("HackEvenMore"),
    Periodically: t("Periodically"),
    PeriodicallyLectures: t("PeriodicallyLectures"),
    PeriodicallySurprises: t("PeriodicallySurprises"),
    Morning2: t("Morning2"),
    Morning2BreakFast: t("Morning2BreakFast"),
    Morning2Push: t("Morning2Push"),
    Midday: t("Midday"),
    MiddayLunch: t("MiddayLunch"),
    MiddaySubmit: t("MiddaySubmit"),
    Afternoon: t("Afternoon"),
    AfternoonHackFair: t("AfternoonHackFair"),
    AfternoonFinalDemo: t("AfternoonFinalDemo"),
    Wrap: t("Wrap"),
    Deliberation: t("Deliberation"),
    Awards: t("Awards"),
    JoinUs: t("JoinUs"),
    SignUpInMins: t("SignUpInMins"),
    SignUpLink: t("SignUpLink"),
    BroughtToYouBy: t("BroughtToYouBy"),
    WouldNotBePossible: t("WouldNotBePossible"),
    ReachOut: t("ReachOut"),
  };

  return json({ resource });
};

export default function Index() {
  let { resource } = useLoaderData();
  return (
    <main>
      <Hero resource={resource}/>
      <Sponsors resource={resource}/>
      <WhyJoin resource={resource}/>
      <Date resource={resource}/>
      <Schedule resource={resource}/>
      <SignupCTA resource={resource}/>
      <Team resource={resource}/>
      <Footer padding={true} />
    </main>
  );
}

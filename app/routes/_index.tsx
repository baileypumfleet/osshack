import type { MetaFunction } from "@remix-run/node";
import Hero from "../components/Hero";
import Sponsors from "../components/Sponsors";
import WhyJoin from "../components/WhyJoin";
import Date from "../components/Date";
import Schedule from "../components/Schedule";
import SignupCTA from "../components/SignupCTA";
import Team from "../components/Team";
import Footer from "../components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "OSShack" },
    { name: "description", content: "Win $100k in prizes and contribute to open-source. Hosted in New York and remotely." },
  ];
};

export default function Index() {
  return (
    <main>
      <Hero />
      <Sponsors />
      <WhyJoin />
      <Date />
      <Schedule />
      <SignupCTA />
      <Team />
      <Footer />
    </main>
  );
}

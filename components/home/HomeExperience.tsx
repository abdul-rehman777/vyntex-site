"use client";

import ConnectedHero from "@/components/home/ConnectedHero";
import WorkflowDemo from "@/components/home/WorkflowDemo";
import ServiceSystems from "@/components/home/ServiceSystems";
import BeforeAfterSystem from "@/components/home/BeforeAfterSystem";
import ImplementationProcess from "@/components/home/ImplementationProcess";
import IndustrySelector from "@/components/home/IndustrySelector";
import FinalSystemCTA from "@/components/home/FinalSystemCTA";

export default function HomeExperience() {
  return (
    <>
      <ConnectedHero />
      <WorkflowDemo />
      <ServiceSystems />
      <BeforeAfterSystem />
      <ImplementationProcess />
      <IndustrySelector />
      <FinalSystemCTA />
    </>
  );
}

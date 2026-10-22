import { HERO } from "@/lib/hero";
import { createFileRoute } from "@tanstack/react-router";
import { graph, webPage, ORG_ID, SERVICES, serviceId, personId } from "@/lib/schema";
import { useReveal } from "@/hooks/use-reveal";
import { TeamSection } from "@/components/team-section";
import { homeTeam } from "@/data/service-team";
import {
  Header, Hero, ServiceRouter, Convert, Testimonials, Expect, Pricing, Decisions,
  RetainerSystem, Integrations, BrandDefinition, FAQ, Process, FinalCTA, Footer, TexturedMain, MobileCallBar,
} from "@/components/home/sections";

const title = "Legal Intake & Answering Solutions for Law Firms | Alert Communications";
const description =
  "24/7 legal call management for law firms: call answering, virtual receptionists and bilingual legal intake in one communication platform. We are trusted by 5,000+ customers.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "preload", as: "image", href: HERO.src, imagesrcset: HERO.srcSet, imagesizes: HERO.sizes, fetchpriority: "high" }],
    scripts: [graph(webPage("/", title, { about: { "@id": ORG_ID }, mainEntity: { "@id": ORG_ID }, mentions: [...SERVICES.map(([s]) => ({ "@id": serviceId(s) })), ...["tammy", "jill", "michelle", "liz"].map((id) => ({ "@id": personId(id) }))], speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] } }))],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <div className="pb-20 font-body text-foreground md:pb-0">
      <Header />
      <main>
        <Hero />
        <TexturedMain>
        <ServiceRouter />
        <Convert />
        <Testimonials />
        <Expect />
        <BrandDefinition />
        <Pricing />
        <Decisions />
        <RetainerSystem />
        <Integrations />
        <TeamSection t={homeTeam} />
        <FAQ />
        </TexturedMain>
        <Process />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
}

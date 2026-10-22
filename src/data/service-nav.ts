import { PhoneCall, ClipboardList, FileSignature, MessagesSquare, Headset, Users, CalendarClock, Bot, type LucideIcon } from "lucide-react";
import answering from "@/assets/services/woman-call.jpg.asset.json";
import intake from "@/assets/services/attorneys.jpg.asset.json";
import contract from "@/assets/services/office-desk.jpg.asset.json";
import chat from "@/assets/services/night-agent.jpg.asset.json";
import mass from "@/assets/services/callcenter.jpg.asset.json";
import post from "@/assets/services/team-headsets.jpg.asset.json";
import ai from "@/assets/services/ai-voice.jpg.asset.json";
import headsets from "@/assets/services/headsets.jpg.asset.json";
import handset from "@/assets/services/handset.jpg.asset.json";

export type ServiceNav = { slug: string; name: string; blurb: string; icon: LucideIcon; image: string; gallery: string[] };

const pool = [answering, intake, contract, chat, mass, post, headsets, handset].map((a) => a.url);
const gallery = (hero: string) => pool.filter((u) => u !== hero);

const raw: [string, string, string, LucideIcon, { url: string }][] = [
  ["legal-call-answering", "Legal Answering Services", "Every call answered live, 24/7/365.", PhoneCall, answering],
  ["legal-intake", "Legal Intake Services", "Case-first screening before files reach you.", ClipboardList, intake],
  ["contract-retainer", "Contract & Retainer Services", "Retainers sent, signed and followed up.", FileSignature, contract],
  ["live-chat-text", "Live Chat & Text Services", "Real humans replying on chat and SMS.", MessagesSquare, chat],
  ["virtual-assistant-receptionists", "Virtual Receptionists", "A professional first impression on every call.", Headset, headsets],
  ["mass-tort", "Mass Tort Services", "High-volume claimant intake at scale.", Users, mass],
  ["post-retainer-services", "Post Retainer Services", "Keep signed clients engaged and informed.", CalendarClock, post],
  ["ai", "Voice + AI Services", "AI speed with human judgment.", Bot, ai],
];

export const serviceNav: ServiceNav[] = raw.map(([slug, name, blurb, icon, img], i) => {
  const g = gallery(img.url);
  return { slug, name, blurb, icon, image: img.url, gallery: [...g.slice(i % g.length), ...g.slice(0, i % g.length)] };
});

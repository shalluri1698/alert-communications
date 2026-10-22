import tammy from "@/assets/team/tammy.jpg.asset.json";
import jill from "@/assets/team/jill.jpg.asset.json";
import michelle from "@/assets/team/michelle.jpg.asset.json";
import liz from "@/assets/team/liz.jpg.asset.json";

export type TeamMember = { id: string; name: string; title: string; photo: string; since?: string; personal: string };

export const team = {
  tammy: { id: "tammy", name: "Tammy Porter", title: "Senior Account Executive", photo: tammy.url, since: "With Alert since 1998", personal: "You will often find her at legal trade shows and conferences, meeting industry leaders." },
  jill: { id: "jill", name: "Jill Rydberg", title: "Onboarding Specialist", photo: jill.url, since: "With Alert since 2011", personal: "Outside of work she loves cooking, old movies, exploring new places and time with family." },
  michelle: { id: "michelle", name: "Michelle Garcia", title: "Onboarding Specialist", photo: michelle.url, since: "With Alert since 2023", personal: "She is a homebody at heart: good food, family barbecues and good company are her kind of plans." },
  liz: { id: "liz", name: "Liz York", title: "Operations and Customer Experience", photo: liz.url, since: "Nearly 20 years in the call center industry", personal: "She is an avid reader who firmly believes the book is always better than the movie and a traveler at heart." },
} satisfies Record<string, TeamMember>;

export type PageTeam = { eyebrow: string; h2: string; intro: string; people: { id: keyof typeof team; role: string; bio: string }[] };

export const homeTeam: PageTeam = {
  eyebrow: "Your Alert Specialists",
  h2: "Meet the Legal Communication Specialists Behind Your Firm",
  intro: "From 24/7 legal call answering to virtual receptionist coverage and legal intake, these are the people who plan, build and run your firm's communication program.",
  people: [
    { id: "tammy", role: "Builds your intake and answering plan", bio: "Tammy has helped law firms turn more calls into signed cases since 1998. She learns your practice areas and caseload, then recommends the mix of call answering, intake and retainer services that fits." },
    { id: "jill", role: "Sets up your retainer workflow", bio: "Jill started as an agent, so she knows what happens on every call. She sets up retainer dispatch so qualified leads get their agreement by text or email without delay." },
    { id: "michelle", role: "Programs scripts and CRM sync", bio: "Michelle onboards firms and programs each account: bilingual intake scripts, calendar booking in Outlook or Google, and CRM handoff to Filevine, Clio, Lead Docket, CASEpeer or Lawmatics." },
    { id: "liz", role: "Keeps your coverage running", bio: "Liz brings nearly 20 years of experience in call center operations. She watches routing, overflow and escalation so your law firm phone coverage holds up on busy days and after hours." },
  ],
};

export const serviceTeam: Record<string, PageTeam> = {
  "legal-call-answering": {
    eyebrow: "Who You'll Talk To",
    h2: "The People Behind Your Phone Coverage",
    intro: "When you reach out about legal call answering, you work with real people who know law firm phones inside and out.",
    people: [
      { id: "tammy", role: "Plans your coverage", bio: "Tammy has helped law firms answer more calls since 1998. She learns how your phones run today, where calls slip through after hours, and builds a coverage plan that makes every caller feel heard and valued." },
      { id: "liz", role: "Keeps your calls running smoothly", bio: "Liz brings nearly 20 years of experience in call center operations to your account. She focuses on the day-to-day details: how calls are routed, escalated and handled, so your coverage works for your firm and the agents answering for you." },
    ],
  },
  "legal-intake": {
    eyebrow: "Your Intake Partners",
    h2: "Meet the Team That Builds Your Intake",
    intro: "Better intake starts with a conversation. These are the people who turn your qualification rules into a working intake program.",
    people: [
      { id: "tammy", role: "Shapes your intake strategy", bio: "Tammy specializes in helping law firms strengthen client intake and turn more opportunities into signed cases. She takes the time to understand your practice areas and goals before recommending a tailored intake solution." },
      { id: "michelle", role: "Programs your intake scripts", bio: "Michelle guides firms through onboarding and programs each account to match their intake needs. Her background in workflow development and system testing means your questions, routing and CRM handoff are set up and checked before go-live." },
    ],
  },
  "contract-retainer": {
    eyebrow: "Your Retainer Team",
    h2: "Real People Behind Every Signed Retainer",
    intro: "Getting retainers signed faster takes careful setup. Here is who you will work with to build your retainer workflow.",
    people: [
      { id: "tammy", role: "Aligns the workflow with your goals", bio: "Tammy has spent decades helping firms turn more conversations into clients. She works with you to map out when and how retainers go out, so qualified leads move from first call to signed agreement without delay." },
      { id: "jill", role: "Builds your retainer process", bio: "Jill started at Alert in 2011 as an agent, so she knows exactly what happens on a live call. As an Onboarding Specialist, she builds accounts with creative solutions that fit both your firm's retainer process and the agents who follow it." },
    ],
  },
  "live-chat-text": {
    eyebrow: "Who You'll Work With",
    h2: "Chat and Text Set Up by People Who've Done It",
    intro: "Your website chat and text programs are built by a team with hands-on experience answering chats themselves.",
    people: [
      { id: "michelle", role: "Sets up your chat and text", bio: "Before onboarding clients, Michelle worked in live chat herself. She knows how website visitors type, what they ask, and how to program your account so every chat or text lead is captured and passed to your team." },
      { id: "liz", role: "Oversees the experience", bio: "With nearly 20 years in customer experience, Liz makes sure your chat and text program runs smoothly every day, from response quality to how leads are handed off to your intake team." },
    ],
  },
  "virtual-assistant-receptionists": {
    eyebrow: "Your Front Desk Team",
    h2: "Meet the People Who Set Up Your Virtual Front Desk",
    intro: "A great virtual receptionist starts with a careful setup. These specialists build your greetings, transfers and calendar rules.",
    people: [
      { id: "michelle", role: "Builds your receptionist setup", bio: "Michelle's background started in reception, so she understands what callers expect from a front desk. She programs your custom greetings, warm transfers and message rules to sound like a natural part of your office." },
      { id: "jill", role: "Tailors it to your office", bio: "Jill has been with Alert since 2011 and loves coming up with creative solutions for new accounts. She works with you to fit appointment booking, call routing and messages around how your office actually works." },
    ],
  },
  "mass-tort": {
    eyebrow: "Your Campaign Team",
    h2: "The Team Behind Your Mass Tort Campaigns",
    intro: "High-volume campaigns need experienced operations and careful setup. Here is who keeps your mass tort intake on track.",
    people: [
      { id: "liz", role: "Keeps high volume under control", bio: "Liz has nearly 20 years of call center operations and leadership experience. She focuses on making campaign surges run well for both your firm and the agents, so heavy call volume never turns into lost claimants." },
      { id: "jill", role: "Builds your campaign intake", bio: "Jill began as an agent in 2011 and now builds new accounts as an Onboarding Specialist. She sets up your campaign questions and qualification steps so each claimant is screened the way your team needs." },
    ],
  },
  "post-retainer-services": {
    eyebrow: "Your Client Care Team",
    h2: "People Who Care About Your Clients After Signing",
    intro: "Keeping signed clients informed and engaged is about relationships. These are the people who help you do it well.",
    people: [
      { id: "tammy", role: "Builds the long-term partnership", bio: "Tammy believes the strongest partnerships are built on trust, accountability and shared growth. She helps you plan post-retainer outreach that keeps clients supported long after they sign." },
      { id: "jill", role: "Sets up your follow-up program", bio: "Jill builds accounts around each firm's goals. She configures your welcome calls, check-ins and updates so clients hear from your firm at the right moments." },
      { id: "liz", role: "Protects the client experience", bio: "Liz's career is focused on customer experience. She makes sure every follow-up conversation is handled with care and runs smoothly for your clients and your team." },
    ],
  },
  ai: {
    eyebrow: "Real People Behind the AI",
    h2: "Voice and AI, Backed by a Human Team",
    intro: "AI works best with experienced people setting it up and watching over it. Here is who you will work with.",
    people: [
      { id: "michelle", role: "Configures and tests your setup", bio: "Michelle's background in workflow development and system testing makes her a natural fit for Voice + AI. She programs your account and tests how calls move between AI and live agents before anything goes live." },
      { id: "liz", role: "Blends AI with live agents", bio: "With nearly 20 years in call center operations, Liz focuses on making technology work for both clients and people. She keeps the handoff between AI and live agents smooth for every caller." },
      { id: "jill", role: "Finds creative solutions", bio: "Jill started as an agent in 2011 and knows what callers need from a real person. She designs creative account setups that use AI where it helps and live agents where it matters." },
    ],
  },
};

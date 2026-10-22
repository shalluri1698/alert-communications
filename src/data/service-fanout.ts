/** Fan-out table, definition box and cross-link for selected service pages. Replaces the numbered-cards section. */
export type Fanout = {
  eyebrow: string;
  h2: string;
  intro: string;
  definitionTerm: string;
  definition: string;
  columns: [string, string, string];
  rows: [string, string, string][];
  /** Named systems, standards and teams per row, shown as chips. */
  tools: string[][];
  /** Which Alert team member helps set up each row, and how. */
  help: ["tammy" | "jill" | "michelle" | "liz", string][];
  /** Platforms and standards this service connects to. */
  ecosystem: string[];
  proof: string[];
  callout: { text: string; link: string; slug: string };
  /** In-body cross-service paragraph: plain strings and linked phrases. */
  crossLinks: (string | { text: string; slug: string })[];
};

export const serviceFanout: Record<string, Fanout> = {
  "legal-call-answering": {
    eyebrow: "Coverage Map",
    h2: "How Our 24/7 Legal Call Answering Service Handles Every Call Type",
    intro: "Law firm phone coverage is not one service. It is a set of routing decisions made in the first seconds of every call. This table shows how Alert handles the situations managing partners and operations managers ask about most.",
    definitionTerm: "What is Legal Call Answering?",
    definition: "Legal call answering is a 24/7/365 telephone infrastructure service designed specifically for law firms. It provides immediate call triage, rollover/overflow coverage, bilingual support, and emergency dispatch, ensuring every prospective client reaches a live voice rather than voicemail.",
    columns: ["Call situation", "What Alert does", "Why it matters to your firm"],
    rows: [
      ["After-hours new client call", "A live legal operator answers, captures contact and case details, and delivers the message to your team.", "The caller reaches a person instead of voicemail and does not move on to the next firm."],
      ["Urgent or emergency matter", "Calls are tagged by urgency and escalated to the on-call attorney following your schedule and rules.", "Time-sensitive matters such as arrests or protective orders reach the right attorney fast."],
      ["Front desk already on a call", "Overflow lines roll over to Alert automatically so no call rings out or hits voicemail.", "Peak hours, lunch breaks and staff absences stop costing you leads."],
      ["Existing client checking on a case", "Messages are documented and routed to the assigned attorney or paralegal.", "Clients feel heard, and your team gets context before calling back."],
      ["Wrong fit or non-case call", "Operators follow your script to politely screen and redirect the caller.", "Attorneys spend time on viable matters, not solicitations."],
      ["Spanish-speaking caller", "Bilingual legal operators answer and capture details in Spanish, then deliver the message to your team in English.", "Spanish-speaking prospects are understood and do not hang up to call another firm."],
      ["Appointment request", "Consultations are booked live in your Outlook, Google or practice-software calendar.", "The first call becomes a booked consultation, with no callback chase."],
    ],
    tools: [["Live legal operators", "Email", "Text message"], ["On-call schedule", "Escalation rules"], ["Call forwarding", "Overflow routing"], ["Clio", "Filevine", "CASEpeer"], ["Custom scripts"], ["Bilingual operators", "Spanish"], ["Microsoft Outlook", "Google Calendar", "Practice software"]],
    help: [["tammy", "Tammy maps which after-hours calls matter most to your practice."], ["liz", "Liz sets up urgency tags and who gets called, in what order."], ["liz", "Liz configures when and how your lines roll over to Alert."], ["tammy", "Tammy plans how existing-client messages reach the right person."], ["liz", "Liz builds the screening rules operators follow."], ["liz", "Liz routes Spanish-language calls to bilingual operators."], ["tammy", "Tammy reviews your calendar setup so bookings land correctly."]],
    ecosystem: ["Microsoft Outlook", "Google Calendar", "Clio", "Filevine", "Lead Docket", "CASEpeer", "Lawmatics", "HIPAA"],
    proof: ["5,000+ active customers", "100M+ calls handled", "HIPAA compliant and confidential", "Legal-trained operators, 24/7/365", "Bilingual English and Spanish"],
    crossLinks: ["If your practice requires more than basic answering, explore how our ", { text: "high-converting legal intake specialists", slug: "legal-intake" }, " qualify leads and dispatch retainers using custom screening scripts. For daytime administrative support, appointment booking, and warm phone transfers, view our ", { text: "virtual legal receptionist and remote front desk solutions", slug: "virtual-assistant-receptionists" }, "."],
    callout: { text: "Need more than basic answering? If your practice requires deep lead qualification and retainer execution, explore our", link: "Legal Intake Services", slug: "legal-intake" },
  },
  "virtual-assistant-receptionists": {
    eyebrow: "Front Desk Coverage",
    h2: "What a Virtual Legal Receptionist Handles for Your Firm",
    intro: "A remote front desk for law firms should do more than answer the phone. Here is how our virtual legal receptionists cover the daily work of an in-house front desk for solo practitioners and boutique firms, at a fraction of the cost.",
    definitionTerm: "What is a Virtual Legal Receptionist?",
    definition: "A virtual legal receptionist is a remote legal administrative assistant who manages front-desk operations for law practices. Services include answering calls with customized attorney greetings, scheduling appointments directly into law firm calendars, performing warm call transfers, and handling client status inquiries in English or Spanish.",
    columns: ["Front desk task", "How our receptionists handle it", "What your firm gains"],
    rows: [
      ["Greeting every caller", "Calls are answered with your firm's custom greeting, in your name and tone.", "Callers experience a polished, in-house feel from the first second."],
      ["Warm transfers", "The receptionist announces the caller and reason for calling before connecting the attorney.", "Attorneys pick up with context and never take a cold call."],
      ["Appointment booking", "Consultations are scheduled live in Outlook, Google Calendar or your practice software.", "You get fewer no-shows and avoid back-and-forth to confirm times."],
      ["Message taking", "Detailed messages are documented and delivered by email, text or your CRM.", "Nothing is lost on a sticky note or buried in voicemail."],
      ["Lunch, vacation and sick days", "Coverage continues automatically when your in-house staff steps away.", "Your front desk never goes dark."],
      ["After-hours calls", "The same professional greeting and booking continue nights and weekends.", "You capture prospects who call when your office is closed."],
      ["Spanish-speaking caller", "Bilingual receptionists greet callers, book appointments and take messages in Spanish, then deliver the messages to your office in English.", "Your front desk serves Spanish-speaking clients without a bilingual hire."],
      ["CRM updates", "Caller details sync to Clio, Filevine, Lead Docket, CASEpeer or Lawmatics.", "Your records stay current without double entry."],
    ],
    tools: [["Custom greeting", "Firm scripts"], ["Warm transfer", "Call announce"], ["Microsoft Outlook", "Google Calendar", "Practice software"], ["Email", "Text message", "CRM"], ["Overflow routing"], ["24/7/365 coverage"], ["Bilingual receptionists", "Spanish"], ["Clio", "Filevine", "Lead Docket", "CASEpeer", "Lawmatics"]],
    help: [["michelle", "Michelle writes and programs your greeting in your firm's voice."], ["michelle", "Michelle sets who gets transferred, when, and what is announced."], ["jill", "Jill connects booking rules to the calendar your office already uses."], ["jill", "Jill decides with you how each message type is delivered."], ["jill", "Jill builds coverage around your staff's real schedule."], ["michelle", "Michelle tests the after-hours flow before go-live."], ["michelle", "Michelle sets up your Spanish greeting and message rules."], ["michelle", "Michelle maps caller fields to your CRM."]],
    ecosystem: ["Microsoft Outlook", "Google Calendar", "Clio", "Filevine", "Lead Docket", "CASEpeer", "Lawmatics", "HIPAA"],
    proof: ["5,000+ active customers", "100M+ calls handled", "Custom greetings and scripts", "HIPAA compliant and confidential", "Bilingual English and Spanish"],
    crossLinks: ["For law practices running paid ad campaigns that require complete lead conversion, discover our ", { text: "24/7 legal intake and instant e-signature retainer dispatch", slug: "legal-intake" }, ". To protect your practice during after-hours or peak phone surges, back up your office with ", { text: "after-hours law firm phone coverage and call triage", slug: "legal-call-answering" }, "."],
    callout: { text: "Running high-volume PPC campaigns? Convert ad leads into signed retainers with our", link: "Legal Intake Services", slug: "legal-intake" },
  },
  "legal-intake": {
    eyebrow: "Intake Workflow",
    h2: "How High-Converting Legal Intake Services Turn Leads Into Signed Clients",
    intro: "Personal injury, mass tort and trial firms pay for every inbound lead. Law firm lead conversion depends on what happens in the first call. This table maps each intake step to what Alert does and how it protects your ad spend.",
    definitionTerm: "What is Legal Intake?",
    definition: "Legal intake is a specialized lead conversion workflow designed to transform legal inquiries into signed retainers. Trained intake specialists screen prospective clients against specific case criteria, perform conflict checks, complete detailed questionnaires in English or Spanish, and dispatch digital retainer agreements for immediate electronic execution.",
    columns: ["Intake step", "What Alert does", "Impact on conversion"],
    rows: [
      ["Speed to lead", "Every inbound call, web lead and chat is answered live, 24/7.", "You reach the lead before they contact another firm."],
      ["Practice-area screening", "Custom scripts for PI, mass tort, family, criminal and more ask the questions that matter.", "Bad-fit leads are filtered out before they reach an attorney."],
      ["Case scoring and conflict check", "Specialists capture liability, injury, dates and parties against your criteria.", "Attorneys review viable cases first."],
      ["Consultation booking", "Qualified leads are booked live in your calendar.", "Momentum from the call carries into the consultation."],
      ["Retainer execution", "Our Contract and Retainer team sends and follows up on retainer agreements for qualified leads.", "You get fewer signed-but-lost clients and faster retainers."],
      ["CRM sync", "Intakes flow into Filevine, Clio, Lead Docket, CASEpeer and Lawmatics.", "You avoid double entry and get clean data for campaign ROI."],
      ["Spanish-speaking lead", "Bilingual intake specialists run your full screening script in Spanish and document it in English.", "You sign cases from Spanish-speaking leads that English-only firms miss."],
      ["Reporting", "Call recordings and intake data are available in your secure client portal.", "You see which campaigns produce signed cases."],
    ],
    tools: [["Phone", "Web leads", "Live chat"], ["Personal injury", "Mass tort", "Family law", "Criminal defense"], ["Conflict check", "Case criteria"], ["Microsoft Outlook", "Google Calendar"], ["Contract and Retainer team", "E-sign by text or email"], ["Filevine", "Clio", "Lead Docket", "CASEpeer", "Lawmatics"], ["Bilingual intake specialists", "Spanish"], ["Call recordings", "Client portal"]],
    help: [["tammy", "Tammy reviews where your leads come from and how fast they need a call."], ["michelle", "Michelle programs your practice-area questions into the script."], ["michelle", "Michelle builds your qualification criteria and tests them."], ["tammy", "Tammy aligns booking with how your attorneys take consultations."], ["tammy", "Tammy connects intake with retainer follow-up so cases close."], ["michelle", "Michelle maps intake fields into your CRM."], ["michelle", "Michelle programs your intake script in Spanish."], ["tammy", "Tammy walks you through reporting by campaign."]],
    ecosystem: ["Filevine", "Clio", "Lead Docket", "CASEpeer", "Lawmatics", "Microsoft Outlook", "Google Calendar", "HIPAA"],
    proof: ["5,000+ active customers", "100M+ calls handled", "25M+ cases opened", "HIPAA compliant intake", "Bilingual English and Spanish"],
    crossLinks: ["When your marketing campaigns generate high weekend call volume, our ", { text: "24/7 legal call answering service", slug: "legal-call-answering" }, " ensures every after-hours lead is answered live and triaged before passing into your intake workflow. For boutique firms needing daily client scheduling and front-desk management, explore our ", { text: "virtual legal receptionist services", slug: "virtual-assistant-receptionists" }, "."],
    callout: { text: "Only need simple after-hours phone coverage without complex qualification scripts? View our", link: "24/7 Legal Call Answering Services", slug: "legal-call-answering" },
  },
};

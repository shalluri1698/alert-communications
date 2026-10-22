import { SITE_URL, abs } from "@/lib/site";

/**
 * Site-wide entity graph (schema.org JSON-LD). Every entity has a stable @id so pages
 * reference the same Organization, Service, Person and Place nodes instead of repeating them.
 * Only confirmed facts and integrations belong here.
 */
export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;
export const serviceId = (slug: string) => `${SITE_URL}/services/${slug}#service`;
export const personId = (id: string) => `${SITE_URL}/#person-${id}`;
export const stateId = (slug: string) => `${SITE_URL}/service-area/${slug}#place`;
const pageId = (url: string) => `${url}#webpage`;

export const SERVICES: [slug: string, name: string, type: string, desc: string][] = [
  ["legal-call-answering", "Legal Answering Services", "Legal call answering service", "Live, 24/7/365 call answering for law firms with triage, overflow and after-hours coverage."],
  ["legal-intake", "Legal Intake Services", "Legal intake service", "Bilingual legal intake specialists who screen and qualify prospective clients before cases reach the firm."],
  ["contract-retainer", "Contract & Retainer Services", "Retainer agreement service", "Retainer agreements sent to qualified leads by text or email, then followed up until signed."],
  ["live-chat-text", "Live Chat & Text Services", "Live chat and SMS service", "Live agents answering website chat and text messages for law firms."],
  ["virtual-assistant-receptionists", "Virtual Receptionists", "Virtual legal receptionist service", "Virtual legal receptionists who handle front-desk calls, scheduling and messages."],
  ["mass-tort", "Mass Tort Services", "Mass tort intake service", "High-volume claimant intake for mass tort and class action campaigns."],
  ["post-retainer-services", "Post Retainer Services", "Client follow-up service", "Ongoing contact with signed clients to keep cases moving."],
  ["ai", "Voice + AI Services", "AI answering service", "AI call handling combined with live legal agents."],
];

/** Confirmed integrations only. */
export const TOOLS = ["Filevine", "Clio", "Lead Docket", "CASEpeer", "Lawmatics", "Microsoft Outlook", "Google Calendar"];
const toolNodes = () => TOOLS.map((name) => ({ "@type": "SoftwareApplication", name, applicationCategory: "BusinessApplication" }));

const PEOPLE: Record<string, [string, string]> = {
  tammy: ["Tammy Porter", "Senior Account Executive"],
  jill: ["Jill Rydberg", "Onboarding Specialist"],
  michelle: ["Michelle Garcia", "Onboarding Specialist"],
  liz: ["Liz York", "Operations and Customer Experience"],
};
/** Public LinkedIn profiles (add the rest as they are confirmed). */
export const LINKEDIN: Record<string, string> = {
  tammy: "https://www.linkedin.com/in/tammy-porter-768071171/",
  jill: "https://www.linkedin.com/in/jill-rydberg-b5545ba0/",
};
export const ORG_LINKEDIN = "https://www.linkedin.com/company/alert-communications_2/";
export const personNode = (id: string, photo?: string) => ({
  "@type": "Person", "@id": personId(id), name: PEOPLE[id]?.[0], jobTitle: PEOPLE[id]?.[1],
  ...(LINKEDIN[id] ? { sameAs: [LINKEDIN[id]] } : {}),
  ...(photo ? { image: photo.startsWith("http") ? photo : SITE_URL + photo } : {}),
  worksFor: { "@id": ORG_ID },
});

const serviceNode = ([slug, name, type, desc]: (typeof SERVICES)[number]) => ({
  "@type": "Service", "@id": serviceId(slug), name, serviceType: type, description: desc,
  url: abs(`/services/${slug}`), provider: { "@id": ORG_ID },
  areaServed: { "@type": "Country", name: "United States" },
  audience: { "@type": "BusinessAudience", audienceType: "Law firms" },
  availableLanguage: ["English", "Spanish"],
});

/** Sitewide graph emitted once from the root route. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"], "@id": ORG_ID,
        name: "Alert Communications", url: SITE_URL, logo: `${SITE_URL}/favicon.png`,
        telephone: "+1-844-236-2485", foundingDate: "1965",
        address: { "@type": "PostalAddress", addressLocality: "Camarillo", addressRegion: "CA", addressCountry: "US" },
        areaServed: { "@type": "Country", name: "United States" },
        parentOrganization: { "@type": "Organization", name: "Nexa Receptionists Holdings LLC", url: "https://www.nexa.com/" },
        knowsLanguage: ["English", "Spanish"],
        sameAs: [ORG_LINKEDIN, "https://www.facebook.com/AlertComm/"],
        knowsAbout: ["Legal call answering", "Legal intake", "Virtual legal receptionists", "Retainer agreements", "Mass tort intake", "Law firm live chat", "Legal CRM integration", ...TOOLS],
        hasOfferCatalog: { "@type": "OfferCatalog", name: "Legal communication services", itemListElement: SERVICES.map(([slug]) => ({ "@type": "Offer", itemOffered: { "@id": serviceId(slug) } })) },
        employee: Object.keys(PEOPLE).map((id) => ({ "@id": personId(id) })),
      },
      { "@type": "WebSite", "@id": SITE_ID, url: SITE_URL, name: "Alert Communications", publisher: { "@id": ORG_ID }, inLanguage: "en-US" },
      ...SERVICES.map(serviceNode),
      ...Object.keys(PEOPLE).map((id) => personNode(id)),
    ],
  };
}

/** A WebPage node tied into the graph. `extra` adds about/mentions/author/etc. */
export function webPage(path: string, name: string, extra: Record<string, unknown> = {}, type = "WebPage") {
  const url = abs(path);
  return { "@type": type, "@id": pageId(url), url, name, isPartOf: { "@id": SITE_ID }, publisher: { "@id": ORG_ID }, inLanguage: "en-US", ...extra };
}

export const ld = (data: unknown) => ({ type: "application/ld+json", children: JSON.stringify(data) });
export const graph = (...nodes: unknown[]) => ld({ "@context": "https://schema.org", "@graph": nodes });

/** Entities a piece of HTML links to: services become about, states become mentions. */
export function linkedEntities(html: string) {
  const svc = new Set<string>(); const st = new Set<string>();
  for (const m of html.matchAll(/href="\/services\/([a-z0-9-]+)"/g)) if (SERVICES.some(([s]) => s === m[1])) svc.add(m[1]!);
  for (const m of html.matchAll(/href="\/service-area\/([a-z-]+)"/g)) st.add(m[1]!);
  const tools = TOOLS.filter((t) => html.includes(t));
  return {
    about: [...svc].map((s) => ({ "@id": serviceId(s) })),
    mentions: [...[...st].map((s) => ({ "@id": stateId(s) })), ...tools.map((name) => ({ "@type": "SoftwareApplication", name }))],
  };
}

export { toolNodes };

/** Generic company/info page node: picks the schema.org page type from the path. */
export function pageNode(path: string, name: string) {
  const type = path.startsWith("/about") || path === "/careers" ? "AboutPage" : path === "/contact" || path === "/client-support" ? "ContactPage" : path === "/downloads" || path === "/case-studies" || path === "/service-area" ? "CollectionPage" : "WebPage";
  const extra: Record<string, unknown> = { about: { "@id": ORG_ID } };
  if (path === "/integrations") extra["mentions"] = toolNodes();
  if (path === "/law-firms" || path === "/other" || path === "/plans") extra["mentions"] = SERVICES.map(([s]) => ({ "@id": serviceId(s) }));
  return webPage(path, name, extra, type);
}

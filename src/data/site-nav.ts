import { Building2, Users, Info, UserCircle, HelpCircle, Handshake, MapPin, Video, Briefcase, Star, Award, FileText, LifeBuoy, type LucideIcon } from "lucide-react";

export type NavLink = { name: string; href: string; blurb: string; icon: LucideIcon };

export const whoWeServe: NavLink[] = [
  { name: "Law Firms", href: "/law-firms/", blurb: "Small, mid-sized and large firms, every practice area.", icon: Building2 },
  { name: "Other Industries", href: "/other/", blurb: "Not a law firm? We'll match you with the right service.", icon: Users },
];

export const aboutNav: NavLink[] = [
  { name: "About Us", href: "/about/", blurb: "Legal-only intake since 1965.", icon: Info },
  { name: "Who We Are", href: "/about/who-we-are/", blurb: "Our mission, credentials and technology.", icon: UserCircle },
  { name: "FAQ", href: "/about/faq/", blurb: "Answers to common questions.", icon: HelpCircle },
  { name: "Partnerships", href: "/partnerships/", blurb: "Grow with our partner program.", icon: Handshake },
  { name: "Service Area", href: "/service-area/", blurb: "Serving all 50 states.", icon: MapPin },
  { name: "Virtual Tour", href: "/about/virtual-tour/", blurb: "Step inside our call center.", icon: Video },
  { name: "Our Clients", href: "/about/our-clients/", blurb: "Firms that rely on Alert.", icon: Award },
  { name: "Testimonials", href: "/testimonials/", blurb: "Reviews from our clients.", icon: Star },
  { name: "Careers", href: "/careers/", blurb: "Join our team in Camarillo.", icon: Briefcase },
  { name: "Case Studies", href: "/case-studies/", blurb: "Real results for real firms.", icon: FileText },
  { name: "Client Support", href: "/client-support/", blurb: "Help for existing clients.", icon: LifeBuoy },
];

export type ServiceItem = {
  icon: string;       // clase de Bootstrap Icons, ej: "bi bi-briefcase"
  title: string;
  description: string;
  delay?: number;     // opcional, para data-aos-delay
};

export const services: ServiceItem[] = [
  {
    icon: "bi bi-briefcase",
    title: "Web Design",
    description:
      "Create modern and user-friendly websites that look great and work well on any device.",
    delay: 0,
  },
  {
    icon: "bi bi-card-checklist",
    title: "Frontend Development",
    description:
      "Build fast and easy-to-use web pages with React and simple tools.",
    delay: 100,
  },
  {
    icon: "bi bi-bar-chart",
    title: "QA & Automation",
    description:
      "Test websites to find and fix problems quickly, using both manual checks and automated tools.",
    delay: 200,
  },
  {
    icon: "bi bi-binoculars",
    title: "Web Performance & SEO",
    description:
      "Make websites load faster and help them show up better on search engines like Google.",
    delay: 300,
  },
  {
    icon: "bi bi-brightness-high",
    title: "E-Commerce Web",
    description:
      "Keep websites safe by protecting user information and blocking threats.",
    delay: 400,
  },
  {
    icon: "bi bi-calendar4-week",
    title: "DevOps for Web",
    description:
      "Set up smooth and automatic website updates and backups using simple tools.",
    delay: 500,
  },
];

export type PortfolioCategory = "Web" | "App" | "Backend" | "Design";

export interface PortfolioItem {
  /** Nombre que se muestra */
  title: string;
  /** Categoría para filtros (All / Web / App / etc.) */
  category: PortfolioCategory;
  /** URL del proyecto en producción (Vercel) */
  link: string;
  /** URL de la imagen (og.png) servida por ese proyecto (Vercel) */
  image: string;
  /** Texto opcional: breve descripción */
  description?: string;
  /** Tech stack opcional */
  stack?: string[];
  /** Destacar proyecto */
  featured?: boolean;
}

/**
 * Recomendación: C/Proyecto en Vercel:
 * public/og.png (1200x630)
 * URL:
 * https://proyecto.vercel.app/og.png
 */
export const portfolio: PortfolioItem[] = [
  {
    title: "Digital Resume",
    category: "Web",
    link: "https://andreshidalgo.com",
    image: "https://andreshidalgo.com/og.png", // crea public/og.png en ESTE proyecto también
    description: "Personal CV built with Astro and Bootstrap template replica.",
    stack: ["Astro", "TypeScript", "Bootstrap"],
    featured: true,
  },
  {
    title: "Callejeándola App",
    category: "App",
    link: "https://callejeandola-app.vercel.app",
    image: "https://callejeandola-app.vercel.app/og.png",
    description:
      "Project deployed on Vercel with preview image served from /og.png.",
    stack: ["Next.js", "Vercel"],
  },

  // {
  //   title: "Otro Proyecto",
  //   category: "App",
  //   link: "https://otro-proyecto.vercel.app",
  //   image: "https://otro-proyecto.vercel.app/og.png",
  //   description: "Descripción corta…",
  //   stack: ["React", "API"],
  // },
];

/** Categorías únicas para renderizar filtros */
export const portfolioCategories: PortfolioCategory[] = Array.from(
  new Set(portfolio.map((p) => p.category)),
);

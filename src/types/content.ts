export interface StructuredCta {
  label: string;
  url: string;
  type?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | string;
  target?: string;
  rel?: string;
}

export interface StructuredContentRecord {
  title: string;
  blurb?: string;
  description?: string;
  content?: string;
  enroll?: string;
  curriculum?: string;
  slug?: string;
  image?: string;
  icon?: string;
  level?: string;
  topics?: string[];
  classes?: string[];
  category?: string[];
  cta?: StructuredCta[];
  meta?: Record<string, unknown> & {
    slug?: string;
    image?: string;
    icon?: string;
    topics?: string[];
    classes?: string[];
    category?: string[];
    level?: string;
    curriculum?: string;
    cta?: StructuredCta[];
  };
  [key: string]: unknown;
}

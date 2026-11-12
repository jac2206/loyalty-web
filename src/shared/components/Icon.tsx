import type { SVGProps } from "react";

// Subset of the functional icons supplied by JAC-DESIGN-SYSTEM-v4.html.
const paths = {
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z",
  list: "M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01",
  plus: "M12 5v14M5 12h14",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  refresh: "M20 7v5h-5M4 17v-5h5M5 9a8 8 0 0 1 13-3l2 1M4 17l2 1a8 8 0 0 0 13-3",
  star: "m12 2 3 7 7 .5-5.5 5 1.8 7.5-6.3-4-6.3 4 1.8-7.5L2 9.5 9 9z",
  moon: "M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2",
  sun: "M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4",
  user: "M4 21c0-5 3-8 8-8s8 3 8 8",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M5 5l14 14M19 5 5 19",
  logout: "M10 17v3H4V4h6v3M14 8l4 4-4 4M8 12h10",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {name === "sun" && <circle cx="12" cy="12" r="4" />}
      {name === "user" && <circle cx="12" cy="7" r="4" />}
      <path d={paths[name]} />
    </svg>
  );
}

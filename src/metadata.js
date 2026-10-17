const environmentOrigin = typeof process !== "undefined" ? process.env.VITE_SITE_ORIGIN : undefined;
const browserOrigin = typeof window !== "undefined" ? window.location.origin : undefined;

export const siteOrigin = (environmentOrigin || browserOrigin || "http://localhost:4173").replace(/\/$/, "");

const productDescriptions = {
  "scoop-robot-c07": "Explore the Catlink Scoop Robot C07 concept page, including dual AI cameras, auto-refill convenience and an 82L cabin.",
  "pro-x-ultra": "Explore the Catlink Pro-X Ultra concept page, with an HD camera, radar-led safety and dual-band Wi-Fi.",
  "pro-x-luxury": "Explore the Catlink Pro-X Luxury concept page, featuring advanced odour control, multi-cat profiles and six-sensor safety.",
  young: "Explore the Catlink Young concept page, an approachable self-cleaning litter box with simple controls and easy access.",
  "baymax-sakura": "Explore the Catlink Baymax Sakura concept page, with multi-cat recognition, health insights and a soft pink finish.",
  baymax: "Explore the Catlink Baymax concept page, with Cat ID recognition, health reports and sealed odour control.",
  "baymax-lite": "Explore the Catlink Baymax Lite concept page, with automatic cleaning, app health logs and upgradeable multi-cat recognition.",
  "open-x": "Explore the Catlink Open-X concept page, a spacious open-top litter box with multi-cat tracking and a 12L waste tank.",
  "open-x-lite": "Explore the Catlink Open-X Lite concept page, offering open-top comfort, weight tracking and washable components.",
  "f04-fresh-2": "Explore the Catlink F04 Fresh 2 Luxury concept page, with RFID recognition, app schedules and a 4L hopper.",
  "f03-rfid": "Explore the Catlink F03 RFID Standard concept page, designed to prevent food stealing and support different diets.",
  "facelink-feeder": "Explore the Catlink Facelink Feeder concept page, with camera identification, personalised portions and intake tracking.",
  "w02-pure-2": "Explore the Catlink W02 Pure 2 concept page, with filtered water, app-connected hydration tracking and refill reminders.",
  "w03-wireless": "Explore the Catlink W03 Wireless concept page, a quiet battery-powered fountain with flexible placement and five flow modes.",
};

const productNames = {
  "scoop-robot-c07": "Scoop Robot C07",
  "pro-x-ultra": "Pro-X Ultra",
  "pro-x-luxury": "Pro-X Luxury",
  young: "Young",
  "baymax-sakura": "Baymax Sakura",
  baymax: "Baymax",
  "baymax-lite": "Baymax Lite",
  "open-x": "Open-X",
  "open-x-lite": "Open-X Lite",
  "f04-fresh-2": "F04 Fresh 2 Luxury",
  "f03-rfid": "F03 RFID Standard",
  "facelink-feeder": "Facelink Feeder",
  "w02-pure-2": "W02 Pure 2",
  "w03-wireless": "W03 Wireless",
};

export const routeMetadata = {
  "/": {
    title: "Catlink EU Concept — Smarter Care for Every Cat",
    description: "An independent portfolio concept exploring Catlink smart litter boxes, feeders and fountains in one connected experience.",
  },
  "/products": {
    title: "Products — Catlink EU Concept",
    description: "Browse the complete Catlink product range in this independent portfolio concept, from litter boxes to feeders and fountains.",
  },
  "/how-to-choose": {
    title: "How to Choose — Catlink EU Concept",
    description: "Compare Catlink litter boxes by comfort, household size and care priorities with a simple interactive guide.",
  },
  "/reviews": {
    title: "Customer Reviews — Catlink EU Concept",
    description: "Read lightly edited public Catlink customer experiences and see verified-buyer product photographs in real homes.",
  },
  "/app": {
    title: "Catlink App — Connected Cat Care Concept",
    description: "Explore how the Catlink app brings compatible litter boxes, feeders and water fountains into one connected care overview.",
  },
  ...Object.fromEntries(Object.entries(productNames).map(([slug, name]) => [`/products/${slug}`, {
    title: `${name} — Catlink EU Concept`,
    description: productDescriptions[slug],
  }])),
};

export const notFoundMetadata = {
  title: "Page Not Found — Catlink EU Concept",
  description: "The requested page is not part of this independent Catlink portfolio concept.",
};

export function normalizePath(pathname) {
  return pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
}

export function metadataForPath(pathname) {
  const path = normalizePath(pathname);
  return { ...(routeMetadata[path] || notFoundMetadata), path, found: Boolean(routeMetadata[path]) };
}

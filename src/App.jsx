import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Activity, ArrowRight, Bell, ChevronLeft, ChevronRight, Droplets, Menu, Radar, ScanFace, ShieldCheck, Sparkles, Weight, Wind, X } from "lucide-react";
import { metadataForPath, siteOrigin } from "./metadata.js";

const ease = [0.22, 1, 0.36, 1];
const basePath = import.meta.env.BASE_URL;
const pageHref = path => `${basePath}${path.replace(/^\//, "")}`;
const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: .7, ease } } };
const officialMedia = {
  homeFamily: "https://cdn.shopify.com/s/files/1/0919/4648/4099/files/Litter_box_catlink.png?v=1758872075",
  catalogFamily: "https://catlinkeu.com/cdn/shop/files/catlink-eulitter-box-feeder-water-fountain-complete-set-5062047.png?v=1767822931",
};

const imageWidths = [480, 720, 1080];
function officialImageSrcSet(src) {
  if (!src || !/(catlinkeu\.com|cdn\.shopify\.com)/.test(src)) return undefined;
  return imageWidths.map(width => {
    const url = new URL(src);
    url.searchParams.set("width", width);
    return `${url.toString()} ${width}w`;
  }).join(", ");
}

function setPageMetadata(pathname) {
  const metadata = metadataForPath(pathname);
  const canonicalUrl = `${siteOrigin}${metadata.path === "/" ? "" : metadata.path}`;
  document.title = metadata.title;
  const entries = [
    ["meta[name='description']", "name", "description", metadata.description],
    ["meta[property='og:title']", "property", "og:title", metadata.title],
    ["meta[property='og:description']", "property", "og:description", metadata.description],
    ["meta[property='og:type']", "property", "og:type", "website"],
    ["meta[property='og:url']", "property", "og:url", canonicalUrl],
  ];
  entries.forEach(([selector, attribute, key, content]) => {
    let tag = document.head.querySelector(selector);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(attribute, key);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  });
  let canonical = document.head.querySelector("link[rel='canonical']");
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;
}

function Reveal({ children, className = "", delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .75, delay, ease }}>{children}</motion.div>;
}

function Logo() { return <span className="logo"><i><span /></i><b>Catlink</b><em>EU</em></span>; }

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = event => {
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);
  const links = [["Home", "/"], ["Products", "/products"], ["How to choose", "/how-to-choose"], ["Reviews", "/reviews"], ["App", "/app"]];
  return <header className={`nav-wrap ${scrolled ? "is-scrolled" : ""}`}>
    <nav aria-label="Main navigation">
      <a href={pageHref("/")} aria-label="Catlink EU home"><Logo /></a>
      <div className="desktop-links">{links.map(([label, href]) => <a key={href} href={pageHref(href)}>{label}</a>)}</div>
      <a className="nav-buy" href={pageHref("/products")}>Shop <span>all models</span></a>
      <button ref={menuButtonRef} className="menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </nav>
    <AnimatePresence>{open && <motion.nav id="mobile-navigation" aria-label="Mobile navigation" className="mobile-links" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>{links.map(([label, href]) => <a key={href} href={pageHref(href)} onClick={() => setOpen(false)}>{label}</a>)}</motion.nav>}</AnimatePresence>
  </header>;
}

function Hero() {
  return <section id="products" className="hero family-hero">
    <img src={officialMedia.homeFamily} srcSet={officialImageSrcSet(officialMedia.homeFamily)} sizes="100vw" alt="Three cats relaxing around a Catlink smart litter box in a bright home" fetchPriority="high" decoding="async" />
    <div className="hero-shade" />
    <motion.div className="hero-copy" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .11, delayChildren: .1 } } }}>
      <motion.p variants={fade}>The Catlink family</motion.p>
      <motion.h1 variants={fade}>One connected home.<br /><span>Made for every cat.</span></motion.h1>
      <motion.h2 variants={fade}>Smart cleaning, feeding and hydration—thoughtfully connected in one app.</motion.h2>
      <motion.div variants={fade} className="hero-actions"><a className="button" href={pageHref("/products")}>Explore all products</a><a href={pageHref("/how-to-choose")}>Find your fit <ChevronRight /></a></motion.div>
    </motion.div>
    <div className="hero-note"><span>Litter boxes · Feeders · Water fountains</span><span>One Catlink app</span></div>
  </section>;
}

function Intro() {
  return <section id="pro-x" className="intro">
    <Reveal><p className="kicker">A calmer routine</p><h2>Everyday cat care.<br /><span>Connected in one place.</span></h2><p className="intro-copy">Catlink brings cleaning, feeding and hydration into one simple ecosystem, helping every cat keep a comfortable routine while owners spend less time on daily maintenance.</p></Reveal>
    <div className="facts"><Reveal delay={.05}><strong>3</strong><span>connected care categories</span></Reveal><Reveal delay={.12}><strong>1 app</strong><span>one clear daily overview</span></Reveal><Reveal delay={.19}><strong>24/7</strong><span>routine monitoring</span></Reveal></div>
  </section>;
}

const features = [
  { icon: Activity, title: "Health trends, not just visits.", text: "Weight, frequency and duration are measured automatically, making subtle changes easier to spot.", cls: "health" },
  { icon: ScanFace, title: "Knows who is who.", text: "Multi-cat recognition builds a separate timeline for every cat in the household.", cls: "identity" },
  { icon: Wind, title: "Odour stays inside.", text: "Waste separation and hydrogel deodorising seal unpleasant smells at the source.", cls: "odour" },
  { icon: Radar, title: "Safety never sleeps.", text: "Millimetre-wave radar stops every cleaning cycle the moment a cat approaches.", cls: "safety" },
];

function Technology() {
  return <section id="technology" className="tech-section">
    <Reveal className="section-title"><p className="kicker">Intelligence, built in</p><h2>Four quiet systems.<br />One healthier routine.</h2></Reveal>
    <div className="bento">{features.map((item, i) => <Reveal key={item.title} className={`feature ${item.cls}`} delay={i * .05}>
      <item.icon /><div><h3>{item.title}</h3><p>{item.text}</p></div>
      {item.cls === "health" && <div className="trend" aria-hidden="true"><span>Weekly weight</span><b>4.6 kg</b><i /><i /><i /><i /><i /><i /><i /></div>}
      {item.cls === "identity" && <div className="cat-profiles" aria-hidden="true"><span>M</span><span>L</span><span>N</span><small>3 cats recognised</small></div>}
    </Reveal>)}</div>
  </section>;
}

const catalog = [
  { slug: "scoop-robot-c07", name: "Scoop Robot C07", type: "Auto-refill self-cleaning litter box", price: "€849,99", was: "€879,99", badge: "New", tagline: "Big enough to last. Smart enough to refill.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-scoop-robot-c07-auto-refill-self-cleaning-smart-litter-box-6819415.jpg?v=1784934876&width=720", description: "Auto-refill convenience, an 82L cabin for cats up to 15 kg, dual AI cameras and up to 20 hands-free days.", features: ["Dual AI cameras", "15L waste capacity", "Up to 20 days"], details: [{ title: "Refills itself", text: "Automatic litter refilling keeps the bed ready between top-ups and reduces daily maintenance." }, { title: "Two intelligent views", text: "Dual AI cameras support multi-cat monitoring and help recognise changes in bathroom habits." }, { title: "Made for big cats", text: "An 82L cabin gives large breeds room to turn, dig and settle without feeling enclosed." }], specs: [["Cabin", "82L"], ["Cat weight", "Up to 15 kg"], ["Waste tank", "15L"], ["Hands-free", "Up to 20 days"]], officialUrl: "https://catlinkeu.com/products/catlink-scoop-robot-c07-auto-refill-self-cleaning-smart-scooper-litter-box" },
  { slug: "pro-x-ultra", name: "Pro-X Ultra", type: "Camera-enabled self-cleaning litter box", price: "€566,99", was: "€629,99", badge: "Hot sale", tagline: "Smart eyes on your cat’s wellness.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-pro-x-ultra-self-cleaning-litter-box-9608902.png?v=1774412111&width=720", description: "Real-time video, precise radar detection and dual-band Wi-Fi for the most connected Catlink experience.", features: ["HD camera", "2.4 & 5GHz Wi-Fi", "13L waste capacity"], details: [{ title: "See every visit", text: "The built-in wide-angle HD camera lets you check in and follow bathroom habits remotely." }, { title: "Four-stage odour lock", text: "UV-C, oxygen sterilisation, activated carbon and sealed waste storage work together." }, { title: "Radar-led safety", text: "High-precision radar and gravity sensors pause cleaning whenever movement is detected." }], specs: [["Waste tank", "13L"], ["Hands-free", "Up to 15 days"], ["Connectivity", "2.4 & 5GHz"], ["Cat profiles", "Up to 10"]], officialUrl: "https://catlinkeu.com/products/catlink-pro-x-ultra-self-cleaning-litter-box" },
  { slug: "pro-x-luxury", name: "Pro-X Luxury", type: "Premium self-cleaning litter box", price: "€494,99", was: "€549,99", badge: "Premium", tagline: "Comprehensive care, quietly automated.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-pro-x-luxury-self-cleaning-litter-box-9574794.png?v=1774412112&width=720", description: "Deep odour control, six-sensor safety and up to 15 days of hands-off cleaning for multi-cat homes.", features: ["Six-sensor safety", "UV & oxygen sterilisation", "Up to 15 days"], details: [{ title: "Individual health profiles", text: "Weight-based identification separates visits and health trends for cats sharing one box." }, { title: "Dual sterilisation", text: "UV light and active oxygen support a cleaner drum while activated carbon controls odour." }, { title: "Designed to protect", text: "Gravity, radar and anti-pinch sensing are backed by a stable base and child lock." }], specs: [["Waste tank", "13L"], ["Hands-free", "Up to 15 days"], ["Safety", "Six-sensor system"], ["Cleaning", "Rolling dynamic"]], officialUrl: "https://catlinkeu.com/products/catlink-pro-x-luxury-self-cleaning-litter-box" },
  { slug: "young", name: "Young", type: "Essential self-cleaning litter box", price: "€404,99", was: "€449,99", badge: "Sold out", tagline: "Essential automation, made approachable.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-young-self-cleaning-litter-box-3666432.png?v=1774412112&width=720", description: "Simple controls, a stable triangular base and easy access for senior or short-legged cats.", features: ["Plug and play", "One-touch emptying", "Senior-friendly access"], details: [{ title: "Ready out of the box", text: "No assembly is required: plug it in and use the full control panel for everyday cleaning." }, { title: "Easy entry", text: "A wide opening and optional removable stair help senior, small and short-legged cats." }, { title: "Activated-carbon freshness", text: "A dedicated carbon filter continuously absorbs odour inside the semi-enclosed body." }], specs: [["Globe", "65L"], ["Waste tank", "13L"], ["Cat weight", "1.4–10 kg"], ["Unit weight", "16.8 kg"]], officialUrl: "https://catlinkeu.com/products/catlink-young-self-cleaning-litter-box" },
  { slug: "baymax-sakura", name: "Baymax Sakura", type: "Smart self-cleaning litter box", price: "€314,99", was: "€349,99", badge: "Sakura", tagline: "A softer colour. The same smart routine.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-baymax-sakura-self-cleaning-litter-box-1524108.png?v=1770968481&width=720", description: "The pink all-in-one Baymax with multi-cat recognition, health insights and comprehensive sensor safety.", features: ["Multi-cat profiles", "Six-point safety", "Advanced odour control"], details: [{ title: "Multi-cat recognition", text: "Weight-based Cat ID builds separate visit, weight and bathroom reports for each cat." }, { title: "Sealed while it cycles", text: "The enclosed structure keeps litter and waste securely inside during cleaning." }, { title: "Quietly safety-first", text: "Multiple gravity and infrared sensors stop operation when a cat approaches or enters." }], specs: [["Globe", "70L"], ["Waste tank", "7L"], ["Cat weight", "1.58–10 kg"], ["Colour", "Sakura pink"]], officialUrl: "https://catlinkeu.com/products/catlink-baymax-sakura-self-cleaning-litter-box" },
  { slug: "baymax", name: "Baymax", type: "Smart self-cleaning litter box", price: "€305,99", was: "€339,99", badge: "Popular", tagline: "No scoop. No stress. Just smart.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-baymax-white-pink-self-cleaning-litter-box-6343300.png?v=1768362739&width=720", description: "Compact everyday automation with Cat ID recognition, health reports and a sealed odour-control system.", features: ["Cat ID recognition", "Soft-stool mode", "7L waste capacity"], details: [{ title: "Knows every cat", text: "Cat ID recognition uses weight to organise visits and health reporting in multi-cat homes." }, { title: "Cleaning that adapts", text: "Automatic cycles include a soft-stool mode for more complete, mess-conscious cleaning." }, { title: "Odour stays contained", text: "A gravity-sealed door, deodorising gel and heavy waste bags isolate unpleasant smells." }], specs: [["Globe", "70L"], ["Waste tank", "7L"], ["Cat weight", "1.58–10 kg"], ["Hands-free", "5–7 days"]], officialUrl: "https://catlinkeu.com/products/catlink-baymax-self-cleaning-litter-box" },
  { slug: "baymax-lite", name: "Baymax Lite", type: "Upgradeable self-cleaning litter box", price: "€278,99", was: "€309,99", badge: "Smart value", tagline: "Start simple. Add more intelligence later.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-baymax-lite-gray-self-cleaning-litter-box-5347369.jpg?v=1768272756&width=720", description: "Single-cat app tracking out of the box, with multi-cat recognition available as an in-app upgrade.", features: ["24h auto-clean", "App health logs", "Upgrade-ready"], details: [{ title: "Single-cat simplicity", text: "Automatic cleaning and app-connected health logs cover the essentials from day one." }, { title: "Built to grow", text: "Multi-cat recognition can be unlocked later, without replacing the litter box." }, { title: "Compact odour control", text: "A sealed waste drawer, deodorising gel and odour-lock bags keep the room fresher." }], specs: [["Globe", "70L"], ["Waste tank", "7L"], ["Cat weight", "1.58–10 kg"], ["Finish", "Light grey"]], officialUrl: "https://catlinkeu.com/products/catlink-baymax-lite-gray-self-cleaning-litter-box" },
  { slug: "open-x", name: "Open-X", type: "Open-top self-cleaning litter box", price: "€224,99", was: "€249,99", badge: "Large-cat ready", tagline: "Open comfort for every cat.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-open-x-open-top-self-cleaning-litter-box-3982096.png?v=1774839515&width=720", description: "A spacious open design with a 12L sealed tank, multi-cat health tracking and four-layer safety.", features: ["Open-top comfort", "20-cat ID tracking", "12L waste capacity"], details: [{ title: "Nothing overhead", text: "The open top gives large or cautious cats a natural-feeling space with room to move." }, { title: "A profile for every cat", text: "Multi-cat ID and health tracking make shared-box routines easier to understand." }, { title: "One-tap deep clean", text: "Emptying, disassembly and washable parts simplify regular care of the entire unit." }], specs: [["Waste tank", "12L"], ["Cat weight", "Up to 15 kg"], ["Recognition", "Multi-cat included"], ["Connectivity", "2.4 & 5GHz"]], officialUrl: "https://catlinkeu.com/products/catlink-open-x-open-top-self-cleaning-cat-litter-box" },
  { slug: "open-x-lite", name: "Open-X Lite", type: "Open-top self-cleaning litter box", price: "€234,99", was: "€264,99", badge: "Essential", tagline: "More room. Fewer barriers.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-open-x-lite-open-top-self-cleaning-litter-box-4552938.png?v=1777394679&width=720", description: "The same spacious open form with weight-based tracking and optional multi-cat recognition.", features: ["Large-cat friendly", "Weight-based tracking", "Washable drum"], details: [{ title: "The same open design", text: "It shares Open-X dimensions, 12L capacity and large-cat comfort in a light-grey finish." }, { title: "Focused on one cat", text: "Single-cat tracking is standard, with a multi-cat recognition upgrade available later." }, { title: "Easy from every angle", text: "One-tap emptying and washable, removable components reduce hands-on maintenance." }], specs: [["Waste tank", "12L"], ["Cat weight", "Up to 15 kg"], ["Recognition", "Single cat, upgradeable"], ["Connectivity", "2.4 & 5GHz"]], officialUrl: "https://catlinkeu.com/products/catlink-open-x-lite-open-top-self-cleaning-litter-box" },
  { slug: "f04-fresh-2", category: "Feeders", name: "F04 Fresh 2 Luxury", type: "RFID smart automatic feeder", price: "€134,99", was: "€149,99", badge: "Smart feeding", tagline: "Personal portions, reliably served.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-fresh-2-luxury-automatic-feeder-904553.jpg?v=1764553404&width=1080", description: "A 4L feeder with RFID cat recognition, app schedules and dual power for dependable multi-cat feeding.", features: ["RFID cat profiles", "4L food storage", "App meal plans"], details: [{ title: "Meals stay personal", text: "RFID collar recognition associates every visit with the right cat and its feeding history." }, { title: "Schedules keep running", text: "Smart, scheduled, night and manual modes make portions predictable even when plans change." }, { title: "Fresh from top to bowl", text: "A sealed hopper, desiccant compartment and food-safe ceramic bowl protect every serving." }], specs: [["Food storage", "4L / approx. 2 kg"], ["Meals", "Up to 20 per day"], ["Power", "Plug-in or battery"], ["Food", "Dry food"]], officialUrl: "https://catlinkeu.com/products/catlink-automatic-feeder-f04-fresh-2-luxury" },
  { slug: "f03-rfid", category: "Feeders", name: "F03 RFID Standard", type: "RFID access-controlled feeder", price: "€149,99", was: null, badge: "Sold out", tagline: "Only the right cat gets the right meal.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-rfid-f03-standard-pet-feeder-9219585.png?v=1765834077&width=1080", description: "A compact dual-bowl feeder that opens for an authorised RFID collar and seals food when the cat leaves.", features: ["RFID-only access", "Sealed rotating lid", "Up to 180-day battery"], details: [{ title: "Stops food stealing", text: "The feeder recognises an authorised RFID collar before opening, ideal for different diets in one home." }, { title: "Two foods, one place", text: "A dual-chamber 400ml bowl supports dry and wet combinations while the rotating lid protects freshness." }, { title: "Quiet and compact", text: "Low-noise movement, a small footprint and long battery life make it easy to place almost anywhere." }], specs: [["Bowl", "Dual chamber, 400ml"], ["Access", "RFID collar"], ["Battery", "Up to 180 days"], ["Food", "Dry and wet"]], officialUrl: "https://catlinkeu.com/products/catlink-rfid-f03-pro-pet-feeder" },
  { slug: "facelink-feeder", category: "Feeders", name: "Facelink Feeder", type: "Camera-enabled multi-cat feeder", price: "€251,99", was: "€399,00", badge: "Camera ID", tagline: "A feeder that learns every face.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-facelink-automatic-cat-feeder-with-multi-cat-detection-543712.jpg?v=1746755332&width=1080", description: "Camera-based cat recognition, personalised portions and real-time intake tracking for multi-cat households.", features: ["2MP wide-angle camera", "Personalised portions", "Daily health reports"], details: [{ title: "Recognises who arrived", text: "A wide-angle camera helps distinguish cats and connects each meal with the right profile." }, { title: "Portions made individual", text: "Manual, smart, timer and diet modes support different routines without food competition." }, { title: "See meals remotely", text: "The Catlink app shows camera check-ins, intake data and daily summaries while you are away." }], specs: [["Camera", "2MP / 161.6°"], ["Food storage", "3.5L"], ["Bowl", "Ceramic with weight sensor"], ["Modes", "Four feeding modes"]], officialUrl: "https://catlinkeu.com/products/catlink-facelink-automatic-cat-feeder-with-multi-cat-detection" },
  { slug: "w02-pure-2", category: "Water fountains", name: "W02 Pure 2", type: "App-connected filtered water fountain", price: "€73,99", was: "€85,99", badge: "Pure 2", tagline: "Fresh water, measured every day.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-al-water-fountain-pure-2-3054774.webp?v=1765916842&width=1080", description: "Continuously filtered flowing water with app intake tracking, refill reminders and water-electric separation.", features: ["Real-time intake", "Multi-layer filtration", "Smart refill reminders"], details: [{ title: "Tracks every drink", text: "Daily water intake appears in the Catlink app, making small routine changes easier to notice." }, { title: "Filters every cycle", text: "A human-grade filtration system continuously refreshes water and reduces impurities." }, { title: "Built for safer water", text: "Water-electric separation prevents microcurrents while app alerts cover refills and filter changes." }], specs: [["Monitoring", "App-connected"], ["Filtration", "Human-grade multi-layer"], ["Safety", "Water-electric separation"], ["Flow", "Multiple modes"]], officialUrl: "https://catlinkeu.com/products/catlink-al-water-fountain-pure-2" },
  { slug: "w03-wireless", category: "Water fountains", name: "W03 Wireless", type: "Cordless smart water fountain", price: "€79,99", was: "€99,99", badge: "Wireless", tagline: "Fresh water, wherever they prefer it.", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-w03-smart-cat-water-fountain-wireless-1086038.png?v=1765834012&width=1080", description: "A quiet 2.3L cordless fountain with five smart modes, long battery life and enclosed filtration.", features: ["Up to 150-day battery", "Five smart modes", "30 dB operation"], details: [{ title: "No outlet required", text: "A 5000mAh battery makes the fountain easy to place in the cat's favourite drinking spot." }, { title: "Responds to their routine", text: "Five operating modes include night settings and bio-sensor activation for efficient water flow." }, { title: "Quiet, clean and ready", text: "Enclosed filtration, low-water alerts and near-silent operation keep daily hydration simple." }], specs: [["Reservoir", "2.3L"], ["Battery", "5000mAh / up to 150 days"], ["Noise", "30 dB"], ["Modes", "Five"]], officialUrl: "https://catlinkeu.com/products/catlink-w03-real-wireless-water-fountain" },
];

const productGalleries = {
  "scoop-robot-c07": [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-scoop-robot-c07-auto-refill-self-cleaning-smart-litter-box-6819415.jpg?v=1784934876&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-scoop-robot-c07-auto-refill-self-cleaning-smart-litter-box-3923186.jpg?v=1784272050&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-scoop-robot-c07-auto-refill-self-cleaning-smart-litter-box-1882868.jpg?v=1784271992&width=1080",
  ],
  "pro-x-ultra": [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-pro-x-ultra-self-cleaning-litter-box-9608902.png?v=1774412111&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-pro-x-luxury-self-cleaning-litter-box-359590.webp?v=1775197784&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-pro-x-ultra-self-cleaning-litter-boxpre-order-4765860.png?v=1774337238&width=1080",
  ],
  "pro-x-luxury": [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-pro-x-luxury-self-cleaning-litter-box-9574794.png?v=1774412112&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-pro-x-luxury-self-cleaning-litter-boxpre-order-2547605.png?v=1774337122&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-pro-x-luxury-self-cleaning-litter-boxpre-order-3390246.png?v=1774337122&width=1080",
  ],
  young: [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-young-self-cleaning-litter-box-3666432.png?v=1774412112&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-young-self-cleaning-litter-box-341070.jpg?v=1774336965&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-young-self-cleaning-litter-box-4836584.png?v=1774336965&width=1080",
  ],
  "baymax-sakura": [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-baymax-sakura-self-cleaning-litter-box-1524108.png?v=1770968481&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-baymax-pink-self-cleaning-litter-box-6844027.png?v=1770968481&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-baymax-sakura-self-cleaning-litter-box-5303306.png?v=1770968481&width=1080",
  ],
  baymax: [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-baymax-white-pink-self-cleaning-litter-box-6343300.png?v=1768362739&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-baymax-white-self-cleaning-litter-box-264297.webp?v=1768272447&width=1080",
    "https://catlinkeu.com/cdn/shop/files/5ad2d7eb379ee0c3a0e3d5b16b792e35.gif?v=1769767725&width=1080",
  ],
  "baymax-lite": [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-baymax-lite-gray-self-cleaning-litter-box-5347369.jpg?v=1768272756&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-baymax-lite-gray-self-cleaning-litter-box-754371.webp?v=1768271890&width=1080",
    "https://catlinkeu.com/cdn/shop/files/5ad2d7eb379ee0c3a0e3d5b16b792e35.gif?v=1769767725&width=1080",
  ],
  "open-x": [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-open-x-open-top-self-cleaning-litter-box-3982096.png?v=1774839515&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-euearly-bird-pre-order-10-deposit-catlink-open-x-open-top-self-cleaning-cat-litter-box-4662358.webp?v=1776060377&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-open-x-open-top-self-cleaning-litter-box-7936216.jpg?v=1777394616&width=1080",
  ],
  "open-x-lite": [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-open-x-lite-open-top-self-cleaning-litter-box-4552938.png?v=1777394679&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-open-x-lite-open-top-self-cleaning-litter-box-9275035.png?v=1777394683&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-open-x-lite-open-top-self-cleaning-litter-box-1284511.png?v=1777394683&width=1080",
  ],
  "f04-fresh-2": [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-fresh-2-luxury-automatic-feeder-904553.jpg?v=1764553404&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-automatic-feeder-f04-fresh-2-luxury-7446811.png?v=1765834081&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-automatic-feeder-f04-fresh-2-luxury-9288831.png?v=1765834084&width=1080",
  ],
  "f03-rfid": [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-rfid-f03-pro-pet-feeder-266876.jpg?v=1764553437&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-rfid-f03-standard-pet-feeder-9219585.png?v=1765834077&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-rfid-f03-standard-pet-feeder-1618867.png?v=1765834077&width=1080",
  ],
  "facelink-feeder": [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-facelink-automatic-cat-feeder-with-multi-cat-detection-543712.jpg?v=1746755332&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-facelink-automatic-cat-feeder-with-multi-cat-detection-800414.jpg?v=1746755333&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-facelink-automatic-cat-feeder-with-multi-cat-detection-500247.jpg?v=1746755334&width=1080",
  ],
  "w02-pure-2": [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-al-water-fountain-pure-2-3054774.webp?v=1765916842&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-al-water-fountain-pure-2-6083287.webp?v=1765916844&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-al-water-fountain-pure-2-1511921.webp?v=1765916845&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-al-water-fountain-pure-2-7141873.webp?v=1765916846&width=1080",
  ],
  "w03-wireless": [
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-w03-smart-cat-water-fountain-wireless-1086038.png?v=1765834012&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-w03-smart-cat-water-fountain-wireless-763008.jpg?v=1764553473&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-w03-smart-cat-water-fountain-wireless-7208981.png?v=1765834013&width=1080",
    "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-w03-smart-cat-water-fountain-wireless-9659368.png?v=1765834012&width=1080",
  ],
};

const productEditorial = {
  "scoop-robot-c07": { bestFor: "large cats, busy homes and the longest hands-free routine", overview: "Its 82L cabin gives large breeds room to move, while automatic litter refilling and a 15L waste tank reduce the number of interruptions between deep cleans. Dual cameras add another layer of visibility for households that want to follow each cat’s routine closely.", important: ["Cabin", "Hands-free"] },
  "pro-x-ultra": { bestFor: "owners who want remote video and detailed multi-cat insight", overview: "Pro-X Ultra combines automatic cleaning with a wide-angle camera, dual-band Wi-Fi and individual profiles for up to ten cats. It is the most connected Pro model for checking visits, spotting routine changes and keeping the litter area fresh while away.", important: ["Connectivity", "Cat profiles"] },
  "pro-x-luxury": { bestFor: "multi-cat homes prioritising hygiene, safety and low maintenance", overview: "A large sealed waste tank, rolling clean cycle and dual sterilisation system work together to contain odour and keep the drum ready for the next visit. Weight-based identification separates each cat’s activity without requiring a camera.", important: ["Hands-free", "Safety"] },
  young: { bestFor: "senior cats and homes that prefer simple physical controls", overview: "Young keeps the core self-cleaning experience approachable with plug-and-play setup, one-touch emptying and a wide, low entrance. The generous globe and optional step make it easier for smaller, older or short-legged cats to enter comfortably.", important: ["Globe", "Cat weight"] },
  "baymax-sakura": { bestFor: "style-conscious multi-cat homes wanting full Baymax intelligence", overview: "The Sakura edition brings Cat ID recognition, app health reports and a comprehensive sensor system into a soft pink finish. Its enclosed globe and sealed waste drawer help keep scattered litter and odour away from the room.", important: ["Globe", "Cat weight"] },
  baymax: { bestFor: "most households seeking a balanced smart litter box", overview: "Baymax pairs everyday automatic cleaning with multi-cat recognition and a compact 7L waste drawer. Soft-stool mode, deodorising gel and a gravity-sealed door make it a practical all-rounder for cleaner floors and clearer health records.", important: ["Hands-free", "Cat weight"] },
  "baymax-lite": { bestFor: "single-cat homes that want automation at a lower starting price", overview: "Baymax Lite includes automatic cleaning and app-connected health logs from day one. Owners can add multi-cat recognition later, making it a flexible entry point that can grow with the household.", important: ["Recognition", "Waste tank"] },
  "open-x": { bestFor: "large, cautious or multiple cats that prefer an open top", overview: "The open structure removes the enclosed feeling while retaining automatic scooping, a large sealed tank and multi-cat monitoring. Removable washable parts and one-tap emptying also make regular deep cleaning easier to manage.", important: ["Cat weight", "Waste tank"] },
  "open-x-lite": { bestFor: "one large cat that prefers open access", overview: "Open-X Lite keeps the same roomy open-top format and 12L waste capacity while focusing its standard tracking on one cat. Multi-cat recognition remains available as an upgrade if the household changes later.", important: ["Cat weight", "Recognition"] },
  "f04-fresh-2": { bestFor: "scheduled dry-food portions in a multi-cat home", overview: "RFID recognition links meals to the correct cat, while the 4L sealed hopper stores enough dry food for dependable daily schedules. Dual power and app control help feeding continue even when routines or power access change.", important: ["Food storage", "Meals"] },
  "f03-rfid": { bestFor: "preventing food stealing or managing different diets", overview: "The rotating lid opens only for an authorised RFID collar and closes again when the cat leaves. Two bowl compartments support wet and dry combinations, while long battery life allows flexible placement without a nearby socket.", important: ["Access", "Battery"] },
  "facelink-feeder": { bestFor: "camera-based meal tracking across several cats", overview: "Facelink uses its wide-angle camera to associate feeding visits with individual cats and record intake in the app. Its ceramic bowl includes a weight sensor, helping personalised portions and diet limits stay measurable.", important: ["Camera", "Bowl"] },
  "w02-pure-2": { bestFor: "app-connected hydration tracking and continuous filtration", overview: "Pure 2 records drinking activity, sends refill and filter reminders and keeps water circulating through a multi-layer filtration system. Water-electric separation adds reassurance for a fountain designed to run throughout the day.", important: ["Monitoring", "Safety"] },
  "w03-wireless": { bestFor: "placing fresh water wherever a cat naturally prefers to drink", overview: "A 5000mAh battery removes the need for a nearby outlet, while five operating modes adapt flow to different routines and times of day. The 2.3L reservoir and quiet 30 dB operation suit bedrooms, hallways and calm living spaces.", important: ["Battery", "Noise"] },
};

const extras = [
  { category: "Accessories", name: "Open-X Time-Saver Pack", type: "3, 6 or 12-month care kit", price: "from €82,12", image: "https://catlinkeu.com/cdn/shop/files/catlink-eutime-saver-accessories-pack-3612-month-for-open-x-7154217.png?v=1789550179&width=1080", officialUrl: "https://catlinkeu.com/products/time-saver-accessories-pack-3-6-12-month-for-open-x", description: "Waste bags, litter mats and odour care sized for Open-X and Open-X Lite.", features: ["Multiple pack sizes", "Official consumables", "Open-X compatible"] },
  { category: "Accessories", name: "Open-X Waste Bags", type: "Drawstring waste bags", price: "from €12,99", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-open-x-waste-bags-1359916.png?v=1766331153&width=1080", officialUrl: "https://catlinkeu.com/products/open-x-trash-bag", description: "Reinforced drawstring bags designed for the Open-X 12L waste drawer.", features: ["Two rolls per pack", "20 bags per roll", "Easy-seal drawstrings"] },
  { category: "Accessories", name: "Baymax Waste Bags", type: "Odour-lock waste bags", price: "from €12,99", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-baymax-waste-bags-for-baymax-litter-box-2-pack-369996.jpg?v=1747015889&width=1080", officialUrl: "https://catlinkeu.com/products/catlink-waste-bags-for-baymax-litter-box-2-pack", description: "Durable replacement bags made for the Baymax 13L waste container.", features: ["Two rolls per pack", "20 bags per roll", "Baymax fit"] },
  { category: "Accessories", name: "Pro-X Carbon Filter", type: "Replacement odour filter", price: "from €23,99", image: "https://catlinkeu.com/cdn/shop/files/catlink-eucatlink-pro-x-young-activated-carbon-filter-box-1-pcs-973435.png?v=1748143803&width=1080", officialUrl: "https://catlinkeu.com/products/catlink-activated-carbon-filter-box-1-pc", description: "An easy-fit activated carbon filter for Pro-X and Young litter boxes.", features: ["Odour control", "Easy installation", "Pro-X and Young"] },
  { category: "Bundles", name: "Clean & Feed Complete Set", type: "Litter box, feeder and fountain", price: "from €383,99", image: "https://catlinkeu.com/cdn/shop/files/catlink-eulitter-box-feeder-water-fountain-complete-set-5062047.png?v=1767822931&width=1080", officialUrl: "https://catlinkeu.com/products/litter-box-feeder-water-fountain-complete-set", description: "Build a connected cleaning, feeding and hydration setup around one Catlink app.", features: ["Three care categories", "Configurable models", "One connected app"] },
  { category: "Bundles", name: "Feed & Hydrate Duo", type: "Two-device bundle", price: "from €147,42", image: "https://catlinkeu.com/cdn/shop/files/catlink-eubundle-catlink-feeder-catlink-feeder-or-drinker-1567546.png?v=1767242591&width=1080", officialUrl: "https://catlinkeu.com/products/bundle-catlink-automatic-feeder", description: "Pair two feeders or combine a feeder and water fountain for everyday care.", features: ["Mix and match", "App connected", "Multi-pet friendly"] },
  { category: "Bundles", name: "Two Litter Box Bundle", type: "Multi-box household set", price: "from €737,18", image: "https://catlinkeu.com/cdn/shop/files/catlink-eubundle-package-catlink-litter-box-2738463.png?v=1765999839&width=1080", officialUrl: "https://catlinkeu.com/products/bundle-catlink-litter-box", description: "Choose two compatible self-cleaning boxes with matching care accessories.", features: ["Two-box setup", "Choice of models", "Accessories included"] },
];

function StockStatus({ officialUrl }) {
  const [status, setStatus] = useState("checking");
  useEffect(() => {
    const handle = new URL(officialUrl).pathname.split("/products/")[1]?.split("/")[0];
    if (!handle) return setStatus("unknown");
    fetch(`https://catlinkeu.com/products/${handle}.js`)
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(product => setStatus(product.available || product.variants?.some(variant => variant.available) ? "available" : "sold-out"))
      .catch(() => setStatus("unknown"));
  }, [officialUrl]);
  return <span className={`stock-status ${status}`}>{status === "available" ? "In stock at Catlink EU" : status === "sold-out" ? "Currently sold out" : status === "checking" ? "Checking live stock…" : "Check stock at Catlink EU"}</span>;
}

function ProductCatalog() {
  const sections = [
    { id: "litter-boxes", name: "Litter boxes", eyebrow: "Automatic cleaning", copy: "Nine smart litter boxes for different cats, spaces and levels of automation.", items: catalog.filter(item => !item.category) },
    { id: "feeders", name: "Smart feeders", eyebrow: "Personalised meals", copy: "RFID and camera-enabled feeding for portions, schedules and multi-cat routines.", items: catalog.filter(item => item.category === "Feeders") },
    { id: "water-fountains", name: "Water fountains", eyebrow: "Connected hydration", copy: "Filtered water, intake monitoring and reminders through the same Catlink app.", items: catalog.filter(item => item.category === "Water fountains") },
    { id: "accessories", name: "Accessories", eyebrow: "Keep care running", copy: "Official consumables and replacement parts for the most-used Catlink models.", items: extras.filter(item => item.category === "Accessories"), external: true },
    { id: "bundles", name: "Bundles", eyebrow: "Connected sets", copy: "Multi-device combinations for cleaning, feeding and hydration.", items: extras.filter(item => item.category === "Bundles"), external: true },
  ];
  return <main id="main-content" className="catalog-page">
    <section className="catalog-hero"><div><p className="kicker">The complete Catlink range</p><h1>One app.<br /><span>Every routine.</span></h1><p>Smart litter boxes, personalised feeders and filtered fountains designed to work together.</p><nav className="catalog-jump" aria-label="Product categories">{sections.map(section => <a href={`#${section.id}`} key={section.id}>{section.name}</a>)}</nav></div><img src={officialMedia.catalogFamily} srcSet={officialImageSrcSet(officialMedia.catalogFamily)} sizes="(max-width: 900px) 90vw, 55vw" alt="Catlink smart litter box, feeder and water fountain" fetchPriority="high" decoding="async" /></section>
    <section className="catalog-shell catalog-all">
      <div className="catalog-heading"><div><p className="kicker">All smart devices</p><h2>Built around their routine.</h2></div><p>Fourteen official EU models across cleaning, feeding and hydration—with each device connected through the Catlink app.</p></div>
      {sections.map(section => <section className="catalog-category" id={section.id} key={section.id}>
        <Reveal className="catalog-category-heading"><div><p className="kicker">{section.eyebrow}</p><h2>{section.name}</h2></div><p>{section.copy}</p><span>{String(section.items.length).padStart(2, "0")} models</span></Reveal>
        <div className="catalog-grid">{section.items.map((item, i) => <Reveal className="catalog-card" key={item.name} delay={(i % 3) * .05}>
          <a className="catalog-card-link" href={section.external ? item.officialUrl : pageHref(`/products/${item.slug}`)} target={section.external ? "_blank" : undefined} rel={section.external ? "noreferrer" : undefined} aria-label={`View ${item.name}`}>
            <div className="catalog-art"><img src={item.image} srcSet={officialImageSrcSet(item.image)} sizes="(max-width: 600px) calc(100vw - 20px), (max-width: 900px) 50vw, 33vw" alt={`${item.name} by Catlink`} loading="lazy" decoding="async" /><span>{item.badge}</span></div>
            <div className="catalog-copy"><small>{item.type}</small><h3>{item.name}</h3><p>{item.description}</p><StockStatus officialUrl={item.officialUrl} /><ul>{item.features.map(f => <li key={f}>{f}</li>)}</ul><div className="catalog-price"><div>{item.was && <s>{item.was}</s>}<strong>{item.price}</strong></div><span>View <ArrowRight /></span></div></div>
          </a>
        </Reveal>)}</div>
      </section>)}
    </section>
    <section id="contact-sales" className="catalog-service"><div><span>2-year warranty</span><span>30-day returns</span><span>Ships from Germany</span><span>EU tax included</span></div><h2>Care that continues after checkout.</h2><p>Support, maintenance packs and replacement parts are available across the Catlink EU range.</p><a className="button" href="mailto:Support@catlinkeu.com">Contact Catlink EU</a></section>
  </main>;
}

function ProductDetail({ product }) {
  const category = product.category || "Litter boxes";
  const related = [...catalog.filter(item => (item.category || "Litter boxes") === category && item.slug !== product.slug), ...catalog.filter(item => (item.category || "Litter boxes") !== category)].slice(0, 3);
  const gallery = productGalleries[product.slug] || [product.image];
  const editorial = productEditorial[product.slug] || { bestFor: "simplifying everyday care", overview: product.description, important: product.specs.slice(0, 2).map(([label]) => label) };
  const galleryRef = useRef(null);
  const [activeImage, setActiveImage] = useState(0);
  const moveGallery = (direction) => {
    const next = (activeImage + direction + gallery.length) % gallery.length;
    galleryRef.current?.scrollTo({ left: galleryRef.current.clientWidth * next, behavior: "smooth" });
    setActiveImage(next);
  };
  return <main id="main-content" className="detail-page">
    <section className="detail-hero">
      <a className="detail-back" href={pageHref("/products")}>← All products</a>
      <div className="detail-hero-grid">
        <motion.div className="detail-gallery" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .75, ease }}>
          <div className="detail-gallery-track" ref={galleryRef} onScroll={(event) => setActiveImage(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))}>
            {gallery.map((src, index) => <figure className="detail-slide" key={src}>
              <img src={src} srcSet={index === 0 ? officialImageSrcSet(src) : undefined} sizes={index === 0 ? "(max-width: 900px) 100vw, 50vw" : undefined} alt={`${product.name} by Catlink, view ${index + 1}`} loading={index ? "lazy" : "eager"} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" />
              {index === 0 && <span>{product.badge}</span>}
            </figure>)}
          </div>
          <div className="detail-gallery-controls">
            <span>{String(activeImage + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")} · Scroll to explore</span>
            <div><button type="button" onClick={() => moveGallery(-1)} aria-label="Previous product image"><ChevronLeft /></button><button type="button" onClick={() => moveGallery(1)} aria-label="Next product image"><ChevronRight /></button></div>
          </div>
        </motion.div>
        <motion.div className="detail-intro" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .1 } } }}>
          <motion.p className="kicker" variants={fade}>{product.type}</motion.p>
          <motion.h1 variants={fade}>{product.name}</motion.h1>
          <motion.h2 variants={fade}>{product.tagline}</motion.h2>
          <motion.p variants={fade}>{product.description}</motion.p>
          <motion.p className="detail-best-for" variants={fade}><strong>Best for</strong>{editorial.bestFor}</motion.p>
          <motion.div className="detail-buy" variants={fade}><div><s>{product.was}</s><strong>{product.price}</strong><small>EU tax included</small></div><a className="button" href={product.officialUrl} target="_blank" rel="noreferrer">View official listing</a></motion.div>
          <motion.div className="detail-assurances" variants={fade}><StockStatus officialUrl={product.officialUrl} /><span>2-year warranty</span><span>30-day returns</span><span>Ships from Germany</span></motion.div>
        </motion.div>
      </div>
    </section>
    <section className="detail-story">
      <Reveal className="detail-heading"><p className="kicker">Why {product.name}</p><div><h2>Designed around<br />daily life.</h2><p className="detail-overview-copy">{editorial.overview}</p><div className="detail-feature-tags">{product.features.map(feature => <span key={feature}>{feature}</span>)}</div></div></Reveal>
      <div className="detail-features">{product.details.map((detail, i) => <Reveal className="detail-feature" key={detail.title} delay={i * .06}><span>0{i + 1}</span><h3>{detail.title}</h3><p>{detail.text}</p></Reveal>)}</div>
    </section>
    <section className="detail-specs">
      <Reveal><p className="kicker">At a glance</p><h2>The details<br />that matter.</h2><p className="detail-specs-intro">The most important differences for this model are highlighted first.</p></Reveal>
      <div>{product.specs.map(([label, value]) => {
        const isImportant = editorial.important.includes(label);
        return <Reveal className={`detail-spec ${isImportant ? "is-important" : ""}`} key={label}><div className="detail-spec-label"><span>{label}</span>{isImportant && <small>Key detail</small>}</div><strong>{value}</strong></Reveal>;
      })}</div>
    </section>
    <section className="detail-related"><div><p className="kicker">Keep exploring</p><h2>More from Catlink.</h2></div><div className="related-grid">{related.map(item => <a href={pageHref(`/products/${item.slug}`)} key={item.slug}><div><img src={item.image} alt="" loading="lazy" /></div><span>{item.type}</span><h3>{item.name}</h3><p>{item.price} <ChevronRight /></p></a>)}</div></section>
  </main>;
}

const guideGroups = [
  {
    id: "maximum-care",
    number: "01",
    eyebrow: "Maximum automation",
    title: "For less maintenance and deeper health insight.",
    intro: "Choose from the Pro range when long hands-free periods, advanced safety and detailed monitoring matter most.",
    products: [
      { slug: "scoop-robot-c07", bestFor: "The fewest refills and largest cats", note: "Auto-refill · Dual AI cameras" },
      { slug: "pro-x-ultra", bestFor: "Video check-ins and health visibility", note: "HD camera · Dual-band Wi-Fi" },
      { slug: "pro-x-luxury", bestFor: "Premium hygiene without a camera", note: "Dual sterilisation · Multi-cat profiles" },
    ],
  },
  {
    id: "everyday-care",
    number: "02",
    eyebrow: "Enclosed everyday care",
    title: "For a compact, contained routine.",
    intro: "These models keep litter and odour enclosed while offering different levels of app intelligence and simplicity.",
    products: [
      { slug: "young", bestFor: "Simple controls and senior cats", note: "Wide entry · 13L waste tank" },
      { slug: "baymax", bestFor: "A balanced multi-cat home", note: "Cat ID · Soft-stool mode" },
      { slug: "baymax-sakura", bestFor: "The Baymax experience in pink", note: "Multi-cat profiles · Sakura finish" },
      { slug: "baymax-lite", bestFor: "One cat and a lower starting price", note: "Single-cat tracking · Upgradeable" },
    ],
  },
  {
    id: "open-comfort",
    number: "03",
    eyebrow: "Open-top comfort",
    title: "For large cats and cats who dislike enclosed spaces.",
    intro: "Open-X keeps the top clear, offers a roomy entrance and makes the cleaning drum easy to reach and wash.",
    products: [
      { slug: "open-x", bestFor: "Large or multiple cats", note: "Multi-cat recognition included" },
      { slug: "open-x-lite", bestFor: "One large cat with room to upgrade", note: "Single-cat tracking · Upgradeable" },
    ],
  },
];

const finderModels = [
  { slug: "scoop-robot-c07", multi: true, shape: "enclosed", large: true, handsFree: 20, camera: true, easyEntry: false, price: 849.99, reason: "the longest hands-free period, room for large cats and dual cameras" },
  { slug: "pro-x-ultra", multi: true, shape: "enclosed", large: false, handsFree: 15, camera: true, easyEntry: false, price: 566.99, reason: "camera check-ins, advanced hygiene and detailed multi-cat monitoring" },
  { slug: "pro-x-luxury", multi: true, shape: "enclosed", large: false, handsFree: 15, camera: false, easyEntry: false, price: 494.99, reason: "premium odour control and long hands-free care without a camera" },
  { slug: "young", multi: true, shape: "enclosed", large: false, handsFree: 15, camera: false, easyEntry: true, price: 404.99, reason: "simple controls, a wide entrance and senior-friendly access" },
  { slug: "baymax", multi: true, shape: "enclosed", large: false, handsFree: 7, camera: false, easyEntry: false, price: 305.99, reason: "balanced multi-cat tracking in a compact enclosed design" },
  { slug: "baymax-sakura", multi: true, shape: "enclosed", large: false, handsFree: 7, camera: false, easyEntry: false, price: 314.99, reason: "the complete Baymax routine in a more expressive finish" },
  { slug: "baymax-lite", multi: false, shape: "enclosed", large: false, handsFree: 7, camera: false, easyEntry: false, price: 278.99, reason: "essential single-cat automation at the lowest enclosed-box price" },
  { slug: "open-x", multi: true, shape: "open", large: true, handsFree: 15, camera: false, easyEntry: true, price: 224.99, reason: "open-top comfort, large-cat space and multi-cat recognition" },
  { slug: "open-x-lite", multi: false, shape: "open", large: true, handsFree: 15, camera: false, easyEntry: true, price: 234.99, reason: "an affordable open design for one large or enclosure-shy cat" },
];

const finderQuestions = [
  { key: "cats", label: "How many cats will share it?", help: "Standard models recognise multiple cats. Lite models begin with single-cat tracking and can be upgraded later.", options: [["one", "One cat"], ["multi", "Two or more"]] },
  { key: "shape", label: "Which entrance feels best?", help: "Open-X suits large cats or cats that avoid covers. Enclosed models contain more scattered litter.", options: [["enclosed", "Enclosed"], ["open", "Open top"], ["unsure", "Not sure"]] },
  { key: "priority", label: "What matters most?", help: "Choose fewer changes, deeper camera insights, a lower starting price or easier access for senior cats.", options: [["hands-free", "Less maintenance"], ["camera", "Camera & health"], ["budget", "Lower price"], ["easy", "Easy entry"]] },
];

function rankFinderModel(profile, answers) {
  let score = 0;
  if (answers.cats === "multi") score += profile.multi ? 5 : -4;
  if (answers.cats === "one") score += profile.multi ? 0 : 2;
  if (answers.shape === "open") score += profile.shape === "open" ? 7 : -5;
  if (answers.shape === "enclosed") score += profile.shape === "enclosed" ? 5 : -3;
  if (answers.priority === "hands-free") score += profile.handsFree / 2;
  if (answers.priority === "camera") score += profile.camera ? 9 : 0;
  if (answers.priority === "budget") score += Math.max(0, (900 - profile.price) / 75);
  if (answers.priority === "easy") score += profile.easyEntry ? 8 : 0;
  return score;
}

function HowToChoose() {
  const guideProduct = slug => catalog.find(item => item.slug === slug);
  const [finderAnswers, setFinderAnswers] = useState({ cats: null, shape: null, priority: null });
  const answered = Object.values(finderAnswers).filter(Boolean).length;
  const finderResults = finderModels.map(profile => ({ ...profile, product: guideProduct(profile.slug), score: rankFinderModel(profile, finderAnswers) })).sort((a, b) => b.score - a.score || a.price - b.price);
  const bestMatch = finderResults[0];
  const isCompatible = (questionKey, value) => {
    if (questionKey === "priority" && finderAnswers.shape === "open") return false;
    const next = { ...finderAnswers, [questionKey]: value };
    return finderModels.some(model => {
      if (next.cats === "multi" && !model.multi) return false;
      if (next.shape && next.shape !== "unsure" && model.shape !== next.shape) return false;
      if (next.priority === "camera" && !model.camera) return false;
      if (next.priority === "easy" && !model.easyEntry) return false;
      if (next.priority === "budget" && model.price > 350) return false;
      return true;
    });
  };
  const chooseAnswer = (key, value) => setFinderAnswers(current => {
    const next = { ...current, [key]: current[key] === value ? null : value };
    if (key === "shape" && value === "open") next.priority = null;
    return next;
  });
  return <main id="main-content" className="guide-page">
    <section className="guide-hero">
      <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .1 } } }}>
        <motion.p className="kicker" variants={fade}>How to choose</motion.p>
        <motion.h1 variants={fade}>The right litter box<br /><span>starts with your cat.</span></motion.h1>
        <motion.p variants={fade}>Skip the giant specification chart. Start with the way your cats live, then compare only the differences that matter.</motion.p>
      </motion.div>
      <div className="guide-jump">
        <span>Start with your priority</span>
        <a href="#finder"><b>Find my best match</b><small>Three quick choices</small></a>
        <a href="#maximum-care"><b>Maximum automation</b><small>10–20 days hands-free</small></a>
        <a href="#everyday-care"><b>Enclosed everyday care</b><small>Compact and contained</small></a>
        <a href="#open-comfort"><b>Open-top comfort</b><small>Room for larger cats</small></a>
      </div>
    </section>

    <section className="finder-section" id="finder">
      <Reveal className="finder-heading"><div><p className="kicker">Three questions · Find your fit</p><h2>Decide in the<br />right order.</h2></div><p>Choose what describes your cats and your home. The guidance and recommendation now live together, updating instantly with every answer.</p></Reveal>
      <div className="finder-layout">
        <div className="finder-controls">{finderQuestions.map((question, index) => <fieldset key={question.key}>
          <legend><span>0{index + 1}</span>{question.label}</legend>
          <p className="finder-help">{question.help}</p>
          <div>{question.options.map(([value, label]) => { const disabled = !isCompatible(question.key, value); return <button type="button" key={value} disabled={disabled} aria-pressed={finderAnswers[question.key] === value} onClick={() => chooseAnswer(question.key, value)}>{label}</button>; })}</div>
        </fieldset>)}
        <button className="finder-reset" type="button" onClick={() => setFinderAnswers({ cats: null, shape: null, priority: null })} disabled={!answered}>Reset choices</button></div>
        <div className="finder-result" aria-live="polite">
          {answered ? <><div className="finder-result-art"><img src={bestMatch.product.image} alt={`${bestMatch.product.name} self-cleaning litter box`} /><span>Best match</span></div><div className="finder-result-copy"><p>{answered === 3 ? "Your recommendation" : `${answered} of 3 choices selected`}</p><h3>{bestMatch.product.name}</h3><strong>{bestMatch.product.price}</strong><p>Best suited to your choices because it offers {bestMatch.reason}.</p><div className="finder-result-tags"><span>{bestMatch.shape === "open" ? "Open top" : "Enclosed"}</span><span>{bestMatch.multi ? "Multi-cat ready" : "Single-cat start"}</span><span>Up to {bestMatch.handsFree} days</span></div><a className="button" href={pageHref(`/products/${bestMatch.slug}`)}>View {bestMatch.product.name}</a></div></> : <div className="finder-empty"><span>01—03</span><h3>Choose any answer to begin.</h3><p>Your closest match will appear here, then become more precise with every choice.</p></div>}
        </div>
      </div>
    </section>

    <section className="guide-groups">{guideGroups.map(group => <section className="guide-group" id={group.id} key={group.id}>
      <Reveal className="guide-group-heading"><span>{group.number}</span><div><p className="kicker">{group.eyebrow}</p><h2>{group.title}</h2><p>{group.intro}</p></div></Reveal>
      <div className={`guide-models count-${group.products.length}`}>{group.products.map((choice, i) => {
        const product = guideProduct(choice.slug);
        return <Reveal className="guide-model" key={choice.slug} delay={(i % 3) * .05}>
          <a href={pageHref(`/products/${product.slug}`)}>
            <div className="guide-model-image"><img src={product.image} alt={`${product.name} self-cleaning litter box`} loading="lazy" /><span>{product.badge}</span></div>
            <div className="guide-model-copy"><p>{product.type}</p><h3>{product.name}</h3><strong>{choice.bestFor}</strong><small>{choice.note}</small><div><span>{product.price}</span><b>View model <ChevronRight /></b></div></div>
          </a>
        </Reveal>;
      })}</div>
    </section>)}</section>

    <section className="guide-rule"><Reveal><p className="kicker">The simple rule</p><h2>Choose comfort first.<br /><span>Features second.</span></h2><p>If your cat will not comfortably enter the box, the technology does not matter. Start with open versus enclosed, then choose the monitoring and maintenance level that suits your home.</p><a className="button" href={pageHref("/products")}>See every model</a></Reveal></section>
  </main>;
}

const customerReviews = [
  { name: "Athina D.", place: "Greece", rating: 5, source: "Trustpilot", model: "Baymax", text: "Baymax has made my daily routine noticeably easier. My cat accepted it, and the customer service experience was excellent." },
  { name: "Nicole", place: "Verified purchase", rating: 5, source: "Walmart", model: "CATLINK automatic litter box", text: "With four cats at home, I found setup straightforward and loved the clean design. I ultimately bought three units." },
  { name: "Jess", place: "Verified purchase", rating: 5, source: "Walmart", model: "CATLINK automatic litter box", text: "The cat who had rejected litter boxes for years was the first to try it. All five of my cats now use the new box." },
  { name: "Ashlee", place: "Verified purchase", rating: 5, source: "Walmart", model: "CATLINK automatic litter box", text: "I went from scooping several times a day for two cats to emptying the drawer roughly once a week." },
  { name: "Rachael", place: "Verified purchase", rating: 5, source: "Walmart", model: "CATLINK automatic litter box", text: "I love the quiet cleaning, odour control, safety sensors and weight tracking. I only wish the front guard were taller." },
  { name: "albform", place: "Verified purchase", rating: 4, source: "Walmart", model: "CATLINK automatic litter box", text: "It is a strong time-saver with a roomy, odour-contained drawer. I occasionally still remove smaller clumps by hand." },
];

const customerPhotos = [
  { src: "https://review-images.judgeme.com/catlink-eu/1789288938__img_3886__original.JPEG?quality=80&width=1024", alt: "Vlad's Open-X litter box at home", label: "Vlad · Open-X" },
  { src: "https://review-images.judgeme.com/catlink-eu/1786964732__1786964727904-1000023032__original.jpg?quality=80&width=1024", alt: "Sandra's Open-X litter box at home", label: "Sandra · Open-X" },
  { src: "https://review-images.judgeme.com/catlink-eu/1769069945__1769069921049-img_3014__original.jpeg?quality=80&width=1024", alt: "Marta's Pro-X Luxury litter box at home", label: "Marta · Pro-X Luxury" },
  { src: "https://review-images.judgeme.com/catlink-eu/1766582876__1000018187__original.jpg?quality=80&width=1024", alt: "Nektarios's Pro-X Luxury litter box at home", label: "Nektarios · Pro-X Luxury" },
];

const featurePhoto = { src: "https://review-images.judgeme.com/catlink-eu/1789288944__img_3887__original.JPEG?quality=80&width=1024", alt: "Customer cat exploring a Catlink self-cleaning litter box at home" };

function ReviewsPage() {
  return <main id="main-content" className="reviews-page">
    <section className="reviews-hero">
      <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .1 } } }}>
        <motion.p className="kicker" variants={fade}>Customer stories</motion.p>
        <motion.h1 variants={fade}>Real homes.<br /><span>Real routines.</span></motion.h1>
        <motion.p variants={fade}>What changes after the box arrives—from the first cautious inspection to the moment scooping stops being a daily job.</motion.p>
      </motion.div>
      <motion.div className="reviews-hero-photo" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, ease }}><img src={customerPhotos[1].src} alt={customerPhotos[1].alt} /><span>Verified buyer photo · Catlink EU</span></motion.div>
    </section>

    <section className="reviews-feature">
      <Reveal className="reviews-feature-photo"><img src={featurePhoto.src} alt={featurePhoto.alt} loading="lazy" /><span>Verified buyer photo · Catlink EU</span></Reveal>
      <Reveal className="reviews-feature-copy"><p className="kicker">Four cats · Two boxes</p><div className="review-stars" aria-label="Long-term customer review">★★★★★</div><blockquote>“Four cats in the house—and no more daily scooping.”</blockquote><p>We introduced two Catlink boxes gradually over two months. Our cats needed patience, but consistently clean litter, low odour and the optional stairs helped every cat adjust.</p><p className="reviews-balance">Our honest caveats: the app takes time to learn, the stair should feel standard, and the system is a meaningful investment.</p><a href="https://www.petmomma.co/2022/12/29/worth-the-wait-catlink-litter-box-review/" target="_blank" rel="noreferrer">Read the independent review <ChevronRight /></a></Reveal>
    </section>

    <section className="reviews-grid-section">
      <Reveal className="reviews-heading"><p className="kicker">In their words</p><h2>The everyday<br />difference.</h2><p>Feedback is lightly edited into first person for clarity and length. Ratings and names reflect the public source.</p></Reveal>
      <div className="reviews-grid">{customerReviews.map((review, i) => <Reveal className="review-card" key={review.name} delay={(i % 3) * .05}>
        <div className="review-card-top"><div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</div><span>{review.source}</span></div>
        <p>{review.text}</p>
        <div className="review-person"><b>{review.name}</b><small>{review.model}</small></div>
      </Reveal>)}</div>
    </section>

    <section className="reviews-gallery">
      <Reveal className="reviews-gallery-heading"><p className="kicker">Seen at home</p><h2>Not a showroom.<br />Their actual rooms.</h2><p>Verified-buyer photographs submitted through Catlink EU’s product reviews.</p></Reveal>
      <div className="reviews-mosaic">{customerPhotos.slice(1).map((photo, i) => <Reveal className={`reviews-photo photo-${i + 1}`} key={photo.src} delay={i * .05}><img src={photo.src} alt={photo.alt} loading="lazy" /><span>{photo.label}</span></Reveal>)}</div>
    </section>

    <section className="reviews-takeaways"><Reveal><p className="kicker">The pattern</p><h2>What owners<br />mention most.</h2></Reveal><div><Reveal><span>01</span><h3>Less daily scooping</h3><p>The clearest benefit is time: many owners move from multiple scoops a day to one quick drawer change each week.</p></Reveal><Reveal><span>02</span><h3>Give cats time</h3><p>Curious cats may use it immediately. Cautious cats often do better with manual mode and their old box nearby during the transition.</p></Reveal><Reveal><span>03</span><h3>Useful, imperfect app</h3><p>Owners value weight and visit history, while some describe setup or the interface as the least polished part of the experience.</p></Reveal></div><a className="button" href={pageHref("/how-to-choose")}>Find your model</a></section>
  </main>;
}

const notices = [
  { icon: Weight, title: "Milo’s weight changed", copy: "Up 4% this week · Review trend" },
  { icon: Bell, title: "Luna visited Pro-X", copy: "18 minutes ago · 47 seconds" },
  { icon: Droplets, title: "Water level is low", copy: "Around one day remaining" },
];

function AppSection() {
  return <section id="app" className="app-section">
    <div className="app-glow" />
    <Reveal className="app-copy"><p className="kicker">Catlink app</p><h2>Their routine.<br /><span>Right in your hand.</span></h2><p>One clear timeline for meals, water, weight and litter-box habits. No spreadsheets. No second-guessing.</p><div className="app-points"><span><ShieldCheck /> One connected dashboard</span><span><Sparkles /> Insights that stay useful</span></div><a className="button app-learn" href={pageHref("/app")}>Explore the Catlink app</a></Reveal>
    <Reveal className="phone"><div className="phone-screen"><div className="phone-top"><span>9:41</span><i /></div><p>Good morning</p><h3>Your cats are doing well.</h3><div className="score"><b>94</b><span>Health score<br /><em>Stable this week</em></span></div><small>Today</small>{notices.map(({ icon: Icon, title, copy }) => <div className="notice" key={title}><i><Icon /></i><span><b>{title}</b><small>{copy}</small></span></div>)}</div></Reveal>
  </section>;
}

function AppPage() {
  const [flippedFeature, setFlippedFeature] = useState(null);
  const appScreens = [
    { src: "https://play-lh.googleusercontent.com/P4-tWArMDaIQHfHNV9xSLTW3-P8getBUd3bjLizKReOVB0OSd-WZJ3qMYRwyGT9wPJZmFeNUL_QGgw34qja_=w832-h468", alt: "Catlink app home screen showing connected litter boxes, feeders and fountains", label: "Connected home" },
    { src: "https://play-lh.googleusercontent.com/EUZJVKua1j00ClxrbZjmuUiYAxAL3HKCxiWaFLrlnXa8QG0dVg9fRjRZIC4TnvKR9lsk4qNZdff6tsI_BTJg=w832-h468", alt: "Catlink app device settings for a connected litter box", label: "Device controls" },
    { src: "https://play-lh.googleusercontent.com/vx_M8g3jnFIpsS5TLIlk6tprXJXjAiQm8E5aZlC2en7TrvTpII7mty8NqHc2oHx3QGg8cwnhRHjjx_Jcb7VvQQ=w832-h468", alt: "Catlink app device dashboard with cleaning controls", label: "Cleaning status" },
    { src: "https://play-lh.googleusercontent.com/50aW_J8weLQUn6c_OhMMfUlePqGWnNQyhLdPb-nwBgSwT3R1eOnbAR_afid2wCp_tMCG9QUzIOY4XythQom31Ig=w832-h468", alt: "Catlink app cat profile with weight, toileting and feeding data", label: "Cat profiles" },
    { src: "https://play-lh.googleusercontent.com/3sO7TnjbK2upFPW4FpgygaQfDN95uTBTAPe3xuG5UvSDBvLkGl4m-b0bVRC9nnE0okShQgaMKBpjkQVBFli-=w832-h468", alt: "Catlink app health report with weight trend chart", label: "Health reports" },
    { src: "https://play-lh.googleusercontent.com/nw6AN62aNE6AFWbOKdZxgbTQrZGTOmRMDqZb-qku0D8he8dXTbB560m0gytqyZke8L3FTDPrsUkrGMzW4avdHA=w832-h468", alt: "Catlink app graphs showing toileting and feeding trends", label: "Daily trends" },
  ];
  const appFeatures = [
    { icon: Activity, title: "See daily patterns", text: "Review litter-box visits, meals, water intake and weight changes in one chronological view.", details: ["Compare daily and weekly activity", "Notice changes in weight and routine", "Review connected-device history"] },
    { icon: Bell, title: "Get useful alerts", text: "Receive maintenance reminders and notifications when a connected device or routine needs attention.", details: ["Know when supplies need attention", "See device and cleaning reminders", "Keep routine changes visible"] },
    { icon: ScanFace, title: "Follow each cat", text: "Compatible devices separate activity into individual profiles for clearer multi-cat monitoring.", details: ["Create a profile for each cat", "Keep individual weight records apart", "See which cat used a compatible device"] },
    { icon: Radar, title: "Control devices remotely", text: "Check device status, adjust supported schedules and manage everyday settings away from home.", details: ["Review current device status", "Adjust supported schedules", "Start available device actions remotely"] },
  ];
  return <main id="main-content" className="app-page">
    <section className="app-page-hero">
      <motion.div className="app-page-copy" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .1 } } }}>
        <motion.p className="kicker" variants={fade}>The Catlink app</motion.p>
        <motion.h1 variants={fade}>Every routine.<br /><span>One calm overview.</span></motion.h1>
        <motion.p variants={fade}>Connect compatible Catlink litter boxes, feeders and fountains to see daily activity, device status and care reminders from one place.</motion.p>
        <motion.div className="app-store-links" variants={fade}>
          <a href="https://apps.apple.com/fi/app/catlink/id1407845134" target="_blank" rel="noreferrer"><b>Download on the</b><strong>App Store</strong></a>
          <a href="https://play.google.com/store/apps/details?id=com.catlink.app" target="_blank" rel="noreferrer"><b>Get it on</b><strong>Google Play</strong></a>
        </motion.div>
      </motion.div>
      <motion.div className="app-screen-gallery" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease }}>{appScreens.map((screen, index) => <figure className={`app-screen screen-${index + 1}`} key={screen.src}><img src={screen.src} alt={screen.alt} decoding="async" loading={index > 1 ? "lazy" : "eager"} /><figcaption>{screen.label}</figcaption></figure>)}</motion.div>
    </section>

    <section className="app-feature-section">
      <Reveal className="app-feature-heading"><p className="kicker">A clearer daily picture</p><h2>Useful information.<br /><span>Without the noise.</span></h2><p>The app turns activity from compatible Catlink devices into a simpler view of what happened, which cat was involved and what may need attention next.</p></Reveal>
      <div className="app-feature-grid">{appFeatures.map(({ icon: Icon, title, text, details }, index) => {
        const isFlipped = flippedFeature === index;
        return <Reveal className="app-feature-card-wrap" key={title} delay={index * .05}>
          <button className={`app-feature-card${isFlipped ? " is-flipped" : ""}`} type="button" aria-pressed={isFlipped} aria-label={`${isFlipped ? "Show summary for" : "Learn more about"} ${title}`} onClick={() => setFlippedFeature(isFlipped ? null : index)}>
            <span className="app-feature-card-inner">
              <span className="app-feature-card-face app-feature-card-front"><Icon /><span className="feature-number">0{index + 1}</span><span className="feature-copy"><strong>{title}</strong><span>{text}</span></span><span className="flip-prompt">Tap to learn more <ArrowRight /></span></span>
              <span className="app-feature-card-face app-feature-card-back"><span className="feature-number">0{index + 1}</span><strong>{title}</strong><ul>{details.map(detail => <li key={detail}>{detail}</li>)}</ul><span className="flip-prompt">Back to summary <ArrowRight /></span></span>
            </span>
          </button>
        </Reveal>;
      })}</div>
    </section>

    <section className="app-connected-section">
      <Reveal><p className="kicker">One connected home</p><h2>Cleaning, feeding<br /><span>and hydration.</span></h2><p>Bring supported devices together so everyday care is easier to review without moving between separate apps or disconnected histories.</p></Reveal>
      <div className="app-connected-list"><Reveal><Droplets /><b>Water</b><span>Hydration activity and refill reminders</span></Reveal><Reveal><Sparkles /><b>Cleaning</b><span>Visits, weight trends and waste-drawer status</span></Reveal><Reveal><Activity /><b>Meals</b><span>Schedules, portions and feeding records</span></Reveal></div>
    </section>

    <section className="app-page-cta"><Reveal><p className="kicker">Available for iPhone and Android</p><h2>Keep their routine<br />close at hand.</h2><div className="app-store-links"><a href="https://apps.apple.com/fi/app/catlink/id1407845134" target="_blank" rel="noreferrer"><b>Download on the</b><strong>App Store</strong></a><a href="https://play.google.com/store/apps/details?id=com.catlink.app" target="_blank" rel="noreferrer"><b>Get it on</b><strong>Google Play</strong></a></div></Reveal></section>
  </main>;
}

function Footer() {
  return <footer>
    <div className="footer-top"><div><Logo /><p>An independent portfolio concept exploring smarter care for cats.</p></div><a className="button" href={pageHref("/products")}>Explore the range</a></div>
    <div className="footer-links"><div><b>Products</b><a href={pageHref("/products#litter-boxes")}>Litter boxes</a><a href={pageHref("/products#feeders")}>Smart feeders</a><a href={pageHref("/products#water-fountains")}>Water fountains</a></div><div><b>Official support</b><a href="mailto:Support@catlinkeu.com">Contact Catlink EU</a><a href="https://catlinkeu.com" target="_blank" rel="noreferrer">Visit the official store</a></div><div><b>Concept pages</b><a href={pageHref("/")}>Home</a><a href={pageHref("/how-to-choose")}>How to choose</a><a href={pageHref("/reviews")}>Reviews</a><a href={pageHref("/app")}>Catlink app</a></div></div>
    <p className="concept-disclaimer">Independent, non-commercial portfolio concept. Not affiliated with, endorsed by or owned by Catlink or Catlink EU. Product names, trademarks and official imagery belong to their respective owners.</p>
    <div className="copyright"><span>© {new Date().getFullYear()} Portfolio concept</span><span>Created for design and development demonstration.</span></div>
  </footer>;
}

function NotFoundPage() {
  return <main id="main-content" className="not-found">
    <p className="kicker">404 · Page not found</p>
    <h1>This page wandered off.</h1>
    <p>The link may be outdated, or the page may not be part of this portfolio concept.</p>
    <div><a className="button" href={pageHref("/")}>Return home</a><a href={pageHref("/products")}>Browse products <ChevronRight /></a></div>
  </main>;
}

export default function App() {
  const baseName = basePath.replace(/\/$/, "");
  const pathname = baseName && window.location.pathname.startsWith(baseName)
    ? window.location.pathname.slice(baseName.length) || "/"
    : window.location.pathname;
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  useEffect(() => {
    setPageMetadata(path);
  }, [path]);
  const productSlug = path.startsWith("/products/") ? path.split("/")[2] : null;
  const selectedProduct = catalog.find(item => path === `/products/${item.slug}` && item.slug === productSlug);
  const content = selectedProduct
    ? <ProductDetail product={selectedProduct} />
    : path === "/reviews"
      ? <ReviewsPage />
    : path === "/how-to-choose"
      ? <HowToChoose />
    : path === "/app"
      ? <AppPage />
    : path === "/products"
      ? <ProductCatalog />
    : path === "/"
      ? <main id="main-content"><Hero /><Intro /><AppSection /></main>
      : <NotFoundPage />;
  return <MotionConfig reducedMotion="user"><a className="skip-link" href="#main-content">Skip to main content</a><Navbar />{content}<Footer /></MotionConfig>;
}

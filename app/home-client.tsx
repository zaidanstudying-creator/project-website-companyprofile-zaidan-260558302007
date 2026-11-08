"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowDownRight, ArrowRight, BadgeCheck, BriefcaseBusiness, Building2, ChevronDown, Fingerprint, GraduationCap, HeartPulse, Landmark, Menu, ShieldCheck, WalletCards, X, Globe2, Network, Award, Layers3, LockKeyhole, HandCoins } from "lucide-react";
import { copy, type Locale } from "@/lib/translations";
import type { SiteContent } from "@/lib/site-content";

const credentialIcons = [Fingerprint, GraduationCap, BriefcaseBusiness, Award, ShieldCheck];
const domainIcons = [GraduationCap, BriefcaseBusiness, Landmark, HandCoins, HeartPulse, Globe2, Award];
const techIcons = [BadgeCheck, Fingerprint, Layers3, Network, LockKeyhole, ShieldCheck];
const navIds = ["about", "vision", "ecosystem", "technology", "roadmap", "contact"];

type MapPoint = readonly [number, number];

function fillIsland(points: readonly MapPoint[], spacing = 5.4): MapPoint[] {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const inside = (x: number, y: number) => {
    let hit = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [xi, yi] = points[i], [xj, yj] = points[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
  };
  const dots: MapPoint[] = [];
  let row = 0;
  for (let y = minY + spacing / 2; y < maxY; y += spacing, row++) {
    const offset = row % 2 ? spacing / 2 : 0;
    for (let x = minX + spacing / 2 + offset; x < maxX; x += spacing) {
      if (inside(x, y)) dots.push([x, y]);
    }
  }
  return dots;
}

function Archipelago() {
  const islands = [
    // Coordinates trace the main island silhouettes, west to east.
    ["Aceh", 78, 118], ["Sumut", 103, 135], ["Sumbar", 112, 164], ["Riau", 137, 155], ["Jambi", 145, 188], ["Bengkulu", 137, 214], ["Sumsel", 163, 222], ["Lampung", 180, 248],
    ["Bangka", 184, 190], ["JavaWest", 196, 274], ["JavaCentral", 233, 281], ["JavaEast", 272, 286], ["Madura", 284, 276], ["Bali", 302, 292], ["Lombok", 319, 296], ["Sumbawa", 339, 301], ["Flores", 365, 307], ["Sumba", 359, 326], ["Timor", 404, 316],
    ["KalimantanNW", 211, 141], ["KalimantanN", 250, 132], ["KalimantanNE", 283, 153], ["KalimantanE", 291, 188], ["KalimantanSE", 272, 219], ["KalimantanS", 235, 227], ["KalimantanW", 205, 190],
    ["SulawesiN", 327, 139], ["SulawesiNE", 355, 157], ["SulawesiEast", 378, 187], ["SulawesiSE", 367, 214], ["SulawesiSouth", 340, 226], ["SulawesiWest", 323, 193],
    ["MalukuNorth", 414, 185], ["MalukuSouth", 433, 227], ["Halmahera", 442, 169], ["Seram", 463, 221], ["PapuaWest", 500, 178], ["PapuaNorth", 540, 159], ["PapuaEast", 584, 164], ["PapuaFarEast", 618, 187], ["PapuaSouthEast", 599, 220], ["PapuaSouth", 555, 230], ["PapuaSouthWest", 516, 218],
    ["KepRiau", 159, 151], ["Sangihe", 383, 137],
  ] as const;
  const lines = [
    [0,1],[1,2],[2,3],[2,4],[4,5],[4,6],[6,7],[3,8],[7,9],
    [9,10],[10,11],[11,12],[11,13],[13,14],[14,15],[15,16],[16,17],[16,18],
    [19,20],[20,21],[21,22],[22,23],[23,24],[24,25],[25,19],[3,19],[6,25],
    [26,27],[27,28],[28,29],[29,30],[30,31],[31,26],[21,26],
    [32,33],[33,34],[34,35],[35,36],[36,37],[37,32],[28,32],[34,39],
    [32,34],[34,33],[33,35],[36,37],[37,38],[38,39],[39,40],[40,41],[41,42],[42,36],
    [7,24],[11,30],[18,41],[31,32],[34,36],[35,41],[43,19],[44,26],
  ];
  const hubs = new Set([0, 11, 22, 28, 41]);
  const islandOutlines: MapPoint[][] = [
    [[70,111],[85,110],[101,120],[115,134],[128,145],[137,163],[151,177],[158,194],[168,211],[181,229],[188,241],[181,251],[169,246],[158,231],[147,220],[137,205],[126,192],[116,177],[109,162],[98,151],[87,143],[77,132]],
    [[190,270],[204,267],[220,269],[237,268],[254,270],[271,273],[285,278],[288,283],[276,288],[260,290],[242,288],[225,286],[208,285],[195,281],[188,276]],
    [[198,151],[209,138],[225,129],[239,122],[253,123],[267,130],[279,140],[291,148],[299,160],[298,174],[291,186],[286,198],[278,210],[271,222],[258,231],[245,230],[233,224],[220,218],[209,207],[201,194],[196,180],[195,165]],
    [[333,183],[334,169],[341,150],[348,137],[354,140],[357,155],[356,174],[370,174],[383,181],[381,188],[366,192],[358,190],[359,204],[370,217],[374,226],[369,230],[358,221],[348,210],[344,201],[342,219],[338,232],[331,232],[328,218],[331,203],[327,196],[311,190],[305,184],[308,178],[322,182]],
    [[490,186],[500,178],[512,174],[520,166],[530,161],[541,160],[554,164],[568,165],[586,170],[604,176],[620,183],[628,190],[624,197],[612,198],[604,204],[598,215],[588,223],[576,230],[564,238],[552,239],[542,233],[532,226],[518,223],[505,218],[497,209],[490,201]],
    [[294,290],[301,287],[308,290],[311,296],[306,301],[299,299]],
    [[314,294],[322,291],[329,295],[330,301],[324,305],[317,301]],
    [[334,297],[344,295],[352,300],[356,305],[349,309],[340,306]],
    [[359,302],[369,300],[379,304],[385,310],[380,314],[369,312]],
    [[350,321],[360,319],[370,322],[375,327],[368,331],[357,329]],
    [[393,309],[405,307],[414,312],[416,318],[408,322],[398,319]],
    [[177,190],[180,196],[183,202],[189,205],[194,207],[199,211]],
    [[152,145],[157,142],[163,145],[165,151],[160,155],[154,152]],
    [[395,199],[399,196],[403,200],[402,205],[398,206]],
    [[420,207],[425,204],[430,208],[429,213],[424,214]],
    [[435,153],[440,149],[444,155],[447,163],[446,172],[442,179],[438,174],[437,165]],
    [[448,211],[455,208],[463,210],[469,216],[466,222],[459,224],[452,220]],
    [[481,194],[485,191],[489,195],[488,201],[483,202]],
    [[486,171],[490,168],[495,171],[494,176],[489,177]],
    [[476,235],[480,232],[484,236],[483,241],[478,242]],
  ];
  const detailDots = islandOutlines.flatMap((outline) => fillIsland(outline)).filter(([x,y]) => islands.every((island) => Math.hypot(island[1] - x, island[2] - y) >= 4.8));
  return <svg className="archipelago" viewBox="0 0 700 430" role="img" aria-label="Ilustrasi jaringan digital yang menghubungkan kepulauan Indonesia">
    {lines.map(([a,b],i)=><line key={i} x1={islands[a][1]} y1={islands[a][2]} x2={islands[b][1]} y2={islands[b][2]} className="map-link" />)}
    {detailDots.map(([x,y],i)=><circle key={`coast-${i}`} cx={x} cy={y} r="1.25" className="map-coast-dot"/>)}
    {islands.map((island,i)=><circle key={island[0]} cx={island[1]} cy={island[2]} r={hubs.has(i)?3:2.1} className={hubs.has(i)?"map-node map-node-red":"map-node"}/>)}
  </svg>;
}

export default function Home({ initialContent }: { initialContent: SiteContent }) {
  const [locale, setLocale] = useState<Locale>("id");
  const [selected, setSelected] = useState(0);
  const [stage, setStage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [siteContent, setSiteContent] = useState<SiteContent>(() => structuredClone(initialContent));
  const reduceMotion = useReducedMotion();
  const t = siteContent.translations[locale] ?? copy[locale];
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.45, ease: "easeOut" as const };
  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("preview") === "draft";
    if (!preview) return;
    fetch("/api/cms/content?draft=1", { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<SiteContent> : null)
      .then((content) => { if (content) setSiteContent(content); })
      .catch(() => undefined);
  }, []);
  useEffect(() => {
    const sections = navIds.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: "-14% 0px -72% 0px", threshold: [0, 0.15, 0.4] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = siteContent.seo[locale].title;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", siteContent.seo[locale].description);
  }, [locale, siteContent.seo]);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="#home" aria-label="OneID Indonesia home"><span className="brand-symbol"><span/><span/><span/><span/></span><span>oneid<span className="brand-country"> indonesia</span></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{t.nav.map((item,i)=><a href={`#${navIds[i]}`} key={navIds[i]} aria-current={activeSection===navIds[i]?"location":undefined}>{item}</a>)}</nav>
      <div className="header-actions"><div className="language-switch" aria-label="Language"><button aria-pressed={locale==="id"} onClick={()=>setLocale("id")}>ID</button><span>/</span><button aria-pressed={locale==="en"} onClick={()=>setLocale("en")}>EN</button></div><a className="header-cta" href={siteContent.links.headerExplore}>{t.explore}<ArrowRight size={15}/></a><button className="menu-toggle" aria-label={menuOpen?t.close:t.menu} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button></div>
    </header>
    <AnimatePresence>{menuOpen&&<motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={transition}>{t.nav.map((item,i)=><a href={`#${navIds[i]}`} key={navIds[i]} aria-current={activeSection===navIds[i]?"location":undefined} onClick={()=>setMenuOpen(false)}>{item}<ArrowRight size={17}/></a>)}</motion.nav>}</AnimatePresence>

    <main id="main">
      <section className="hero section-dark" id="home">
        <div className="hero-grid-mark" aria-hidden="true"/>
        <div className="hero-copy">
          <motion.h1 initial={false}><span>{t.heroLines[0]}</span><span>{t.heroLines[1]}</span></motion.h1>
          <p className="hero-sub">{t.heroSub}</p><p className="hero-body">{t.heroBody}</p>
          <div className="hero-actions"><a className="button-primary" href={siteContent.links.heroExplore}>{t.explore}<ArrowRight size={17}/></a><a className="text-link light-link" href={siteContent.links.heroLearn}>{t.learn}<ArrowDownRight size={17}/></a></div>
        </div>
        <div className="hero-visual"><Archipelago/><div className="visual-note"><span className="live-dot"/>{locale==="id"?"Satu identitas, banyak kemungkinan":"One identity, many possibilities"}</div></div>
        <div className="hero-bottom"><span>OneID Indonesia</span><a href="#problem">{locale==="id"?"Gulir untuk menjelajah":"Scroll to explore"}<ChevronDown size={15}/></a></div>
      </section>

      <section className="problem section-light" id="problem"><div className="section-wrap"><div className="section-heading split-heading"><div><h2>{t.problemTitle}</h2></div><p className="section-lead">{t.problemIntro}</p></div><div className="problem-list">{t.problems.map(([title,desc],i)=><motion.article className="problem-row" key={title} initial={reduceMotion?false:{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.35}} transition={{...transition,delay:i*.05}}><h3>{title}</h3><p>{desc}</p><span className="row-arrow"><ArrowDownRight size={20}/></span></motion.article>)}</div></div></section>

      <section className="vision section-blue" id="vision"><div className="section-wrap vision-layout"><div className="vision-copy"><h2>{t.visionTitle}</h2><p className="vision-lead">{t.visionBody}</p><ul className="vision-points">{t.visionPoints.map((x)=><li key={x}><span><ArrowRight size={15}/></span>{x}</li>)}</ul><a className="text-link" href="#wallet">{locale==="id"?"Lihat konsep wallet":"See the wallet concept"}<ArrowDownRight size={17}/></a></div><div className="vision-flow" aria-label="Identity and credential interoperability concept"><div className="flow-core"><div className="flow-mark"><Fingerprint size={31}/></div><strong>{locale==="id"?"Pemilik identitas":"Identity holder"}</strong><span>{locale==="id"?"tetap memegang kendali":"stays in control"}</span></div>{(locale==="id"?["Pendidikan","Pekerjaan","Sertifikasi","Layanan"]:["Education","Work","Certification","Services"]).map((x,i)=><div className={`flow-node flow-node-${i+1}`} key={x}>{x}</div>)}<svg viewBox="0 0 500 500" aria-hidden="true"><circle cx="250" cy="250" r="170"/><circle cx="250" cy="250" r="115"/><path d="M250 80V420M80 250H420M130 130l240 240M370 130 130 370"/></svg></div></div></section>

      <section className="wallet-section section-paper" id="wallet"><div className="section-wrap wallet-layout"><div className="wallet-copy"><h2>{t.walletTitle}</h2><p className="section-lead">{t.walletBody}</p><div className="wallet-tablist" role="tablist" aria-label={locale==="id"?"Pilih kredensial":"Choose a credential"}>{t.credentials.map((item,i)=><button key={item} role="tab" aria-selected={selected===i} aria-controls="credential-panel" id={`credential-tab-${i}`} onClick={()=>setSelected(i)}>{item}<ArrowRight size={15}/></button>)}</div><p className="wallet-disclaimer"><ShieldCheck size={16}/>{locale==="id"?"Contoh konseptual. Bukan identitas atau kredensial resmi.":"Concept example. Not an official identity or credential."}</p></div><div className="wallet-stage"><div className="wallet-stage-top"><span>OneID wallet</span><span><span className="red-dot"/> {locale==="id"?"Tampilan konsep":"Concept view"}</span></div><div className="credential-card" data-ui="credential-fragment" role="tabpanel" id="credential-panel" aria-labelledby={`credential-tab-${selected}`} key={selected}><div className="credential-card-head"><span className="credential-icon">{(()=>{const Icon=credentialIcons[selected];return <Icon size={22}/>})()}</span><span className="credential-status"><BadgeCheck size={15}/>{t.verified}</span></div><div className="credential-card-title"><span>{t.credentials[selected]}</span><strong>{[locale==="id"?"Nama pemegang · contoh":"Holder name · sample",locale==="id"?"Pendidikan · contoh":"Education · sample",locale==="id"?"Pekerjaan · contoh":"Employment · sample",locale==="id"?"Sertifikasi · contoh":"Certification · sample",locale==="id"?"Verifikasi · contoh":"Verification · sample"][selected]}</strong></div><div className="credential-seal"><div className="seal-lines"/><Fingerprint size={40}/></div><div className="credential-card-meta"><div><span>{t.issuer}</span><strong>{[t.sampleIssuer,t.sampleIssuer,t.sampleIssuer,t.sampleIssuer,t.sampleIssuer][selected]}</strong></div><div><span>{t.issued}</span><strong>{t.sampleDate}</strong></div></div></div><div className="wallet-card-foot"><span><LockKeyhole size={14}/>{locale==="id"?"Dibagikan atas persetujuan":"Shared with consent"}</span><span>1 / 5</span></div></div></div></section>

      <section className="how section-light" id="how"><div className="section-wrap"><div className="section-heading split-heading"><div><h2>{t.howTitle}</h2></div><p className="section-lead">{t.howIntro}</p></div><div className="role-flow">{t.roles.map(([title,desc],i)=>{const Icon=[Building2,WalletCards,ShieldCheck][i];return <article className="role" key={title}><div className="role-top"><span className="role-symbol"><Icon size={23}/></span></div><h3>{title}</h3><p>{desc}</p>{i<2&&<ArrowRight className="role-arrow" size={22}/>}</article>})}</div><div className="stage-control"><label htmlFor="stage-range">{locale==="id"?"Jelajahi alur":"Explore the flow"}</label><input id="stage-range" type="range" min="0" max="3" step="1" value={stage} onChange={(e)=>setStage(Number(e.target.value))} aria-valuetext={t.steps[stage]}/><div className="stage-labels">{t.steps.map((s,i)=><button key={s} className={stage===i?"active":""} onClick={()=>setStage(i)}>{s}</button>)}</div><p className="stage-explain">{[locale==="id"?"Penerbit membuat kredensial yang dapat diverifikasi.":"An issuer creates a credential that can be verified.",locale==="id"?"Pemilik menyimpan kredensial dalam wallet konsep.":"The holder keeps the credential in a wallet concept.",locale==="id"?"Pemilik menyetujui permintaan untuk membagikan kredensial.":"The holder consents to a request to share a credential.",locale==="id"?"Pemverifikasi memeriksa keaslian informasi yang dibagikan.":"A verifier checks the authenticity of shared information."][stage]}</p></div></div></section>

      <section className="ecosystem section-dark" id="ecosystem"><div className="section-wrap ecosystem-wrap"><div className="ecosystem-intro"><h2>{t.ecosystemTitle}</h2><p>{t.ecosystemBody}</p></div><div className="ecosystem-art"><Archipelago/><div className="sector-list">{t.domains.map((d,i)=>{const Icon=domainIcons[i];return <div className={`sector sector-${i}`} key={d}><span><Icon size={16}/></span>{d}</div>})}</div><div className="eco-center"><Fingerprint size={27}/><span>OneID</span></div></div><p className="ecosystem-note"><span className="red-dot"/>{locale==="id"?"Visualisasi visi – bukan peta integrasi aktual":"Vision visualization – not a map of current integrations"}</p></div></section>

      <section className="story-section section-paper" aria-labelledby="story-title"><div className="section-wrap"><div className="story-heading"><h2 id="story-title">{t.storyTitle}</h2><p>{t.storyBody}</p></div><div className="story-gallery">
        {siteContent.media.map((media, index) => <figure className={`story-image ${["story-islands", "story-city", "story-craft", "story-textile"][index]}`} key={media.src}><Image src={media.src} alt={media.alt[locale]} width={1920} height={index === 0 ? 1440 : index === 1 ? 939 : 1280} sizes={index === 0 ? "(max-width: 760px) 100vw, 58vw" : index === 1 ? "(max-width: 760px) 100vw, 40vw" : "(max-width: 760px) 50vw, 20vw"} loading="lazy"/><figcaption>{t.photoCaptions[index]}</figcaption></figure>)}
      </div></div></section>

      <section className="privacy section-red" id="privacy"><div className="section-wrap privacy-layout"><div className="privacy-main"><h2>{t.privacyTitle}</h2><p>{t.privacyBody}</p></div><div className="principle-list">{t.principles.map(([title,desc])=><article key={title}><div><h3>{title}</h3><p>{desc}</p></div></article>)}</div></div></section>

      <section className="technology section-paper" id="technology"><div className="section-wrap"><div className="tech-heading"><div><h2>{t.techTitle}</h2></div><p>{t.techIntro}</p></div><div className="tech-list">{t.technologies.map(([title,desc],i)=>{const Icon=techIcons[i];return <article key={title}><span className="tech-icon"><Icon size={20}/></span><div><h3>{title}</h3><p>{desc}</p></div><span className="tech-arrow"><ArrowDownRight size={18}/></span></article>})}</div></div></section>

      <section className="roadmap section-light" id="roadmap"><div className="section-wrap"><div className="roadmap-heading"><div><h2>{t.roadmapTitle}</h2></div><p>{t.roadmapIntro}</p></div><div className="roadmap-track">{t.roadmap.map(([year,title,desc],i)=><article className={`roadmap-item ${i===0?"current":i===4?"long-view":""}`} key={year}><span className="roadmap-dot"/><span className="roadmap-year">{year}</span><h3>{title}</h3><p>{desc}</p></article>)}</div><div className="roadmap-foot"><span>{locale==="id"?"Target pengembangan":"Development target"}</span><span>{locale==="id"?"Rencana dapat berkembang mengikuti hasil riset dan kolaborasi.":"Plans may evolve with research and collaboration."}</span></div></div></section>

      <section className="about section-blue" id="about"><div className="section-wrap about-layout"><div><h2>{t.aboutTitle}</h2></div><div className="about-body"><p>{t.aboutBody}</p><div className="about-signoff"><span>OneID Indonesia<small>{locale==="id"?"Proyek visi teknologi":"Technology vision project"}</small></span></div></div></div></section>

      <section className="contact section-dark" id="contact"><div className="section-wrap contact-layout"><div><h2>{t.contactTitle}</h2></div><div className="contact-side"><p>{t.contactBody}</p><div className="contact-note"><span className="contact-symbol"><ArrowRight size={22}/></span><span>{t.contactNote}</span></div></div><div className="contact-bottom"><a href="#home" className="text-link light-link">{locale==="id"?"Kembali ke atas":"Back to top"}<ArrowDownRight size={17}/></a><span>JAKARTA · INDONESIA</span></div></div></section>
    </main>
    <footer className="site-footer"><div className="footer-top"><a className="brand footer-brand" href="#home"><span className="brand-symbol"><span/><span/><span/><span/></span><span>oneid<span className="brand-country"> indonesia</span></span></a><p>{locale==="id"?"Berakar di Indonesia. Terhubung ke Dunia.":"Rooted in Indonesia. Connected to the world."}</p><nav aria-label="Footer navigation">{t.nav.map((item,i)=><a href={`#${navIds[i]}`} key={navIds[i]}>{item}</a>)}</nav></div><div className="footer-main"><div className="footer-word">oneid<span> indonesia</span></div><a className="footer-action" href="#vision">{t.footerExplore}<ArrowRight size={22}/></a></div><div className="footer-bottom"><p>{t.taglineAlt}</p><p>© 2026 ONEID INDONESIA · {t.copyright}</p><p>{t.footerNote}</p></div><p className="photo-credits">{locale==="id"?"Kredit foto: ":"Photo credits: "}<a href="https://commons.wikimedia.org/wiki/File:Puncak_Painemu.jpg" target="_blank" rel="noreferrer">“Puncak Painemu” · Lebrenta Fitriani Siringoringo · CC BY-SA 4.0</a> · <a href="https://commons.wikimedia.org/wiki/File:Jakarta_Panorama.jpg" target="_blank" rel="noreferrer">“Jakarta Panorama” · Gunawan Kartapranata · CC BY-SA 3.0</a> · <a href="https://commons.wikimedia.org/wiki/File:Batik_Trusmi_Cirebon_(31).jpg" target="_blank" rel="noreferrer">“Batik Trusmi Cirebon (31)” · Fpangestuphotographer · CC BY-SA 4.0</a> · <a href="https://commons.wikimedia.org/wiki/File:Batik_Trusmi_Cirebon_(18).jpg" target="_blank" rel="noreferrer">“Batik Trusmi Cirebon (18)” · Fpangestuphotographer · CC BY-SA 4.0</a></p></footer>
  </>;
}

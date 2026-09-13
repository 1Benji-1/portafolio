import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase";
import CardProject from "../components/CardProject";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Monitor,
  Globe,
  Zap,
  Smartphone,
  ArrowRight,
  Check,
  Store,
  Star,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { useTranslation } from "react-i18next";




/* ------------------------------------------------------------------ */
/*  Lumen POS - Planes de Servicio                                    */
/* ------------------------------------------------------------------ */
const POS_BILLING_PERIODS = [
  { key: "monthly", labelKey: "website.pos.billing.monthly", discountKey: null },
{ key: "quarterly", labelKey: "website.pos.billing.quarterly", discountKey: "website.pos.billing.save15" },
{ key: "annual", labelKey: "website.pos.billing.annual", discountKey: "website.pos.billing.save25" },
];

const LUMEN_POS_PLANS = [
  {
    id: "standard",
    name: "Standard",
    descKey: "website.pos.plans.standard.desc",
    icon: Store,
    featureKeys: [
      "website.pos.plans.standard.f1",
      "website.pos.plans.standard.f2",
      "website.pos.plans.standard.f3",
      "website.pos.plans.standard.f4",
    ],
    pricing: { monthly: 99, quarterly: 250, annual: 900 },
    color: "slate",
  },
{
  id: "pro",
  name: "Pro",
  descKey: "website.pos.plans.pro.desc",
  icon: TrendingUp,
  featureKeys: [
    "website.pos.plans.pro.f1",
    "website.pos.plans.pro.f2",
    "website.pos.plans.pro.f3",
    "website.pos.plans.pro.f4",
  ],
  pricing: { monthly: 199, quarterly: 500, annual: 1800 },
  highlighted: true,
  color: "slate",
},
{
  id: "enterprise",
  name: "Enterprise",
  descKey: "website.pos.plans.enterprise.desc",
  icon: ShieldCheck,
  featureKeys: [
    "website.pos.plans.enterprise.f1",
    "website.pos.plans.enterprise.f2",
    "website.pos.plans.enterprise.f3",
    "website.pos.plans.enterprise.f4",
  ],
  pricing: { monthly: 399, quarterly: 1000, annual: 3600 },
  color: "indigo",
},
];

/* ------------------------------------------------------------------ */
/*  Tipos de Desarrollo a la Medida                                    */
/* ------------------------------------------------------------------ */
const CUSTOM_SERVICES = [
  {
    icon: Monitor,
    badgeKey: "website.custom.services.webSystems.badge",
    titleKey: "website.custom.services.webSystems.title",
    descKey: "website.custom.services.webSystems.desc",
    highlightKeys: [
      "website.custom.services.webSystems.h1",
      "website.custom.services.webSystems.h2",
      "website.custom.services.webSystems.h3",
    ],
  },
{
  icon: Smartphone,
  badgeKey: "website.custom.services.mobile.badge",
  titleKey: "website.custom.services.mobile.title",
  descKey: "website.custom.services.mobile.desc",
  highlightKeys: [
    "website.custom.services.mobile.h1",
    "website.custom.services.mobile.h2",
    "website.custom.services.mobile.h3",
  ],
},
{
  icon: Globe,
  badgeKey: "website.custom.services.platforms.badge",
  titleKey: "website.custom.services.platforms.title",
  descKey: "website.custom.services.platforms.desc",
  highlightKeys: [
    "website.custom.services.platforms.h1",
    "website.custom.services.platforms.h2",
    "website.custom.services.platforms.h3",
  ],
},
{
  icon: Zap,
  badgeKey: "website.custom.services.integrations.badge",
  titleKey: "website.custom.services.integrations.title",
  descKey: "website.custom.services.integrations.desc",
  highlightKeys: [
    "website.custom.services.integrations.h1",
    "website.custom.services.integrations.h2",
    "website.custom.services.integrations.h3",
  ],
},
];

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [posBilling, setPosBilling] = useState("monthly");
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const projectsResponse = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });

      if (projectsResponse.error) throw projectsResponse.error;

      const projectData = (projectsResponse.data || []).map((p) => ({
        id: p.id,
        Title: p.title,
        Description: p.description,
        Img: p.img,
        Link: p.link,
        Github: p.github,
        TechStack: p.tech_stack || [],
        Features: p.features || [],
      }));

      setProjects(projectData);
      localStorage.setItem("projects", JSON.stringify(projectData));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
  }, []);

  useEffect(() => {
    const cachedProjects = localStorage.getItem("projects");
    if (cachedProjects) {
      try {
        const raw = JSON.parse(cachedProjects);
        if (Array.isArray(raw)) {
          const normalized = raw.map((p) => ({
            id: p.id,
            Title: p.Title || p.title || "",
            Description: p.Description || p.description || "",
            Img: p.Img || p.img || "",
            Link: p.Link || p.link || "",
            Github: p.Github || p.github || "",
            TechStack: p.TechStack || p.tech_stack || [],
            Features: p.Features || p.features || [],
          }));
          setProjects(normalized);
        }
      } catch (e) {
        console.error("Error reading cached projects:", e);
      }
    }
    fetchData();
  }, [fetchData]);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, 4);

  const handleGoToContact = (msg) => {
    // 1. Dispatch custom event so Contact.jsx pre-fills immediately
    window.dispatchEvent(
      new CustomEvent("prefill-contact", { detail: { message: msg } })
    );

    // 2. Smoothly scroll to the Contact form
    const contactEl = document.getElementById("Contact");
    if (contactEl) {
      const top = contactEl.offsetTop - 80;
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    }

    // 3. Focus the name field so the user can immediately type their details
    setTimeout(() => {
      const nameInput = document.querySelector("input[name='name']");
      if (nameInput) {
        nameInput.focus({ preventScroll: true });
      }
    }, 500);
  };

  return (
    <div className="md:px-[10%] px-[5%] w-full pt-4 sm:pt-8 pb-16 bg-white overflow-hidden" id="Projects">

    {/* ============================================================ */}
    {/* ENCABEZADO DE LA SECCIÓN                                     */}
    {/* ============================================================ */}
    <div className="text-center pb-10 sm:pb-12" data-aos="fade-up">
    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
    {t("website.title")}
    </h2>
    <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg mt-3">
    {t("website.subtitle")}
    </p>
    </div>



    {/* ============================================================ */}
    {/* NUEVO BLOQUE: LUMEN POS                                      */}
    {/* ============================================================ */}
    <div className="mb-24">
    <div className="text-center mb-10" data-aos="fade-up">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-4">
    <span className="flex h-2 w-2 rounded-full bg-slate-900 animate-pulse"></span>
    <span className="text-xs font-bold uppercase tracking-widest text-slate-900">
    {t("website.pos.badge")}
    </span>
    </div>
    <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
    {t("website.pos.title")}
    </h3>
    <p className="text-slate-500 text-base max-w-2xl mx-auto mt-4 leading-relaxed">
    {t("website.pos.subtitle")}
    </p>

    {/* Toggle de Periodo de Pago POS — centrado */}
    <div className="flex justify-center mt-6">
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-md">
    {POS_BILLING_PERIODS.map((p) => (
      <button
      key={p.key}
      onClick={() => setPosBilling(p.key)}
      className={`relative px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
        posBilling === p.key
        ? "bg-slate-900 text-white shadow-lg"
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
      }`}
      >
      {t(p.labelKey)}
      {p.discountKey && posBilling !== p.key && (
        <span className="absolute -top-3 -right-2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
        {t(p.discountKey)}
        </span>
      )}
      </button>
    ))}
    </div>
    </div>
    </div>

    {/* Tarjetas de Precios (Lumen POS) */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
    {LUMEN_POS_PLANS.map((plan) => {
      const price = plan.pricing[posBilling];
      const PlanIcon = plan.icon;

      return (
        <div
        key={plan.id}
        data-aos="fade-up"
        className={`group relative rounded-3xl p-8 flex flex-col h-full transition-all duration-500 hover:-translate-y-2 ${
          plan.highlighted
          ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/30 ring-1 ring-slate-700"
          : "bg-white text-slate-900 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 hover:shadow-2xl hover:ring-slate-300"
        }`}
        >
        {/* Ribbon para plan destacado */}
        {plan.highlighted && (
          <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-1 bg-white text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
          <Star className="w-3.5 h-3.5 fill-current" />
          {t("website.pos.popular")}
          </div>
          </div>
        )}

        {/* Header de la Tarjeta */}
        <div className="flex items-center gap-4 mb-6 mt-2">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
          plan.highlighted
          ? "bg-white/10 text-white ring-1 ring-white/20"
          : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
        }`}>
        <PlanIcon className="h-6 w-6" />
        </div>
        <div>
        <h4 className="text-2xl font-bold">{plan.name}</h4>
        </div>
        </div>

        <p className={`text-sm leading-relaxed mb-8 ${plan.highlighted ? "text-slate-300" : "text-slate-500"}`}>
        {t(plan.descKey)}
        </p>

        {/* Precio */}
        <div className="mb-8">
        <div className="flex items-baseline gap-2">
        <span className="text-sm font-semibold text-slate-400">Bs</span>
        <span className={`text-5xl font-extrabold tracking-tight ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
        {price.toLocaleString()}
        </span>
        </div>
        <div className={`mt-2 text-sm font-medium ${plan.highlighted ? "text-slate-400" : "text-slate-500"}`}>
        {posBilling === "monthly"
          ? t("website.pos.billing.billedMonthly")
          : posBilling === "quarterly"
          ? t("website.pos.billing.billedQuarterly")
          : t("website.pos.billing.billedAnnually")}
          </div>
          </div>

          {/* Separador */}
          <div className={`h-px w-full mb-8 ${plan.highlighted ? "bg-slate-700" : "bg-slate-200"}`} />

          {/* Lista de Features */}
          <ul className="space-y-4 mb-10 flex-1">
          {plan.featureKeys.map((featureKey, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
              plan.highlighted ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900"
            }`}>
            <Check className="w-3.5 h-3.5" />
            </div>
            <span className={`font-medium ${plan.highlighted ? "text-slate-200" : "text-slate-700"}`}>
            {t(featureKey)}
            </span>
            </li>
          ))}
          </ul>

          {/* CTA — Reservar prueba gratuita */}
          <button
          type="button"
          onClick={() => handleGoToContact(t("website.pos.contactMsg"))}
          className={`mt-auto w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md cursor-pointer ${
            plan.highlighted
            ? "bg-white text-slate-900 hover:bg-slate-100 hover:shadow-lg"
            : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-900/25"
          }`}
          >
          {t("website.pos.cta")}
          </button>
          </div>
      );
    })}
    </div>
    </div>

    {/* ============================================================ */}
    {/* BLOQUE 2: DESARROLLO A LA MEDIDA                             */}
    {/* ============================================================ */}
    <div className="mb-24 rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12" data-aos="fade-up">
    <div className="text-center max-w-2xl mx-auto mb-12">
    <span className="text-xs font-bold uppercase tracking-widest text-slate-900 bg-slate-200/80 px-3.5 py-1.5 rounded-full inline-block mb-3">
    {t("website.custom.badge")}
    </span>
    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
    {t("website.custom.title")}
    </h3>
    <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
    {t("website.custom.subtitle")}
    </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
    {CUSTOM_SERVICES.map((service, index) => {
      const Icon = service.icon;
      return (
        <div
        key={index}
        className="group relative bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:bg-slate-900 hover:border-slate-900 transition-all duration-500 overflow-hidden"
        >
        {/* Decorative background element on hover */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10">
        {/* Header: icono y badge en columna para que no se apreten ni se solapen */}
        <div className="flex flex-col items-start gap-3 mb-6">
        <div className="p-3 bg-slate-100 text-slate-900 rounded-2xl group-hover:bg-white transition-colors duration-500">
        <Icon className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 group-hover:bg-white/10 group-hover:text-slate-300 group-hover:border-white/10 transition-colors duration-500 break-words">
        {t(service.badgeKey)}
        </span>
        </div>

        <h4 className="font-extrabold text-slate-900 text-lg sm:text-xl mb-3 leading-snug group-hover:text-white transition-colors duration-500">
        {t(service.titleKey)}
        </h4>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 group-hover:text-slate-300 transition-colors duration-500">
        {t(service.descKey)}
        </p>
        </div>

        <div className="relative z-10 pt-5 border-t border-slate-100 group-hover:border-slate-800 transition-colors duration-500 space-y-3">
        {service.highlightKeys.map((itemKey, idx) => (
          <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium group-hover:text-slate-200 transition-colors duration-500">
          <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-500">
          <Check className="w-3 h-3 text-slate-900 group-hover:text-white transition-colors duration-500" strokeWidth={3} />
          </div>
          <span className="leading-relaxed">{t(itemKey)}</span>
          </div>
        ))}
        </div>
        </div>
      );
    })}
    </div>

    <div className="text-center mt-12">
    <button
    type="button"
    onClick={() => handleGoToContact(t("website.custom.contactMsg"))}
    className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 cursor-pointer"
    >
    {t("website.custom.cta")}
    <ArrowRight className="w-4 h-4" />
    </button>
    </div>
    </div>

    {/* ============================================================ */}
    {/* BLOQUE 3: CASOS DE ÉXITO Y TRABAJOS REALIZADOS (PROYECTOS)   */}
    {/* ============================================================ */}
    <div>
    <div className="text-center mb-12" data-aos="fade-up">
    <span className="text-xs font-bold uppercase tracking-widest text-slate-900 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full inline-block mb-3">
    {t("website.showcase.badge")}
    </span>
    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
    {t("website.showcase.title")}
    </h3>
    <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mt-3 leading-relaxed">
    {t("website.showcase.subtitle")}
    </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
    {displayedProjects.map((project, index) => (
      <div key={project.id || index} data-aos="fade-up">
      <CardProject
      Img={project.Img}
      Title={project.Title}
      Description={project.Description}
      TechStack={project.TechStack}
      id={project.id}
      />
      </div>
    ))}
    </div>

    {projects.length > 4 && (
      <div className="mt-12 text-center">
      <button
      onClick={() => setShowAllProjects(!showAllProjects)}
      className="px-8 py-3.5 bg-white border border-slate-300 text-slate-900 hover:bg-slate-900 hover:text-white rounded-full text-sm font-semibold shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
      {showAllProjects ? t("website.seeLess") : t("website.seeMore")}
      </button>
      </div>
    )}
    </div>

    </div>
  );
}

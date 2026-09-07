import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase";
import CardProject from "../components/CardProject";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  ShoppingCart,
  CalendarClock,
  Package,
  Check,
  Smartphone,
  Monitor,
  Globe,
  Zap,
  ArrowRight
} from "lucide-react";
import { useTranslation } from "react-i18next";

/* ------------------------------------------------------------------ */
/*  1. Productos con Licencia                                          */
/* ------------------------------------------------------------------ */
const BILLING_PERIODS = [
  { key: "monthly", labelKey: "portfolio.license.monthly" },
  { key: "quarterly", labelKey: "portfolio.license.quarterly" },
  { key: "annual", labelKey: "portfolio.license.annual" },
];

const LICENSE_PRODUCTS = [
  {
    id: "sales",
    icon: ShoppingCart,
    nameKey: "portfolio.license.products.sales.name",
    descKey: "portfolio.license.products.sales.desc",
    featureKeys: [
      "portfolio.license.products.sales.f1",
      "portfolio.license.products.sales.f2",
      "portfolio.license.products.sales.f3",
    ],
    pricing: { monthly: 350, quarterly: 950, annual: 3300 },
  },
  {
    id: "booking",
    icon: CalendarClock,
    nameKey: "portfolio.license.products.booking.name",
    descKey: "portfolio.license.products.booking.desc",
    featureKeys: [
      "portfolio.license.products.booking.f1",
      "portfolio.license.products.booking.f2",
      "portfolio.license.products.booking.f3",
    ],
    pricing: { monthly: 280, quarterly: 760, annual: 2650 },
    highlighted: true,
  },
  {
    id: "inventory",
    icon: Package,
    nameKey: "portfolio.license.products.inventory.name",
    descKey: "portfolio.license.products.inventory.desc",
    featureKeys: [
      "portfolio.license.products.inventory.f1",
      "portfolio.license.products.inventory.f2",
      "portfolio.license.products.inventory.f3",
    ],
    pricing: { monthly: 400, quarterly: 1080, annual: 3800 },
  },
];

const SAVINGS_BY_PERIOD = { monthly: 0, quarterly: 9, annual: 21 };

/* ------------------------------------------------------------------ */
/*  2. Tipos de Desarrollo a la Medida                                 */
/* ------------------------------------------------------------------ */
const CUSTOM_SERVICES = [
  {
    icon: Monitor,
    titleKey: "portfolio.custom.webSystems.title",
    descKey: "portfolio.custom.webSystems.desc",
  },
  {
    icon: Smartphone,
    titleKey: "portfolio.custom.mobile.title",
    descKey: "portfolio.custom.mobile.desc",
  },
  {
    icon: Globe,
    titleKey: "portfolio.custom.websites.title",
    descKey: "portfolio.custom.websites.desc",
  },
  {
    icon: Zap,
    titleKey: "portfolio.custom.integrations.title",
    descKey: "portfolio.custom.integrations.desc",
  },
];

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [billingPeriod, setBillingPeriod] = useState("monthly");
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
      setProjects(JSON.parse(cachedProjects));
    }
    fetchData();
  }, [fetchData]);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, 4);

  return (
    <div className="md:px-[10%] px-[5%] w-full py-16 bg-white overflow-hidden" id="Projects">

      {/* ============================================================ */}
      {/* ENCABEZADO DE LA SECCIÓN                                     */}
      {/* ============================================================ */}
      <div className="text-center pb-16" data-aos="fade-up">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          {t("portfolio.title")}
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg mt-3">
          {t("portfolio.subtitle")}
        </p>
      </div>

      {/* ============================================================ */}
      {/* BLOQUE 1: SISTEMAS POR LICENCIA (Listo para usar)             */}
      {/* ============================================================ */}
      <div className="mb-24">
        <div className="text-center mb-8" data-aos="fade-up">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {t("portfolio.license.badge")}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
            {t("portfolio.license.title")}
          </h3>
          <p className="text-slate-500 text-sm max-w-lg mx-auto mt-2">
            {t("portfolio.license.intro")}
          </p>

          {/* Toggle de Periodo de Pago */}
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm mt-6">
            {BILLING_PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setBillingPeriod(p.key)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 ${
                  billingPeriod === p.key
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {t(p.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Tarjetas de Licencias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {LICENSE_PRODUCTS.map((product) => {
            const Icon = product.icon;
            const price = product.pricing[billingPeriod];
            const savings = SAVINGS_BY_PERIOD[billingPeriod];

            return (
              <div
                key={product.id}
                data-aos="fade-up"
                className={`relative rounded-2xl p-6 sm:p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 ${
                  product.highlighted
                    ? "bg-slate-900 border border-slate-900 shadow-xl text-white"
                    : "bg-white border border-slate-200 shadow-sm hover:shadow-md text-slate-900"
                }`}
              >
                {product.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                    {t("portfolio.license.popular")}
                  </span>
                )}

                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${
                  product.highlighted ? "bg-white/10" : "bg-slate-900 text-white"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>

                <h4 className="text-xl font-bold mb-1.5">{t(product.nameKey)}</h4>
                <p className={`text-sm leading-relaxed mb-6 ${product.highlighted ? "text-slate-300" : "text-slate-500"}`}>
                  {t(product.descKey)}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold">Bs {price.toLocaleString()}</span>
                    <span className={`text-xs ${product.highlighted ? "text-slate-400" : "text-slate-400"}`}>
                      / {t(`portfolio.license.${billingPeriod}Short`)}
                    </span>
                  </div>
                  {savings > 0 && (
                    <span className={`mt-1 inline-block text-xs font-medium ${
                      product.highlighted ? "text-emerald-400" : "text-emerald-600"
                    }`}>
                      {t("portfolio.license.savings", { percent: savings })}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {product.featureKeys.map((fKey) => (
                    <li key={fKey} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${product.highlighted ? "text-emerald-400" : "text-emerald-600"}`} />
                      <span className={product.highlighted ? "text-slate-300" : "text-slate-600"}>
                        {t(fKey)}
                      </span>
                    </li>
                  ))}
                </ul>

                <a href="#Contact">
                  <button className={`w-full py-3 rounded-xl font-medium text-sm transition-colors duration-200 ${
                    product.highlighted
                      ? "bg-white text-slate-900 hover:bg-slate-100"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}>
                    {t("portfolio.license.cta")}
                  </button>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* BLOQUE 2: DESARROLLO A LA MEDIDA (¿Qué tipo de proyectos hago?) */}
      {/* ============================================================ */}
      <div className="mb-24 rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12" data-aos="fade-up">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {t("portfolio.custom.badge")}
          </span>
          <h3 className="text-2xl md:text-4xl font-bold text-slate-900 mt-1">
            {t("portfolio.custom.title")}
          </h3>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            {t("portfolio.custom.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CUSTOM_SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-slate-900 text-white rounded-xl w-fit mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-2">
                    {t(service.titleKey)}
                  </h4>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    {t(service.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <a href="#Contact" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors">
            {t("portfolio.custom.cta")}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BLOQUE 3: CASOS DE ÉXITO Y TRABAJOS REALIZADOS               */}
      {/* ============================================================ */}
      <div>
        <div className="text-center mb-10" data-aos="fade-up">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {t("portfolio.showcase.badge")}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
            {t("portfolio.showcase.title")}
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mt-2">
            {t("portfolio.showcase.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {displayedProjects.map((project, index) => (
            <div key={project.id || index} data-aos="fade-up">
              <CardProject
                Img={project.Img}
                Title={project.Title}
                Description={project.Description}
                Link={project.Link}
                id={project.id}
              />
            </div>
          ))}
        </div>

        {projects.length > 4 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-sm font-medium shadow-sm hover:bg-slate-50 transition-all"
            >
              {showAllProjects ? t("portfolio.seeLess") : t("portfolio.seeMore")}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

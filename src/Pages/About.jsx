import React, { useEffect, memo, useMemo } from "react"
import { Code, Award, Globe, ArrowUpRight, UserCheck, Github, Linkedin, ShieldCheck, Zap } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useTranslation } from "react-i18next"

/* ------------------------------------------------------------------ */
/*  Static data — equipo fundador                                     */
/* ------------------------------------------------------------------ */

const TEAM = [
  {
    name: "Yoel Bulacia",
    photo: "team-yoel.jpg",
    roleKey: "developer",
    linkedin: "https://www.linkedin.com/in/bulacia-yoel/",
    github: "https://github.com/1Benji-1",
  },
  {
    name: "Isabel Vaquera",
    photo: "team-isabel.jpg",
    roleKey: "pm",
    linkedin: "",
    github: "",
  },
]

// Header limpio y minimalista
const Header = memo(() => {
  const { t } = useTranslation();
  return (
    <div className="text-center lg:mb-12 mb-6 px-[5%]">
      <div className="inline-block relative group">
        <h2
          className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
          data-aos="zoom-in-up"
          data-aos-duration="600"
        >
          {t("about.title")}
        </h2>
      </div>
    </div>
  );
});

const TeamCard = memo(({ member, animation }) => {
  const { t } = useTranslation();
  return (
    <div
      className="group relative rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center"
      data-aos={animation}
      data-aos-duration="1000"
    >
      <div className="relative mb-5">
        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm">
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border-4 border-white">
          <UserCheck className="w-4 h-4 text-white" />
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900">{member.name}</h3>
      <span className="mt-1 inline-block text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
        {t(`about.team.${member.roleKey}.role`)}
      </span>
      <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-xs">
        {t(`about.team.${member.roleKey}.bio`)}
      </p>

      {(member.linkedin || member.github) && (
        <div className="mt-5 flex items-center gap-3">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} GitHub`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
});

const StatCard = memo(({ icon: Icon, color, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration={1300} className="relative group">
    <div className="relative z-10 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
      <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>

      <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-900 transition-transform group-hover:rotate-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <span
          className="text-4xl font-bold text-slate-900"
          data-aos="fade-up-left"
          data-aos-duration="1500"
          data-aos-anchor-placement="top-bottom"
        >
          {value}
        </span>
      </div>

      <div>
        <p
          className="text-sm uppercase tracking-wider text-slate-500 mb-2"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-anchor-placement="top-bottom"
        >
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p
            className="text-xs text-slate-400"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-anchor-placement="top-bottom"
          >
            {description}
          </p>
          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
        </div>
      </div>
    </div>
  </div>
));

const AboutPage = () => {
  const { t } = useTranslation();

  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");

    const startDate = new Date("2021-11-06");
    const today = new Date();
    const experience = today.getFullYear() - startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

    return {
      totalProjects: storedProjects.length,
      totalCertificates: storedCertificates.length,
      YearExperience: experience
    };
  }, []);

  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: false,
      });
    };

    initAOS();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAOS, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-neutral-600 to-neutral-400",
      value: totalProjects,
      label: t("about.stats.projects"),
      description: t("about.stats.projectsDesc"),
      animation: "fade-right",
    },
    {
      icon: Award,
      color: "from-neutral-600 to-neutral-400",
      value: totalCertificates,
      label: t("about.stats.certificates"),
      description: t("about.stats.certificatesDesc"),
      animation: "fade-up",
    },
    {
      icon: Globe,
      color: "from-neutral-500 to-neutral-300",
      value: YearExperience,
      label: t("about.stats.experience"),
      description: t("about.stats.experienceDesc"),
      animation: "fade-left",
    },
  ], [totalProjects, totalCertificates, YearExperience, t]);

  return (
    <div
      className="h-auto pb-[10%] text-slate-900 overflow-hidden bg-white px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm:mt-0"
      id="About"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <Header />

      <div className="w-full mx-auto relative">
        {/* NUEVO LAYOUT DE PRESENTACIÓN (Estilo Apple / Stripe en 2 columnas) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
          {/* Columna Izquierda: Titular impactante */}
          <div className="lg:col-span-5 space-y-4" data-aos="fade-right" data-aos-duration="1000">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {t("about.heroTitle")}
            </h3>
            <div className="h-1 w-20 bg-slate-900 rounded-full"></div>
          </div>

          {/* Columna Derecha: Explicación concisa y tarjeta destacada */}
          <div className="lg:col-span-7 space-y-6" data-aos="fade-left" data-aos-duration="1000">
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {t("about.description")}
            </p>

            {/* Tarjeta de Promesa / Valor de Marca */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 shadow-sm">
              <div className="p-2.5 bg-slate-900 text-white rounded-xl shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                  {t("about.promiseTitle")}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {t("about.quote")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Equipo fundador */}
        <div className="mt-20 sm:mt-24">
          <h3
            className="text-center text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-10"
            data-aos="fade-up"
          >
            {t("about.teamTitle")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {TEAM.map((member, i) => (
              <TeamCard key={member.name} member={member} animation={i === 0 ? "fade-right" : "fade-left"} />
            ))}
          </div>
        </div>

        {/* Métricas */}
        <a href="#Projects">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </a>
      </div>
    </div>
  );
};

export default memo(AboutPage);

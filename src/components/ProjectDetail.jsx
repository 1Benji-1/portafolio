import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Github,
  Code2,
  Star,
  ChevronRight,
  Layers,
  CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { toSlug } from "../utils/slug";
import { supabase } from "../supabase";

const normalizeProject = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    Title: p.Title || p.title || "Proyecto",
    Description: p.Description || p.description || "",
    Img: p.Img || p.img || "",
    Link: p.Link || p.link || "",
    Github: p.Github || p.github || "",
    TechStack: p.TechStack || p.tech_stack || [],
    Features: p.Features || p.features || [],
  };
};

const handleGithubClick = (githubLink, t) => {
  if (githubLink === "Private" || !githubLink) {
    Swal.fire({
      icon: "info",
      title: t("projectDetail.privateRepoTitle"),
      text: t("projectDetail.privateRepoDesc"),
      confirmButtonText: t("projectDetail.understood"),
      confirmButtonColor: "#0f172a",
      background: "#ffffff",
      color: "#0f172a",
      customClass: {
        popup: "rounded-2xl border border-slate-200 shadow-2xl",
        confirmButton: "rounded-xl font-semibold px-6 py-2.5",
      },
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const loadProject = useCallback(async () => {
    setIsLoading(true);
    setNotFound(false);

    // 1. Intentar cargar desde localStorage (rápido y con soporte offline)
    try {
      const cached = localStorage.getItem("projects");
      if (cached) {
        const list = JSON.parse(cached);
        if (Array.isArray(list)) {
          const match = list.find((p) => {
            const title = p.Title || p.title || "";
            return toSlug(title) === slug;
          });
          if (match) {
            setProject(normalizeProject(match));
            setIsLoading(false);
            return;
          }
        }
      }
    } catch (e) {
      console.error("Error reading projects from cache:", e);
    }

    // 2. Si no se encontró en cache, consultar directamente a Supabase
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*");

      if (error) throw error;

      if (data && Array.isArray(data)) {
        const match = data.find((p) => {
          const title = p.title || p.Title || "";
          return toSlug(title) === slug;
        });

        if (match) {
          const norm = normalizeProject(match);
          setProject(norm);
          setIsLoading(false);
          return;
        }
      }

      setNotFound(true);
    } catch (err) {
      console.error("Error fetching project from Supabase:", err);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProject();
  }, [loadProject]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          <h2 className="text-sm font-bold text-slate-700">
            {t("projectDetail.loading")}
          </h2>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Proyecto no encontrado</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            No se pudo encontrar la información para el proyecto solicitado.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t("projectDetail.back")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const projectUrl = `https://islumen.vercel.app/project/${toSlug(project.Title)}`;

  return (
    <>
      <Helmet>
        <title>{project.Title} — Lumen</title>
        <meta
          name="description"
          content={
            project.Description
              ? project.Description.slice(0, 155)
              : `Proyecto ${project.Title} por Lumen — Tech Company.`
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={projectUrl} />
        <meta property="og:title" content={`${project.Title} — Lumen`} />
        <meta
          property="og:description"
          content={project.Description?.slice(0, 155)}
        />
        <meta property="og:url" content={projectUrl} />
        <meta property="og:type" content="website" />
        {project.Img && <meta property="og:image" content={project.Img} />}
      </Helmet>

      <div className="min-h-screen bg-slate-50 text-slate-900 py-8 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Botón Volver */}
          <div className="flex items-center justify-between gap-4 mb-8 md:mb-12 pb-5 border-b border-slate-200">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-900 hover:text-white text-slate-800 rounded-xl border border-slate-200 hover:border-slate-900 shadow-xs hover:shadow-sm font-semibold text-sm transition-all duration-200 cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>{t("projectDetail.back")}</span>
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium truncate">
              <Link to="/#Website" className="hover:text-slate-900 transition-colors">
                {t("projectDetail.projects")}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span className="text-slate-900 font-bold truncate">
                {project.Title}
              </span>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Columna Izquierda: Información del Proyecto (7 cols) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-200/80 border border-slate-300/80 px-3.5 py-1 rounded-full inline-block mb-3">
                  Lumen Portfolio
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {project.Title}
                </h1>
              </div>

              <div>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                  {project.Description}
                </p>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-3 p-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                    <Code2 className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">
                      {project.TechStack?.length || 0}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {t("projectDetail.technologies")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                    <Layers className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">
                      {project.Features?.length || 0}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {t("projectDetail.keyFeatures")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enlace Github / Código (NO Live Demo) */}
              {project.Github && (
                <div className="flex flex-wrap gap-3 pt-1">
                  <a
                    href={project.Github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                    onClick={(e) =>
                      !handleGithubClick(project.Github, t) && e.preventDefault()
                    }
                  >
                    <Github className="w-4 h-4" />
                    <span>{t("projectDetail.viewCode")}</span>
                  </a>
                </div>
              )}

              {/* Tecnologías Utilizadas */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-slate-900" />
                  <span>{t("projectDetail.technologiesUsed")}</span>
                </h3>

                {project.TechStack && project.TechStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.TechStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold shadow-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    {t("projectDetail.noTechnologies")}
                  </p>
                )}
              </div>
            </div>

            {/* Columna Derecha: Imagen del Proyecto & Funcionalidades Destacadas (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Contenedor de Imagen */}
              {project.Img ? (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
                  <img
                    src={project.Img}
                    alt={project.Title}
                    className="w-full h-auto object-cover max-h-[460px]"
                  />
                </div>
              ) : null}

              {/* Funcionalidades Destacadas */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-slate-900 fill-slate-900" />
                  <span>{t("projectDetail.featuredCapabilities")}</span>
                </h3>

                {project.Features && project.Features.length > 0 ? (
                  <ul className="space-y-3">
                    {project.Features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium"
                      >
                        <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">
                    {t("projectDetail.noFeatures")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;

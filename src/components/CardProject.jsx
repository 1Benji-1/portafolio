import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toSlug } from "../utils/slug";

const CardProject = ({
  Img,
  img,
  Title,
  title,
  Description,
  description,
  TechStack,
  tech_stack,
  id,
}) => {
  const { t } = useTranslation();
  const projectTitle = Title || title || "";
  const projectImg = Img || img || "";
  const projectDesc = Description || description || "";
  const projectStack = (TechStack && TechStack.length > 0) ? TechStack : (tech_stack || []);
  const slug = toSlug(projectTitle);
  const projectLink = id ? `/project/${slug}` : "#";

  return (
    <div className="group relative flex flex-col h-full rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300">
      {/* Imagen con enlace directo y hover zoom */}
      <Link
        to={projectLink}
        className="relative block overflow-hidden bg-slate-100 aspect-[16/9] border-b border-slate-100 cursor-pointer"
      >
        {projectImg ? (
          <img
            src={projectImg}
            alt={projectTitle}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-sm font-medium">
            Lumen Showcase
          </div>
        )}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/95 text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </Link>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-1">
        {/* Badges de tecnología si existen */}
        {projectStack && projectStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {projectStack.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full"
              >
                {tech}
              </span>
            ))}
            {projectStack.length > 3 && (
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                +{projectStack.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Título */}
        <Link to={projectLink} className="block group-hover:text-slate-700 transition-colors">
          <h3 className="text-xl font-bold text-slate-900 leading-snug tracking-tight">
            {projectTitle}
          </h3>
        </Link>

        {/* Descripción */}
        <p className="mt-2 text-slate-500 text-sm leading-relaxed line-clamp-2 font-normal flex-1">
          {projectDesc}
        </p>

        {/* Botón Ver Más Detalles — Diseño moderno en blanco y negro */}
        <div className="pt-5 mt-4 border-t border-slate-100">
          <Link
            to={projectLink}
            className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-900 text-slate-800 hover:text-white border border-slate-200 hover:border-slate-900 font-semibold text-xs sm:text-sm transition-all duration-300 group/btn"
          >
            <span>{t("website.showcase.seeDetails") || "Ver más detalles"}</span>
            <div className="w-6 h-6 rounded-full bg-white text-slate-900 group-hover/btn:bg-white/20 group-hover/btn:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardProject;

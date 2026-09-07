import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import { toSlug } from "../utils/slug";

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      console.log("ProjectLink kosong");
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };

  const handleDetails = (e) => {
    if (!id) {
      console.log("ID kosong");
      e.preventDefault();
      alert("Project details are not available");
    }
  };

  return (
    <div className="group relative w-full h-full">
      {/* Glow neutro, mismo lenguaje que los botones y social links del Home */}


      <div className="relative h-full overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:border-slate-300 group-hover:shadow-md transition-all duration-300">
        <div className="p-4 sm:p-5 flex flex-col h-full">
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <img
              src={Img}
              alt={Title}
              className="w-full h-full object-cover aspect-[16/8] transform group-hover:scale-105 transition-transform duration-500"
            />

          </div>

          <div className="mt-4 space-y-2.5 flex-1 flex flex-col">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
              {Title}
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 flex-1 font-light">
              {Description}
            </p>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100 mt-2">
              {ProjectLink ? (
                <a
                  href={ProjectLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemo}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors duration-200"
                >
                  <span className="text-sm font-medium">Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-slate-400 text-sm">
                  Demo Not Available
                </span>
              )}

              {id ? (
                <Link
                  to={`/project/${toSlug(Title)}`}
                  onClick={handleDetails}
                  className="relative group/btn shrink-0"
                >

                  <div className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 bg-white/10" />
                    <span className="relative text-xs font-medium text-white">
                      Details
                    </span>
                    <ArrowRight className="relative w-3.5 h-3.5 text-white group-hover/btn:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ) : (
                <span className="text-slate-400 text-sm">
                  Details Not Available
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;

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
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-600 to-neutral-400 rounded-2xl opacity-0 group-hover:opacity-40 blur-md transition-all duration-700" />

      <div className="relative h-full overflow-hidden rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <div className="p-4 sm:p-5 flex flex-col h-full">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <img
              src={Img}
              alt={Title}
              className="w-full h-full object-cover aspect-[16/8] transform group-hover:scale-105 transition-transform duration-500 grayscale-[15%] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          <div className="mt-4 space-y-2.5 flex-1 flex flex-col">
            <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              {Title}
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1 font-light">
              {Description}
            </p>

            <div className="pt-3 flex items-center justify-between border-t border-white/10 mt-2">
              {ProjectLink ? (
                <a
                  href={ProjectLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemo}
                  className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <span className="text-sm font-medium">Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-gray-600 text-sm">
                  Demo Not Available
                </span>
              )}

              {id ? (
                <Link
                  to={`/project/${toSlug(Title)}`}
                  onClick={handleDetails}
                  className="relative group/btn shrink-0"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-600 to-neutral-400 rounded-lg opacity-0 group-hover/btn:opacity-60 blur transition-all duration-300" />
                  <div className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-neutral-400/20 to-neutral-200/20" />
                    <span className="relative text-xs font-medium bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                      Details
                    </span>
                    <ArrowRight className="relative w-3.5 h-3.5 text-gray-200 group-hover/btn:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ) : (
                <span className="text-gray-600 text-sm">
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

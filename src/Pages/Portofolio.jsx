import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";
import { useTranslation } from "react-i18next";

const ToggleButton = ({ onClick, isShowingMore }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className="
        px-3 py-1.5
        text-slate-300
        hover:text-white
        text-sm
        font-medium
        transition-all
        duration-300
        ease-in-out
        flex
        items-center
        gap-2
        bg-white/5
        hover:bg-white/10
        rounded-md
        border
        border-white/10
        hover:border-white/20
        backdrop-blur-sm
        group
        relative
        overflow-hidden
      "
    >
      <span className="relative z-10 flex items-center gap-2">
        {isShowingMore ? t("portfolio.seeLess") : t("portfolio.seeMore")}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`
            transition-transform
            duration-300
            ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
          `}
        >
          <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
        </svg>
      </span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-400/50 transition-all duration-300 group-hover:w-full"></span>
    </button>
  );
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const techStacks = [
  // Lenguajes Core
  { icon: "typescript.svg", language: "TypeScript" },
  { icon: "flutter.svg", language: "Flutter" },
  { icon: "python.svg", language: "Python" },

  // Frontend
  { icon: "reactjs.svg", language: "React" },
  { icon: "nextjs.svg", language: "Next.js" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },

  // Backend & Base de Datos
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "postgresql.svg", language: "PostgreSQL" },
  { icon: "supabase.svg", language: "Supabase" },

  // Infraestructura, Despliegue & Nube
  { icon: "docker.svg", language: "Docker" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "aws.svg", language: "AWS" },
];

export default function FullWidthTabs() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [projectsResponse, certificatesResponse] = await Promise.all([
        supabase.from("projects").select("*").order('id', { ascending: false }),
        supabase.from("certificates").select("*").order('id', { ascending: false }),
      ]);

      if (projectsResponse.error) throw projectsResponse.error;
      if (certificatesResponse.error) throw certificatesResponse.error;

      // Supabase devuelve las columnas en minúscula (title, img, tech_stack...).
      // Normalizamos a los nombres que espera el resto del sitio
      // (CardProject.jsx, ProjectDetail.jsx, Certificate.jsx) para no
      // romper esos componentes.
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

      const certificateData = (certificatesResponse.data || []).map((c) => ({
        id: c.id,
        Img: c.img,
      }));

      setProjects(projectData);
      setCertificates(certificateData);

      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
  }, []);

  useEffect(() => {
    const cachedProjects = localStorage.getItem('projects');
    const cachedCertificates = localStorage.getItem('certificates');

    if (cachedProjects && cachedCertificates) {
        setProjects(JSON.parse(cachedProjects));
        setCertificates(JSON.parse(cachedCertificates));
    }

    fetchData();
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-transparent overflow-hidden" id="Portofolio">

      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
          <span style={{
            color: '#ffffff',
            backgroundImage: 'linear-gradient(45deg, #ffffff 10%, #a3a3a3 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t("portfolio.title")}
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          {t("portfolio.subtitle")}
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(150, 150, 150, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(150, 150, 150, 0.1))",
                  boxShadow: "0 4px 15px -3px rgba(255, 255, 255, 0.1)",
                  "& .lucide": {
                    color: "#ffffff",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t("portfolio.tabs.projects")}
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t("portfolio.tabs.certificates")}
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t("portfolio.tabs.techStack")}
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
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
            </div>
            {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={certificate.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <Certificate ImgSertif={certificate.Img} />
                  </div>
                ))}
              </div>
            </div>
            {certificates.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('certificates')}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}

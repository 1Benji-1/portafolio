import React, { useState, useEffect, useCallback, memo } from "react"
import { Helmet } from "react-helmet-async"
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  ArrowUpRight,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import AOS from "aos"
import "aos/dist/aos.css"

/* ------------------------------------------------------------------ */
/*  Static data                                                       */
/* ------------------------------------------------------------------ */

const TYPING_SPEED = 100
const ERASING_SPEED = 50
const PAUSE_DURATION = 2000

const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/1Benji-1", label: "GitHub Profile" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/bulacia-yoel/", label: "LinkedIn Profile" },
  { icon: Instagram, link: "https://www.instagram.com/bulacia_yoel/?hl=id", label: "Instagram Profile" },
]

/* Terminal boot sequence — decorative, updated for corporate context */
const TERMINAL_LINES = [
  "> Initializing enterprise environment...",
  "[OK] Node.js runtime ready",
  "[OK] PostgreSQL connection established",
  "[OK] Cloud architecture configured",
  "",
  "> Compiling custom system...",
  "[✓] Business logic optimized",
  "[✓] Secure API endpoints exposed",
  "[✓] Deployed to production",
  "",
  "System operational. Let's talk ↓",
]

/* ------------------------------------------------------------------ */
/*  Small presentational components                                   */
/* ------------------------------------------------------------------ */

const GridBackground = memo(() => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000009_1px,transparent_1px),linear-gradient(to_bottom,#00000009_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black_20%,transparent_85%)]"
  />
))

const PrimaryButton = memo(({ href, text, icon: Icon }) => (
  <a
    href={href}
    className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm md:text-base font-medium text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl"
  >
    {text}
    <Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
  </a>
))

const SecondaryButton = memo(({ href, text, icon: Icon }) => (
  <a
    href={href}
    className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm md:text-base font-medium text-slate-900 shadow-sm transition-all hover:bg-slate-50"
  >
    {text}
    <Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
  </a>
))

const SocialLink = memo(({ icon: Icon, link, label }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="group flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
  >
    <Icon className="h-4.5 w-4.5 text-slate-500 transition-colors group-hover:text-slate-900" />
  </a>
))

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

const Home = () => {
  const { t, i18n } = useTranslation()
  const WORDS = t("home.words", { returnObjects: true })

  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const initAOS = () => AOS.init({ once: true, offset: 10 })
    initAOS()
    window.addEventListener("resize", initAOS)
    return () => window.removeEventListener("resize", initAOS)
  }, [])

  useEffect(() => {
    setIsLoaded(true)
    return () => setIsLoaded(false)
  }, [])

  useEffect(() => {
    setText("")
    setCharIndex(0)
    setWordIndex(0)
    setIsTyping(true)
  }, [i18n.language])

  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText((prev) => prev + WORDS[wordIndex][charIndex])
        setCharIndex((prev) => prev + 1)
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION)
      }
    } else {
      if (charIndex > 0) {
        setText((prev) => prev.slice(0, -1))
        setCharIndex((prev) => prev - 1)
      } else {
        setWordIndex((prev) => (prev + 1) % WORDS.length)
        setIsTyping(true)
      }
    }
  }, [charIndex, isTyping, wordIndex, WORDS])

  useEffect(() => {
    const timeout = setTimeout(handleTyping, isTyping ? TYPING_SPEED : ERASING_SPEED)
    return () => clearTimeout(timeout)
  }, [handleTyping])

  return (
    <>
      <Helmet>
        <title>Lumen | Software a Medida & Soluciones Digitales</title>
        <meta
          name="description"
          content="Lumen desarrolla software a la medida para empresas y PyMEs. Soluciones digitales diseñadas para optimizar procesos, controlar ventas e impulsarte al siguiente nivel."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://comrad.vercel.app" />
        <meta property="og:title" content="Lumen — El Futuro Digital de tu Empresa" />
        <meta
          property="og:description"
          content="Desarrollo de software a la medida, automatización e infraestructura en la nube para empresas que buscan crecer."
        />
        <meta property="og:url" content="https://comrad.vercel.app" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Fondo blanco opaco propio de Home */}
      <section
        id="Home"
        className={`relative isolate overflow-hidden bg-white transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <GridBackground />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-24 sm:px-8 sm:pt-28 lg:px-10">
          {/* ---------------------------------------------------------- */}
          {/* Hero                                                       */}
          {/* ---------------------------------------------------------- */}
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-10">
            {/* Left column */}
            <div className="flex flex-col gap-6" data-aos="fade-right" data-aos-delay="200">
              <h1
                className="text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-6xl xl:text-7xl"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                {t("home.role1")}
                <br />
                <span className="text-slate-400">{t("home.role2")}</span>
              </h1>

              {/* Typing effect */}
              <div className="flex h-8 items-center" data-aos="fade-up" data-aos-delay="600">
                <span className="text-lg font-medium text-slate-700 md:text-xl">{text}</span>
                <span className="ml-1 h-6 w-[3px] animate-pulse bg-slate-900" />
              </div>

              <p
                className="max-w-lg text-base leading-relaxed text-slate-500 md:text-lg"
                data-aos="fade-up"
                data-aos-delay="800"
              >
                {t("home.description")}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center gap-4" data-aos="fade-up" data-aos-delay="1000">
                <PrimaryButton href="#Projects" text={t("home.projects")} icon={ArrowUpRight} />
                <SecondaryButton href="#Contact" text={t("home.contact")} icon={Mail} />
              </div>

              {/* Social links */}
              <div className="flex gap-3" data-aos="fade-up" data-aos-delay="1200">
                {SOCIAL_LINKS.map((social) => (
                  <SocialLink key={social.label} {...social} />
                ))}
              </div>
            </div>

            {/* Right column — terminal card */}
            <div
              className="relative flex w-full items-start lg:pt-[40px] lg:aspect-[4/5]"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
                <div className="flex h-10 shrink-0 items-center gap-2 border-b border-slate-800 bg-slate-900 px-4">
                  <div className="h-3 w-3 rounded-full bg-slate-700" />
                  <div className="h-3 w-3 rounded-full bg-slate-700" />
                  <div className="h-3 w-3 rounded-full bg-slate-700" />
                  <span className="ml-2 text-xs text-slate-500">lumen@terminal ~ %</span>
                </div>
                <div className="flex min-h-[280px] flex-col justify-end p-6 font-mono text-xs leading-relaxed text-emerald-400/80 sm:min-h-[360px] sm:text-sm">
                  {TERMINAL_LINES.map((line, i) => (
                    <div key={i} className={line === "" ? "h-3" : ""}>
                      {line}
                    </div>
                  ))}
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default memo(Home)

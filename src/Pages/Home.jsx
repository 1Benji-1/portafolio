import React, { useState, useEffect, useCallback, useRef, memo } from "react"
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
import { supabase } from "../supabase"

/* ------------------------------------------------------------------ */
/*  Static data                                                       */
/* ------------------------------------------------------------------ */

const TYPING_SPEED = 100
const ERASING_SPEED = 50
const PAUSE_DURATION = 2000

const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/lumen-org", label: "GitHub Profile" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/Lumen-Lumen/", label: "LinkedIn Profile" },
  { icon: Instagram, link: "https://www.instagram.com/Lumen_Lumen/?hl=id", label: "Instagram Profile" },
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
  "System operational. Try typing a command below ↓",
]

/* Terminal typing animation timing */
const LINE_TYPING_SPEED = 22 // ms per character
const LINE_PAUSE = 250 // pause after finishing a non-empty line
const EMPTY_LINE_PAUSE = 120 // pause after an empty line

/* Secret command — the actual coupon code + claim limit live in Supabase,
   not here. This file only knows the command that triggers the check. */
const SECRET_COMMAND = "lumen --version"
const SECRET_COUPON_CODE = "LUMEN25" // must match the "code" seeded in Supabase

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
/*  Interactive terminal                                               */
/* ------------------------------------------------------------------ */

const InteractiveTerminal = () => {
  const [typedLines, setTypedLines] = useState([])
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [bootComplete, setBootComplete] = useState(false)

  const [command, setCommand] = useState("")
  const [history, setHistory] = useState([]) // { id, command, responseLines, tone }
  const [isChecking, setIsChecking] = useState(false)

  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const entryIdRef = useRef(0)

  /* Type out the boot sequence, line by line, character by character */
  useEffect(() => {
    if (bootComplete) return

    if (lineIndex >= TERMINAL_LINES.length) {
      setBootComplete(true)
      return
    }

    const currentLine = TERMINAL_LINES[lineIndex]

    if (charIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setTypedLines((prev) => {
          const updated = [...prev]
          updated[lineIndex] = currentLine.slice(0, charIndex + 1)
          return updated
        })
        setCharIndex((prev) => prev + 1)
      }, LINE_TYPING_SPEED)
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(
      () => {
        setLineIndex((prev) => prev + 1)
        setCharIndex(0)
      },
      currentLine === "" ? EMPTY_LINE_PAUSE : LINE_PAUSE
    )
    return () => clearTimeout(timeout)
  }, [lineIndex, charIndex, bootComplete])

  /* Focus the input once the boot animation finishes ONLY IF user is still in the hero section */
  useEffect(() => {
    if (bootComplete) {
      if (window.scrollY < 150) {
        inputRef.current?.focus({ preventScroll: true })
      }
    }
  }, [bootComplete])

  /* Keep the terminal scrolled to the latest line */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [typedLines, history, bootComplete, isChecking])

  const appendEntry = useCallback((command, responseLines, tone = "muted") => {
    entryIdRef.current += 1
    setHistory((prev) => [...prev, { id: entryIdRef.current, command, responseLines, tone }])
  }, [])

  const updateEntry = useCallback((id, responseLines, tone) => {
    setHistory((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, responseLines, tone } : entry))
    )
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const trimmed = command.trim()
      if (!trimmed || isChecking) return
      setCommand("")

      const normalized = trimmed.toLowerCase()

      if (normalized === "clear") {
        setHistory([])
        return
      }

      if (normalized === "help" || normalized === "--help") {
        appendEntry(trimmed, ["Comandos disponibles: lumen --version, clear"], "muted")
        return
      }

      if (normalized !== SECRET_COMMAND) {
        appendEntry(trimmed, [`zsh: command not found: ${trimmed}`], "muted")
        return
      }

      /* Secret command: ask Supabase, since the coupon pool and the
         5-claim limit live server-side, not in this file. */
      entryIdRef.current += 1
      const entryId = entryIdRef.current
      setHistory((prev) => [
        ...prev,
        { id: entryId, command: trimmed, responseLines: ["Verificando disponibilidad..."], tone: "muted" },
      ])
      setIsChecking(true)

      try {
        const { data, error } = await supabase.rpc("claim_secret_coupon", {
          p_code: SECRET_COUPON_CODE,
        })

        if (error) throw error

        const result = Array.isArray(data) ? data[0] : data

        if (result?.claimed) {
          updateEntry(
            entryId,
            [
              "v2.5.0",
              "🎉 ¡Código secreto desbloqueado!",
              `25% de descuento — código: ${result.code}`,
              `Cupones restantes: ${result.remaining}`,
            ],
            "success"
          )
        } else {
          updateEntry(
            entryId,
            ["v2.5.0", "Ya se reclamaron los 5 cupones disponibles. ¡La próxima vez sé más rápido!"],
            "muted"
          )
        }
      } catch (err) {
        updateEntry(entryId, ["Error al verificar el cupón. Intenta de nuevo más tarde."], "muted")
      } finally {
        setIsChecking(false)
      }
    },
    [command, isChecking, appendEntry, updateEntry]
  )

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Title bar with macOS-style traffic lights */}
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-slate-800 bg-slate-900 px-4">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <div className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-slate-500">lumen@terminal ~ %</span>
      </div>

      {/* Body */}
      <div
        ref={scrollRef}
        onClick={() => bootComplete && inputRef.current?.focus({ preventScroll: true })}
        className="flex h-[280px] flex-col overflow-y-auto p-6 font-mono text-xs leading-relaxed text-emerald-400/80 sm:h-[360px] sm:text-sm"
      >
        <div className="mt-auto">
          {/* Boot sequence */}
          {typedLines.map((line, i) => (
            <div key={i} className={line === "" ? "h-3" : ""}>
              {line}
            </div>
          ))}
          {!bootComplete && <span className="animate-pulse">_</span>}

          {/* Interactive prompt, shown once boot animation finishes */}
          {bootComplete && (
            <>
              {history.map((entry) => (
                <div key={entry.id} className="mt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-500">lumen@terminal ~ %</span>
                    <span className="text-slate-200">{entry.command}</span>
                  </div>
                  {entry.responseLines.map((line, j) => (
                    <div key={j} className={entry.tone === "success" ? "text-yellow-400" : "text-slate-500"}>
                      {line}
                    </div>
                  ))}
                </div>
              ))}

              <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
                <span className="shrink-0 text-slate-500">lumen@terminal ~ %</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  disabled={isChecking}
                  className="w-full min-w-0 flex-1 bg-transparent text-emerald-400 outline-none caret-emerald-400 disabled:opacity-50"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  aria-label="Terminal command input"
                />
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

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
        <link rel="canonical" href="https://lumen.vercel.app" />
        <meta property="og:title" content="Lumen — El Futuro Digital de tu Empresa" />
        <meta
          property="og:description"
          content="Desarrollo de software a la medida, automatización e infraestructura en la nube para empresas que buscan crecer."
        />
        <meta property="og:url" content="https://lumen.vercel.app" />
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

        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-4 sm:pb-8 pt-24 sm:px-8 sm:pt-28 lg:px-10">
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
              <InteractiveTerminal />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default memo(Home)
import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");

    const navItems = [
        { href: "#Home", key: "home" },
        { href: "#Projects", key: "projects" },
        { href: "#About", key: "about" },
        { href: "#Contact", key: "contact" },
    ];

    useEffect(() => {
        const NAV_OFFSET = 120;

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            const sections = navItems
                .map((item) => {
                    const el = document.querySelector(item.href);
                    return el ? { id: item.href.slice(1), top: el.offsetTop - NAV_OFFSET } : null;
                })
                .filter(Boolean)
                .sort((a, b) => a.top - b.top);

            if (sections.length === 0) return;

            const scrollPos = window.scrollY;
            const nearBottom =
                window.innerHeight + scrollPos >= document.documentElement.scrollHeight - 5;

            let current = sections[0].id;
            for (const section of sections) {
                if (scrollPos >= section.top) {
                    current = section.id;
                }
            }
            if (nearBottom) {
                current = sections[sections.length - 1].id;
            }

            setActiveSection(current);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
            const top = section.offsetTop - 70;
            window.scrollTo({
                top: top,
                behavior: "smooth",
            });
        }
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed w-full top-0 z-50 border-b transition-all duration-500 ${
                isOpen
                    ? "bg-white border-slate-200"
                    : scrolled
                    ? "bg-white/80 backdrop-blur-xl border-slate-200"
                    : "bg-white/60 backdrop-blur-md border-transparent"
            }`}
        >
            <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%]">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="text-2xl font-bold text-slate-900 font-comfortaa tracking-tight"
                        >
                            lumen
                        </a>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-8 flex items-center space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.key}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className="group relative px-1 py-2 text-sm font-medium"
                                >
                                    <span
                                        className={`relative z-10 transition-colors duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "text-slate-900 font-semibold"
                                                : "text-slate-500 group-hover:text-slate-900"
                                        }`}
                                    >
                                        {t(`nav.${item.key}`)}
                                    </span>
                                    <span
                                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 transform origin-left transition-transform duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "scale-x-100"
                                                : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                    />
                                </a>
                            ))}
                            <LanguageSwitcher />
                            <a
                                href="#Contact"
                                onClick={(e) => scrollToSection(e, "#Contact")}
                                className="group inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-slate-800"
                            >
                                {t("nav.contact")}
                                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </div>
                    </div>

                    <div className="md:hidden flex items-center gap-2">
                        <LanguageSwitcher />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`relative p-2 text-slate-500 hover:text-slate-900 transition-transform duration-300 ease-in-out transform ${
                                isOpen ? "rotate-90 scale-125" : "rotate-0 scale-100"
                            }`}
                        >
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${
                    isOpen
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <div className="px-4 py-6 space-y-4 bg-white">
                    {navItems.map((item, index) => (
                        <a
                            key={item.key}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ease ${
                                activeSection === item.href.substring(1)
                                    ? "text-slate-900 font-semibold"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                            style={{
                                transitionDelay: `${index * 100}ms`,
                                transform: isOpen ? "translateX(0)" : "translateX(50px)",
                                opacity: isOpen ? 1 : 0,
                            }}
                        >
                            {t(`nav.${item.key}`)}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

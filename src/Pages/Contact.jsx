import React, { useState, useEffect } from "react";
import { Share2, User, Mail, MessageSquare, Send } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({
      once: false,
    });

    // Pre-fill message from URL query param (if coming from external link)
    const params = new URLSearchParams(window.location.search);
    const prefilledMsg = params.get("msg");
    if (prefilledMsg) {
      setFormData((prev) => ({ ...prev, message: prefilledMsg }));
      window.history.replaceState({}, "", window.location.pathname + window.location.hash);
      setTimeout(() => {
        const contactEl = document.getElementById("Contact");
        if (contactEl) contactEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }

    // In-page smooth event listener (no page reload)
    const handlePrefill = (e) => {
      if (e.detail?.message) {
        setFormData((prev) => ({ ...prev, message: e.detail.message }));
      }
    };

    window.addEventListener("prefill-contact", handlePrefill);
    return () => window.removeEventListener("prefill-contact", handlePrefill);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  Swal.fire({
    title: "Enviando Mensaje...",
    html: "Por favor espera mientras enviamos tu mensaje.",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const formSubmitUrl = "https://formsubmit.co/ajax/Lumenvaca178@gmail.com";

    const submitData = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      _subject: "Nuevo Mensaje de tu Website Web",
      _captcha: "false",
      _template: "table",
      _replyto: formData.email,
    };

    const response = await axios.post(formSubmitUrl, submitData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("Respuesta FormSubmit:", response.data);

    Swal.fire({
      title: "¡Éxito!",
      text: "¡Tu mensaje ha sido enviado correctamente!",
      icon: "success",
      confirmButtonColor: "#333333",
      timer: 2000,
      timerProgressBar: true,
    });

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  } catch (error) {
    console.error("Error real:", error?.response?.data || error.message);

    Swal.fire({
      title: "¡Error!",
      text: "Ocurrió un error real al enviar el mensaje.",
      icon: "error",
      confirmButtonColor: "#333333",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="px-[5%] sm:px-[5%] lg:px-[10%] bg-white" >
      <div className="text-center lg:mt-[5%] mt-10 mb-2 sm:px-0 px-[5%]">
        <h2
          data-aos="fade-down"
          data-aos-duration="1000"
          className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-slate-900"
        >
          <span
            >
            {t("contact.title")}
          </span>
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base mt-2"
        >
          {t("contact.subtitle")}
        </p>
      </div>

      <div
        className="h-auto py-10 flex items-center justify-center 2xl:pr-[3.1%] lg:pr-[3.8%]  md:px-0"
        id="Contact"
      >
        <div className="container px-[1%] max-w-3xl mx-auto w-full" >
          <div
            className="bg-white border border-slate-200 rounded-3xl shadow-xl p-5 py-10 sm:p-10 transform transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-4xl font-bold mb-3 text-slate-900">
                  {t("contact.cardTitle")}
                </h2>
                <p className="text-slate-500">
                  {t("contact.cardSubtitle")}
                </p>
              </div>
              <Share2 className="w-10 h-10 text-slate-300" />
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="relative group"
              >
                <User className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder={t("contact.form.name")}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 bg-slate-50 rounded-xl border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all duration-300 hover:border-slate-300 disabled:opacity-50"
                  required
                />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="relative group"
              >
                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder={t("contact.form.email")}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 bg-slate-50 rounded-xl border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all duration-300 hover:border-slate-300 disabled:opacity-50"
                  required
                />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="relative group"
              >
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <textarea
                  name="message"
                  placeholder={t("contact.form.message")}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full resize-none p-4 pl-12 bg-slate-50 rounded-xl border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all duration-300 hover:border-slate-300 h-[9.9rem] disabled:opacity-50"
                  required
                />
              </div>
              <button
                data-aos="fade-up"
                data-aos-delay="400"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-slate-800 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? t("contact.form.sending") : t("contact.form.send")}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-slate-200 flex justify-center space-x-6">
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

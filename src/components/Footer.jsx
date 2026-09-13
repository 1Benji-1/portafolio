const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white">
      <center>
        <hr className="my-3 border-slate-200 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-slate-400 text-center">
          © {currentYear}{" "}
          <a href="https://islumen.vercel.app" className="hover:underline text-slate-600">
            Lumen™
          </a>
          . All Rights Reserved.
        </span>
      </center>
    </footer>
  );
};

export default Footer;

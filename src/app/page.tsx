import { LazyInteractions } from "@/components/LazyEffects";
import MotionProvider from "@/components/MotionProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Credentials from "@/components/sections/Credentials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link rounded-lg bg-accent px-4 py-2 font-display text-sm font-semibold text-accent-contrast">
        Skip to content
      </a>
      <Nav />
      <MotionProvider>
        <main id="main">
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Credentials />
          <Contact />
        </main>
      </MotionProvider>
      <Footer />
      <LazyInteractions />
    </>
  );
}

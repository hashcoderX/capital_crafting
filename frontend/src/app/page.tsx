import Header from "../components/Header";
import Hero from "../components/Hero";
import TrustStats from "../components/TrustStats";
import Services from "../components/Services";
import InvestmentPlans from "../components/InvestmentPlans";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main>
        <Hero />
        <TrustStats />
        <Services />
        <InvestmentPlans />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

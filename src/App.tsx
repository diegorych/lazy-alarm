import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const DesktopPhone = () => {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const resize = () => setScale(Math.min(1, (window.innerHeight - 48) / 868, (window.innerWidth - 64) / 414));
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  const url = new URL(window.location.href);
  url.searchParams.set('phone-preview', '1');
  return (
    <div className="phone-stage">
      <div style={{ width: 414 * scale, height: 868 * scale }}>
        <div className="phone-case" style={{ transform: `scale(${scale})` }}>
          <span className="phone-side-button phone-side-left" />
          <span className="phone-side-button phone-side-right" />
          <iframe className="phone-screen" src={url.toString()} title="Lazy Alarm — iPhone" />
          <div className="phone-island" aria-hidden="true" />
          <div className="phone-home-indicator" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [desktop, setDesktop] = useState(() => window.innerWidth >= 768);
  const embedded = new URLSearchParams(window.location.search).has('phone-preview');
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setDesktop(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  if (desktop && !embedded) return <DesktopPhone />;
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;

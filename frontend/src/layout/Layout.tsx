import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AdModal from "../components/team/AdModal";
import { useEffect, useState, type ReactNode, type FC } from "react";
import { useLocation } from "react-router-dom";
import { adImages } from "../utils/adImages";

interface LayoutProps {
  children: ReactNode;
  userType?: "INDIVIDUAL" | "EMPRESARIAL" | "EQUIPO";
  companyName?: string;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const [showAd, setShowAd] = useState(false);
  const [currentAd, setCurrentAd] = useState(0);
  const [adCount, setAdCount] = useState(0);

  // Mostrar anuncio al entrar si no han pasado 24 horas o menos de 4 veces
  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem("adCount") || "0");
    const savedTimestamp = localStorage.getItem("adTimestamp");
    const now = Date.now();
    const hours24 = 24 * 60 * 60 * 1000;

    if (!savedTimestamp || now - parseInt(savedTimestamp) > hours24) {
      localStorage.setItem("adCount", "1");
      localStorage.setItem("adTimestamp", now.toString());
      sessionStorage.setItem("firstAdShown", "true");
      setAdCount(1);
      setCurrentAd(Math.floor(Math.random() * adImages.length));
      setShowAd(true);
    } else {
      setAdCount(savedCount);
      const hasShown = sessionStorage.getItem("firstAdShown") === "true";
      if (!hasShown && savedCount < 4) {
        sessionStorage.setItem("firstAdShown", "true");
        localStorage.setItem("adCount", (savedCount + 1).toString());
        setAdCount(savedCount + 1);
        setCurrentAd(Math.floor(Math.random() * adImages.length));
        setShowAd(true);
      }
    }
  }, []);

  // Mostrar anuncio cada 15 minutos hasta un máximo de 4
  useEffect(() => {
    const interval = setInterval(() => {
      const currentCount = parseInt(localStorage.getItem("adCount") || "0");
      if (currentCount < 4) {
        const nextIndex = Math.floor(Math.random() * adImages.length);
        setCurrentAd(nextIndex);
        setShowAd(true);
        const newCount = currentCount + 1;
        setAdCount(newCount);
        localStorage.setItem("adCount", newCount.toString());
      }
    }, 15 * 60 * 1000); // cada 15 min

    return () => clearInterval(interval);
  }, []);

  const closeAd = () => setShowAd(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="transition-all duration-300">
        <Sidebar />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6 bg-background">
          {children}
        </main>
      </div>

      {/* Modal de anuncios */}
      {!isLoginPage && adCount <= 4 && showAd && (
        <AdModal
          imageUrl={adImages[currentAd]}
          delayToClose={5}
          open={showAd}
          onClose={closeAd}
        />
      )}
    </div>
  );
};

export default Layout;
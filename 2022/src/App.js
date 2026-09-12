import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Event2 from "./Components/Event2";
import Gallery from "./Components/Gallery2";
import Home from "./Components/Home";
import Sponsor from "./Components/Sponsor/index";
import Team from "./Components/Team/index";
import "./index.css";
import Footer from "./Components/Footer";
import Pronite from "./Components/Pronite";
import { useEffect } from "react";
import { useLocation } from "react-router";
import Loader from "./Components/Gallery2/components/Loader";
import { AuthProvider } from "./Context/AuthContext";
import Privacy from "./Components/Privacy";
import Rules from "./Components/Rules";

const ScrollToTop = (props) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return <>{props.children}</>;
};
function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return <>
    <aside
      className="fixed inset-x-0 top-0 z-[9999] border-b border-amber-300/40 bg-black/95 px-3 py-2 text-center text-xs font-medium tracking-wide text-[#f5e6c8] shadow-lg backdrop-blur"
      role="status"
    >
      You are viewing the read-only Incridea 2022 archive.{" "}
      <a
        className="font-bold text-[#d8ad5d] underline decoration-[#d8ad5d] underline-offset-2 hover:text-white"
        href="https://incridea.in"
      >
        Visit the current Incridea site
      </a>
    </aside>
    {loading ? (
      <Loader animate={true} />
    ) : (
      <AuthProvider>
      <div className="App flex justify-between flex-col min-h-[100vh]">
        <ScrollToTop>
          <Routes>
            <Route exact index path="/" element={<Home />} />
            <Route exact path="/events" element={<Event2 />} />
            <Route exact path="/gallery" element={<Gallery />} />
            <Route exact path="/Sponsors" element={<Sponsor />} />
            <Route exact path="/team" element={<Team />} />
            <Route exact path="/pronite" element={<Pronite />} />
            <Route exact path="/mi" element={<Mi />} />
            <Route exact path="/privacy" element={<Privacy />} />
            <Route exact path="/rules" element={<Rules />} />
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
          <Footer />
        </ScrollToTop>
      </div>
      </AuthProvider>
    )}
  </>;
}

export default App;

function Mi() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate("/mi.html")
    window.location.reload()
  })
  return <></>
}

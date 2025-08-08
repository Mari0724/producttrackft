import React from "react";

interface Props {
  onLogin: () => void;
}

const LeftPanel: React.FC<Props> = ({ onLogin }) => (
  <div className="md:w-2/5 bg-[#35492c] text-white p-8 flex flex-col justify-center items-center rounded-t-3xl md:rounded-l-2xl md:rounded-tr-none">
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-4 text-center">
      Bienvenidos
    </h2>
    <p className="text-center text-base md:text-lg mb-6 leading-snug">
      Para unirte, por favor inicia sesión con tus datos.
    </p>
    <button
      onClick={onLogin}
      className="px-6 md:px-8 py-2 md:py-3 bg-[#7a1d27] text-white rounded-full hover:bg-[#6a1722] transition text-sm md:text-base"
    >
      Iniciar Sesión
    </button>
  </div>
);

export default LeftPanel;
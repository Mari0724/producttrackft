import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LegalSection {
  title: string;
  content: (string | React.ReactNode)[];
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

const LegalPage: React.FC<LegalPageProps> = ({ title, lastUpdated, sections }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-light-gray/20 to-golden/10 font-poppins">
      {/* Header */}
      <div className="bg-olive text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Link 
            to="/register" 
            className="inline-flex items-center text-golden hover:text-white transition-colors duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Volver al inicio
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 animate-fade-in">
              {title}
            </h1>
            <div className="flex items-center space-x-4 text-golden/90">
              <span className="text-lg font-medium">ProductTrack</span>
              <span className="w-1 h-1 bg-golden rounded-full"></span>
              <span className="text-sm">Última actualización: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-light-gray/30 overflow-hidden">
            <div className="p-6 md:p-8 lg:p-12">
              {sections.map((section, index) => (
                <section key={index} className="mb-8 last:mb-0 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <h2 className="text-2xl md:text-3xl font-semibold text-burgundy mb-6 pb-3 border-b-2 border-golden/30">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <div key={pIndex} className="text-gray-700 leading-relaxed text-base md:text-lg">
                        {typeof paragraph === 'string' ? (
                          <p className="mb-4">{paragraph}</p>
                        ) : (
                          paragraph
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-light-gray/30">
              <div className="w-3 h-3 bg-olive rounded-full animate-pulse"></div>
              <span className="text-gray-600 font-medium">ProductTrack © 2025</span>
              <div className="w-3 h-3 bg-golden rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage
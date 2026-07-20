import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnatomyMap } from "@/components/explorer/AnatomyMap";
import { ArrowRight, Database } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();

  const handleMapSelect = (anatomy: string | null) => {
    if (anatomy) {
      navigate({
        to: "/explorer",
        search: { anatomy },
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-mono">
      {/* Heavy Brutalist Header */}
      <header className="border-b-4 border-black bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="font-display text-5xl tracking-wide uppercase">
            QMUL Cancer Research
          </h1>
        </div>
        <div className="hidden md:block text-white opacity-80 text-xs font-mono max-w-[200px] text-right uppercase tracking-widest">
          A digital archive of public ultrasound datasets.
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8 lg:flex lg:gap-12 lg:items-center relative">
        {/* Left Col: Info & Actions */}
        <div className="lg:w-1/2 flex flex-col justify-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display uppercase tracking-tight text-foreground mb-4 leading-none border-b-4 border-black pb-4">
            MEDICAL AI RESEARCH <br/>STARTS HERE.
          </h2>
          <p className="text-sm md:text-base font-bold font-mono text-foreground mb-8 leading-relaxed max-w-lg">
            A highly curated, interactive catalog of public ultrasound imaging datasets. Navigate medical imaging data intuitively without the clutter.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => navigate({ to: "/explorer" })}
              className="group relative inline-flex items-center justify-center border-2 border-black bg-primary px-8 py-4 font-bold text-white transition-all hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_2px_#050505]"
            >
              EXPLORE THE DATASETS
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://github.com/W11TY/echo-data-atlas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border-2 border-black bg-white px-8 py-4 font-bold text-black transition-all hover:bg-black hover:text-white"
            >
              CONTRIBUTE
            </a>
          </div>

          <div className="border-t-4 border-black pt-8">
            <div className="max-w-md">
              <div className="mb-3 inline-flex border-2 border-black bg-primary p-2">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-display text-2xl uppercase tracking-wide text-foreground">Extensive Catalog</h3>
              <p className="mt-1 text-xs font-bold text-foreground/80 leading-relaxed">
                Hundreds of datasets spanning multiple anatomical regions and cancer types.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Anatomy Map */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none lg:static lg:z-10 lg:w-1/2 lg:opacity-100 lg:pointer-events-auto overflow-hidden">
          {/* Medical Registration Marks */}
          <div className="absolute top-0 left-0 text-xl font-mono opacity-50">+</div>
          <div className="absolute top-0 right-0 text-xl font-mono opacity-50">+</div>
          <div className="absolute bottom-0 left-0 text-xl font-mono opacity-50">+</div>
          <div className="absolute bottom-0 right-0 text-xl font-mono opacity-50">+</div>
          
          <div className="w-full lg:bg-white lg:border-2 lg:border-black lg:shadow-[8px_8px_4px_#050505] lg:p-6 relative z-10">
            <div className="hidden lg:block absolute top-0 left-0 bg-black text-white px-3 py-1 text-xs font-bold uppercase">
              ARCHIVE PREVIEW
            </div>
            <div className="mx-auto max-w-md w-full lg:pt-8">
              <AnatomyMap selectedAnatomy={null} onSelect={handleMapSelect} />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t-4 border-black p-6 text-center text-xs font-bold font-mono uppercase tracking-widest text-foreground">
        Curated for research use.
      </footer>
    </div>
  );
}

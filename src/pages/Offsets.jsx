import { ExternalLink, TreesIcon as Tree, Sun, Wind } from 'lucide-react';

const projects = [
  {
    name: 'Miyawaki Forest Restoration — Karnataka',
    category: 'forest',
    tag: 'Forest',
    description: 'Restores native forests using the Miyawaki method, creating dense carbon-absorbing green patches in urban and rural areas.',
    link: 'https://registry.goldstandard.org/creditlots',
    icon: Tree,
    color: '#6B8F5E',
  },
  {
    name: 'Solar Microgrids — Uttar Pradesh',
    category: 'solar',
    tag: 'Solar',
    description: 'Distributed solar microgrids replacing diesel generators in off-grid villages, reducing 3,200 tCO₂e annually.',
    link: 'https://registry.verra.org/app/projectSearch',
    icon: Sun,
    color: '#C4956A',
  },
  {
    name: 'Methane Capture — Punjab Dairy',
    category: 'methane',
    tag: 'Methane',
    description: 'Anaerobic digesters on dairy farms convert manure into biogas, preventing methane release and generating clean energy.',
    link: 'https://registry.goldstandard.org/creditlots',
    icon: Wind,
    color: '#8B6F47',
  },
  {
    name: 'Afforestation — Western Ghats',
    category: 'forest',
    tag: 'Forest',
    description: 'Large-scale native tree planting across degraded lands in the Western Ghats biodiversity hotspot.',
    link: 'https://registry.verra.org/app/projectSearch',
    icon: Tree,
    color: '#4A7C59',
  },
];

export default function Offsets() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-stone-800">Offset Marketplace</h1>
        <p className="text-sm text-stone-500 mt-0.5">Support verified carbon offset projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, i) => {
          const Icon = project.icon;
          return (
            <div
              key={i}
              className="bg-[#FDFAF4] rounded-xl p-5 shadow-sm border border-stone-200 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: project.color + '20' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: project.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-800">{project.name}</h3>
                    <span
                      className="inline-block mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: project.color + '15', color: project.color }}
                    >
                      {project.tag}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">{project.description}</p>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 mt-auto px-3 py-2 rounded-lg bg-[#F5F0E8] text-xs font-medium text-stone-600 hover:bg-[#E4DCD0] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View on Registry
              </a>
            </div>
          );
        })}
      </div>

      <div className="bg-[#FDFAF4] rounded-xl p-5 shadow-sm border border-stone-200">
        <h3 className="text-sm font-semibold text-stone-700 mb-2">About Offsets</h3>
        <p className="text-xs text-stone-500 leading-relaxed">
          All projects listed are certified under Gold Standard or Verra (VCS) — the leading carbon credit standards.
          Each credit represents 1 tonne of CO₂e reduced or removed. Offsets should complement, not replace,
          direct emissions reductions.
        </p>
      </div>
    </div>
  );
}
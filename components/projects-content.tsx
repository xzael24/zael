"use client"

export default function ProjectsContent() {
  return (
    <main className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-6xl px-4">
      <div className="text-center">

        <h1 className="text-4xl md:text-5xl tracking-tight font-light text-white mb-6">
          Featured <span className="font-medium italic instrument">Projects</span>
        </h1>

        <p className="text-xs font-light text-white/70 mb-4 leading-relaxed max-w-sm mx-auto">
        A selection of projects I’ve worked on—each one a mix of code, design, and problem-solving. These are the ones I’m most proud to share.
        </p>

        {/* Card container: scroll horizontal di mobile & tablet, center di desktop */}
        <div
          data-swipe-exempt="true"
          className="flex gap-3 md:gap-4 overflow-x-auto lg:overflow-visible whitespace-nowrap lg:whitespace-normal -mx-4 px-4 lg:mx-0 lg:px-0 justify-start lg:justify-center snap-x snap-mandatory"
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="shrink-0 snap-start w-44 sm:w-56 md:w-64 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <div className="text-white text-sm font-medium mb-1">
                Project {i}
              </div>
              <div className="text-white/60 text-xs leading-relaxed">
                Deskripsi singkat proyek {i}.
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

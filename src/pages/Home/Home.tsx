import { Link } from 'react-router-dom'
import { LockKeyhole } from 'lucide-react'

function Home() {
  return (
    <section className="relative min-h-[calc(100vh-5rem)]">
      <div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-20 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-[#B88A44]">
            Belleza · Elegancia · Confianza
          </p>

          <h1 className="font-serif text-5xl leading-tight text-[#590E1A] sm:text-6xl lg:text-7xl">
            Tu belleza,
            <br />
            tu expresión.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#590E1A]/70 sm:text-lg">
            Descubre una colección seleccionada de productos de belleza
            pensados para ayudarte a expresar tu belleza única.
          </p>

          <Link
            to="/catalogo"
            className="mt-8 inline-flex rounded-full bg-[#590E1A] px-7 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            Explorar la colección
          </Link>
        </div>
      </div>

      <Link
        to="/admin"
        aria-label="Administración"
        title="Administración"
        className="absolute bottom-5 right-5 rounded-full p-2 text-[#590E1A]/90 transition hover:text-[#590E1A]/90"
      >
        <LockKeyhole size={14} strokeWidth={1.5} />
      </Link>
    </section>
  )
}

export default Home
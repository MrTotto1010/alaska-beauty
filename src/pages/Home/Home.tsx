import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
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
    </section>
  )
}

export default Home
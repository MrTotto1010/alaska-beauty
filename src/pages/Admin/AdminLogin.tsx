import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { login } from '../../services/auth.service'

function AdminLogin() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const data = await login({
        username,
        password,
      })

      if (data.token) {
        localStorage.setItem('alaska_admin_token', data.token)
      }

      navigate('/admin/panel')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo iniciar sesión.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FDF8F8] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#590E1A]/60 transition hover:text-[#590E1A]"
          >
            <ArrowLeft size={17} />
            Volver a la tienda
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-4xl text-[#590E1A]">
              Alaska Beauty
            </h1>

            <p className="mt-2 text-sm text-[#590E1A]/60">
              Panel administrativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-[#590E1A]"
              >
                Usuario
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Ingresá tu usuario"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-[#E6B7BB] px-4 py-3 text-sm outline-none transition focus:border-[#590E1A] focus:ring-2 focus:ring-[#E6B7BB]/40"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#590E1A]"
              >
                Contraseña
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresá tu contraseña"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-[#E6B7BB] px-4 py-3 text-sm outline-none transition focus:border-[#590E1A] focus:ring-2 focus:ring-[#E6B7BB]/40"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#590E1A] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#741827] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default AdminLogin
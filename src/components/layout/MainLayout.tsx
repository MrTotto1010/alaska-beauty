import { Outlet } from 'react-router-dom'
import Header from './Header'

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#FFF9F9]">
      <Header />

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
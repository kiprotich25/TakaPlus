import { Outlet, createRootRoute } from '@tanstack/react-router'
import Footer from '../components/footer'
import { AuthProvider } from '../utils/auth'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-base-100">
        <main className="container mx-auto px-4 py-6">
          <Outlet />
        </main>
        <Footer/>
        
      </div>
    </AuthProvider>
  )
}

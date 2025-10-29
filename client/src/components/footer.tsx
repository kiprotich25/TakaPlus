
// client/src/components/footer.tsx
import { Link } from "@tanstack/react-router"

function Footer() {
  return (
    <footer className="footer footer-center p-6 bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 text-green-800 border-t border-green-200">
      <aside>
        <p className="font-medium">
          <Link to="/" className="link link-hover text-emerald-700 hover:text-green-600">
            &copy; {new Date().getFullYear()} TakaPlus — Greener Cities, Cleaner Earth 🌍
          </Link>
        </p>
      </aside>
    </footer>
  )
}

export default Footer


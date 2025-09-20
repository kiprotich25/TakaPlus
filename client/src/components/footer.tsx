import { Link } from "@tanstack/react-router"

function Footer() {
  return (
    <footer className="footer footer-center p-4 text-base-content">
          <aside>
            <p>
              <Link to="/" className="link link-hover">TakaPlus</Link> · Built with Tailwind & DaisyUI
            </p>
          </aside>
        </footer>
  )
}

export default Footer;
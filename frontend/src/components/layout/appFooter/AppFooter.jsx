import { Link } from "react-router-dom"
export const AppFooter = () => {
    return (
        <footer className=' container position-relative z-1 border-top py-4 d-none d-lg-block '>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-muted small">
                <p className="mb-0">© {new Date().getFullYear()} Macro Tracker</p>
                <nav className="d-flex gap-4">
                    <Link to="#" className="text-muted text-decoration-none hover-dark">About</Link>
                    <Link to="#" className="text-muted text-decoration-none hover-dark">Privacy</Link>
                    <Link to="#" className="text-muted text-decoration-none hover-dark">Terms</Link>
                </nav>
            </div>
        </footer>
    )
}

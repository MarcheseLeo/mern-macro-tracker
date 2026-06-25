import { ArrowRight, Flame, Droplets, Activity, Check } from 'lucide-react'
import { Link } from 'react-router-dom';
import './Welcome.css'
import Button from '../../components/ui/button/Button';

const floaties = [
    { emoji: '🥑', top: '18%', left: '6%', rotate: '-8deg', delay: '0s' },
    { emoji: '🍓', top: '12%', right: '8%', rotate: '10deg', delay: '0.6s' },
    { emoji: '🥗', bottom: '14%', left: '12%', rotate: '6deg', delay: '1.1s' },
    { emoji: '🍳', bottom: '18%', right: '10%', rotate: '-10deg', delay: '1.6s' },
    { emoji: '🍎', top: '6%', left: '44%', rotate: '4deg', delay: '0.3s' },
]

const features = [
    {
        icon: Flame,
        title: 'Smart calorie tracking',
        body: 'See eaten vs remaining calories at a glance with a beautiful progress ring.',
        bg: 'var(--fat-soft)',
        color: 'var(--fat-foreground)',
    },
    {
        icon: Activity,
        title: 'Macro breakdown',
        body: 'Carbs, protein and fats tracked with playful, color-coded targets.',
        bg: 'var(--protein-soft)',
        color: 'var(--protein-foreground)',
    },
    {
        icon: Droplets,
        title: 'Water & weight',
        body: 'Log water in a tap and watch your weight trend smooth out over time.',
        bg: 'var(--water-soft)',
        color: 'var(--water-foreground)',
    },
]


export const Welcome = () => {
    return (
        <main className='welcome-main position-relative min-vh-100 overflow-hidden'>

            {/* Blurred backgrounds */}
            <div className='bg-blob blob-left'></div>
            <div className='bg-blob blob-right'></div>

            {/* HEADER */}
            <header className='container position-relative z-1 d-flex justify-content-between align-items-center py-4'>
                <div className='d-flex align-items-center gap-2'>
                    <span className='logo-icon rounded-5 d-flex justify-content-center align-items-center rounded-4 shadow-soft-sm text-white'>
                        <Flame size={20} />
                    </span>
                    <span className='fs-5 fw-bold tracking-tight'>Macro</span>
                </div>
                <Button asChild variant='ghost' size='sm' className='rounded-5 fw-medium'>
                    <Link to="/login">
                        Login
                    </Link>
                </Button>
            </header>

            {/* HERO SECTION */}
            <section className='container position-relative z-1 text-center pb-5 pt-4 pt-sm-5'>

                {/* Floating emojis  */}
                <div className='d-none d-sm-block position-absolute top-0 start-0 w-100 h-100 pointer-events-none'>
                    {floaties.map((f, index) => (
                        <span
                            key={index}
                            className='position-absolute fs-1 floating-emoji'
                            style={{
                                top: f.top, bottom: f.bottom, left: f.left, right: f.right,
                                transform: `rotate (${f.rotate})`,
                                animationDelay: f.delay
                            }}
                        >
                            {f.emoji}
                        </span>
                    ))}
                </div>

                {/* Top badge */}
                <span className='badge bg-white text-muted rounded-pill shadow-soft-sm px-3 py-2 mb-4 mt-5 fs-6 fw-normal d-inline-flex align-items-center gap-2'>
                    <span className="dot-protein rounded-circle"></span>
                    Your daily nutrition, simplified
                </span>
                {/* Main title */}
                <h1 className='display-3 fw-bolder tracking-tight mb-4 text-dark'>
                    Track your <span className='text-primary-custom'>diet journey</span> with joy
                </h1>

                <p className='lead text-muted mx-auto mb-5 fw-semibold' style={{ maxWidth: '600px' }}>
                    Log meals in seconds, keep your macros balanced, and build healthy
                    habits with a tracker that actually feels good to use.
                </p>

                {/* Call to Action Buttons */}
                <div className=' d-flex flex-column flex-sm-row justify-content-center gap-3 mb-4'>
                    <Button asChild size='lg' className='px-4' style={{ height: '48px' }}>
                        <Link to={"/register"}>
                            Get started <ArrowRight size={20} className='ms-2' />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* GRID FEATURES */}
            <section className='container position-position-relative z-1 pb-5 mb-5'>
                <div className='row g-4 justify-content-center mx-auto'>
                    {features.map((f, index) => (
                        <div key={index} className='col-12 col-md-4 col-lg-3'>
                            <article className='card border-0 radius-3xl shadow-soft-sm p-4 h-100 feature-card'>
                                <span
                                    className="d-flex justify-content-center align-items-center rounded-circle mb-3"
                                    style={{ width: '50px', height: '50px', backgroundColor: f.bg, color: f.color }}
                                >
                                    <f.icon size={24} />
                                </span>
                                <h3 className='h5 fw-bold  mb-2'>{f.title}</h3>
                                <p className='text-muted fw-semibold small mb-0'>{f.body}</p>
                            </article>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer className=' container position-relative z-1 border-top py-4'>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-muted small">
                    <p className="mb-0">© {new Date().getFullYear()} Macro Tracker</p>
                    <nav className="d-flex gap-4">
                        <Link to="#" className="text-muted text-decoration-none hover-dark">About</Link>
                        <Link to="#" className="text-muted text-decoration-none hover-dark">Privacy</Link>
                        <Link to="#" className="text-muted text-decoration-none hover-dark">Terms</Link>
                    </nav>
                </div>
            </footer>
        </main>
    )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Search, Shield, Users, Utensils, Inbox } from 'lucide-react'
import { getAdminFeedback, getAdminFoods, getAdminUsers, updateAdminFeedback, updateAdminFood, updateAdminUser } from '../../services/AdminService'

export const Admin = () => {
    const [tab, setTab] = useState('users')
    const [users, setUsers] = useState([])
    const [foods, setFoods] = useState([])
    const [feedback, setFeedback] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [query, setQuery] = useState('')

    const load = async () => {
        setLoading(true); setError('')
        try {
            const [nextUsers, nextFoods, nextFeedback] = await Promise.all([getAdminUsers(), getAdminFoods(), getAdminFeedback()])
            setUsers(nextUsers); setFoods(nextFoods); setFeedback(nextFeedback)
        } catch (e) { setError(e.response?.data?.message || 'Unable to load administration data.') }
        finally { setLoading(false) }
    }
    useEffect(() => { load() }, [])
    const changeUser = async (id, body) => setUsers((list) => list.map((user) => user._id === id ? { ...user, ...body } : user)) || await updateAdminUser(id, body)
    const changeFood = async (id, isActive) => { await updateAdminFood(id, { isActive }); setFoods((list) => list.map((food) => food._id === id ? { ...food, isActive } : food)) }
    const resolveFeedback = async (id, status) => { const item = await updateAdminFeedback(id, { status }); setFeedback((list) => list.map((entry) => entry._id === id ? item : entry)) }
    const openRequests = feedback.filter((item) => item.status !== 'resolved').length
    const tabs = [{ key: 'users', label: 'Users', icon: Users }, { key: 'foods', label: 'Foods', icon: Utensils }, { key: 'feedback', label: 'Requests', icon: Inbox }]

    return <div className="container py-4" style={{ maxWidth: '960px' }}>
        <header className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4"><div><p className="text-primary-custom small fw-bold mb-1">ADMINISTRATION</p><h1 className="h3 font-heading text-dark mb-0">Management area</h1></div><Link to="/home" className="btn btn-secondary-custom rounded-pill"><ArrowLeft size={16} className="me-1" />User area</Link></header>
        <nav className="d-flex gap-2 overflow-auto pb-2 mb-3">{tabs.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => setTab(key)} className={`btn rounded-pill text-nowrap position-relative ${tab === key ? 'btn-primary-custom' : 'btn-light'}`}><Icon size={16} className="me-1" />{label}{key === 'feedback' && openRequests > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{openRequests}</span>}</button>)}</nav>
        <div className="input-group mb-3"><span className="input-group-text bg-transparent border-end-0"><Search size={17} /></span><input value={query} onChange={(e) => setQuery(e.target.value)} className="form-control border-start-0" placeholder="Search users, foods or requests" /></div>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? <div className="app-card p-4 text-muted">Loading administration data…</div> : <section className="app-card p-3 p-md-4 overflow-auto">
            {tab === 'users' && <table className="table align-middle mb-0"><thead><tr><th>User</th><th>Role</th><th>Verified</th></tr></thead><tbody>{users.map((user) => <tr key={user._id}><td><div className="fw-semibold text-dark">{user.firstName} {user.lastName}</div><small className="text-muted">{user.email}</small></td><td><button onClick={() => changeUser(user._id, { role: user.role === 'admin' ? 'user' : 'admin' })} className="btn btn-sm btn-secondary-custom rounded-pill"><Shield size={14} className="me-1" />{user.role}</button></td><td><button onClick={() => changeUser(user._id, { isVerified: !user.isVerified })} className={`btn btn-sm rounded-pill ${user.isVerified ? 'btn-success' : 'btn-outline-custom'}`}>{user.isVerified && <Check size={14} className="me-1" />}{user.isVerified ? 'Verified' : 'Pending'}</button></td></tr>)}</tbody></table>}
            {tab === 'foods' && <div className="d-grid gap-2">{foods.map((food) => <div key={food._id} className="surface-soft p-3 radius-md d-flex justify-content-between align-items-center gap-3"><div><div className="fw-semibold text-dark">{food.name}</div><small className="text-muted-foreground">{food.brand} · {food.category}</small></div><button onClick={() => changeFood(food._id, !food.isActive)} className={`btn btn-sm rounded-pill ${food.isActive ? 'btn-outline-custom' : 'btn-primary-custom'}`}>{food.isActive ? 'Disable' : 'Enable'}</button></div>)}</div>}
            {tab === 'feedback' && <div className="d-grid gap-3">{feedback.map((item) => <article key={item._id} className="surface-soft p-3 radius-md"><div className="d-flex justify-content-between gap-2"><div><span className="badge text-bg-primary rounded-pill me-2">{item.type === 'category_suggestion' ? 'Category' : 'Problem'}</span><strong className="text-dark">{item.title}</strong></div><span className="small text-muted">{item.status}</span></div><p className="small mb-2 mt-2 text-secondary-foreground">{item.message}</p><small className="text-muted d-block mb-2">From {item.user?.firstName} {item.user?.lastName} · {item.user?.email}</small><button onClick={() => resolveFeedback(item._id, item.status === 'resolved' ? 'in_review' : 'resolved')} className="btn btn-sm btn-primary-custom rounded-pill">{item.status === 'resolved' ? 'Reopen' : 'Mark resolved'}</button></article>)}</div>}
        </section>}
    </div>
}

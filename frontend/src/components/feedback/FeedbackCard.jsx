import { useState } from 'react'
import { Bug, ChevronRight, Lightbulb, Send } from 'lucide-react'
import { createFeedback } from '../../services/FeedbackService'
import './FeedbackCard.css'

export const FeedbackCard = ({ type }) => {
    const isCategory = type === 'category_suggestion'
    const Icon = isCategory ? Lightbulb : Bug
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState(null)
    const [isSending, setIsSending] = useState(false)
    const [isOpen, setIsOpen] = useState(isCategory)

    const submit = async (event) => {
        event.preventDefault()
        setIsSending(true)
        setStatus(null)
        try {
            await createFeedback({ type, title, message })
            setTitle('')
            setMessage('')
            setStatus({ type: 'success', text: 'Thanks — your request was sent to the team.' })
        } catch (error) {
            setStatus({ type: 'danger', text: error.response?.data?.message || 'Unable to send your request.' })
        } finally { setIsSending(false) }
    }

    return (
        <section className={`app-card feedback-card p-3 p-md-4 ${isOpen ? 'feedback-card-open' : ''}`}>
            <button type="button" className="feedback-trigger w-100" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen}>
            <div className="d-flex gap-3 align-items-center text-start w-100">
                <span className="feedback-icon"><Icon size={20} /></span>
                <div>
                    <h2 className="h6 font-heading fw-bold text-dark mb-1">{isCategory ? 'Suggest a food category' : 'Report a problem'}</h2>
                    <p className="small text-muted-foreground mb-0">{isCategory ? 'Tell us which category would make logging food easier.' : 'Describe the issue and the admin team will review it.'}</p>
                </div>
                <ChevronRight className="feedback-chevron" size={20} />
            </div>
            </button>
            {isOpen && <form onSubmit={submit} className="d-grid gap-2 feedback-form">
                <input className="form-control soft-control" required maxLength="100" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={isCategory ? 'Category name, e.g. legumes' : 'Short summary'} />
                <textarea className="form-control soft-control feedback-message" required maxLength="2000" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={isCategory ? 'Why would this category be useful?' : 'What happened and how can we reproduce it?'} />
                <div className="d-flex justify-content-between align-items-center gap-2">
                    {status ? <span className={`small text-${status.type}`}>{status.text}</span> : <span />}
                    <button className="btn btn-primary-custom rounded-pill px-3" disabled={isSending}><Send size={15} className="me-1" />{isSending ? 'Sending…' : 'Send'}</button>
                </div>
            </form>
            }
        </section>
    )
}

import React, { useState, useEffect } from 'react'
import { Search, Loader2, Plus, Check, CalendarX } from 'lucide-react'
import { CATEGORY_EMOJIS } from '../../../lib/costants'
import { InfoModal } from '../../infoModal/Infomodal'
import { DashboardContext } from '../../../context/DashboardContext'
import { useContext } from 'react'
import { getFoods } from '../../../services/FoodService'

import './styles.css'
const CATEGORIES = ['All', 'fruit', 'vegetable', 'meat', 'dairy', 'cereal', 'snack', 'beverage', 'other']

export const SearchFoodView = ({ onFoodSelect, onQuickAdd }) => {
    const [query, setQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')

    const [foods, setFoods] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 7

    const [addedFoodId, setAddedFoodId] = useState(null)

    const { selectedDate } = useContext(DashboardContext)
    const [showFutureModal, setShowFutureModal] = useState(false)


    const fetchFoods = async (pageNumber, isnewSearch = false) => {
        setIsLoading(true)
        setError(null)

        try {
            const token = localStorage.getItem('token')
            let url = `/foods?page=${pageNumber}&limit=${limit}`

            if (query) url += `&name=${query}`
            if (selectedCategory !== 'All') url += `&category=${selectedCategory}`



            const data = await getFoods(url)

            if (isnewSearch) {
                setFoods(data.foods)
            } else {
                setFoods(prev => [...prev, ...data.foods])
            }

            setTotalPages(data.totalPages)
        } catch (e) {
            console.error(e);
            setError("Could not load foods. Try again.")
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setCurrentPage(1)
            fetchFoods(1, true)
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [query, selectedCategory])

    const handleLoadMore = () => {
        const nextPage = currentPage + 1
        setCurrentPage(nextPage)
        fetchFoods(nextPage, false)
    }

    const handleQuickAdd = async (e, f) => {
        e.stopPropagation()

        const today = new Date().toISOString().split('T')[0]

        if (selectedDate > today) {
            setShowFutureModal(true)
            return
        }

        onQuickAdd(f)
        setAddedFoodId(f._id)

        setTimeout(() => {
            setAddedFoodId(null);
        }, 1500)
    }

    return (
        <div className="d-flex flex-column h-100">

            {/* SEARCH BAR */}
            <div className="d-flex align-items-center gap-2 px-3 py-2 border rounded-4 mb-3">
                <Search size={20} className="text-muted" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search healthy food..."
                    className="form-control border-0 bg-transparent shadow-none px-1"
                    autoFocus
                />
            </div>

            {/* CATEGORY PILLS*/}
            <div className="d-flex gap-2 overflow-x-auto pb-4 no-scrollbar flex-md-wrap">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`btn rounded-pill px-3 py-2 border text-nowrap ${selectedCategory === cat ? 'btn-chart-3' : 'btn-light'} cat-pills`}
                    >
                        {cat !== 'All' && <span className="me-1">{CATEGORY_EMOJIS[cat]}</span>}
                        <span className="text-capitalize">{cat}</span>
                    </button>
                ))}
            </div>

            {/* RESULT LIST */}
            <div className="flex-grow-1 overflow-y-auto">
                {error && <p className="text-danger text-center small">{error}</p>}

                {foods.length === 0 && !isLoading && !error ? (
                    <div className="text-center text-muted mt-5">
                        <p>No food found {query ? `for ${query}` : ''}.</p>
                    </div>
                ) : (
                    <ul className="list-unstyled d-flex flex-column gap-2 mb-0 ">
                        {foods.map(f => {
                            const calculatedKcal = Math.round((f.nutritionalValues.kcal / 100) * f.servingSize);

                            return (
                                <li key={f._id}>
                                    <div
                                        className="d-flex align-items-center gap-3 p-2 bg-light rounded-4 cursor-pointer"
                                        onClick={() => onFoodSelect(f)}
                                    >
                                        <span className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                                            {CATEGORY_EMOJIS[f.category] || '🍽️'}
                                        </span>

                                        <div className="flex-grow-1">
                                            <span className="d-block fw-bold text-dark">{f.name}</span>
                                            <span className="d-block small text-muted">
                                                {f.servingSize}{f.servingUnit} · {f.brand}
                                            </span>
                                        </div>

                                        <div className="text-end">
                                            <span className="d-block font-heading fw-bold text-primary">{calculatedKcal}</span>
                                            <span className="small text-muted">kcal</span>
                                        </div>

                                        {/* QUICK ADD BUTTON*/}
                                        <button
                                            disabled={addedFoodId === f._id}
                                            className={`btn btn-sm ms-2 rounded-circle d-flex justify-content-center align-items-center p-1 transition-colors text-white ${addedFoodId === f._id ? 'btn-success' : 'btn-primary'} `}
                                            onClick={(e) => handleQuickAdd(e, f)}
                                        >
                                            {addedFoodId === f._id ? <Check size={20} /> : <Plus size={24} />}
                                        </button>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}

                {/* ADD MORE BUTTON */}
                {isLoading && (
                    <div className="d-flex justify-content-center my-3">
                        <Loader2 className="animate-spin text-primary" size={24} />
                    </div>
                )}

                {!isLoading && currentPage < totalPages && (
                    <button
                        onClick={handleLoadMore}
                        className="btn btn-light w-100 mt-3 rounded-4 fw-bold text-primary"
                    >
                        Load more results...
                    </button>
                )}
            </div>

            {/* MODAL */}
            <InfoModal
                show={showFutureModal}
                onHide={() => setShowFutureModal(false)}
                title="Future Date"
                description="You cannot log food for a future date. Please select today or a past date."
                icon={CalendarX}
            />
        </div>
    )
}
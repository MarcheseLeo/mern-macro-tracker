import { useContext, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Activity,
    BadgeCheck,
    Camera,
    ChevronRight,
    Flame,
    Image,
    Info,
    KeyRound,
    LogOut,
    Mail,
    Ruler,
    Save,
    Scale,
    Shield,
    UserRound,
    UserX,
    Utensils,
} from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { changePassword, deleteMe, editMe, uploadAvatar } from '../../services/UserService'
import './Profile.css'
import { InfoModal } from '../../components/infoModal/Infomodal'
import { useAutoAnimate } from '@formkit/auto-animate/react'

const avatarPresets = [
    'https://api.dicebear.com/9.x/thumbs/svg?seed=MacroMuse',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Protein',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Carbs',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Balance',
]


const initialPasswordForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
}

export const Profile = () => {
    const { user, logout, refreshUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const feedbackTimeoutRef = useRef(null)

    const [profileDraft, setProfileDraft] = useState({})
    const [passwordForm, setPasswordForm] = useState(initialPasswordForm)
    const [isSavingProfile, setIsSavingProfile] = useState(false)
    const [isSavingPassword, setIsSavingPassword] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [feedback, setFeedback] = useState(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [openSection, setOpenSection] = useState(null)
    const [parentRef] = useAutoAnimate()

    const onToggle = (section) => {
        setOpenSection(openSection === section ? null : section)
    }

    const latestWeight = useMemo(() => {
        if (!user?.weightHistory?.length) return ''

        const sortedHistory = [...user.weightHistory].sort((a, b) => {
            return new Date(b.date) - new Date(a.date)
        })

        return sortedHistory[0]?.weight || ''
    }, [user])

    const baseProfileForm = useMemo(() => ({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        dob: user?.dob ? user.dob.slice(0, 10) : '',
        gender: user?.gender || 'not specified',
        height: user?.height || '',
        weight: latestWeight || '',
        goalWeight: user?.goalWeight || '',
        dailyKcalGoal: user?.dailyKcalGoal || '',
        carbs: user?.macroGoals?.carbs || '',
        proteins: user?.macroGoals?.proteins || '',
        fats: user?.macroGoals?.fats || '',
    }), [user, latestWeight])

    const profileForm = { ...baseProfileForm, ...profileDraft }

    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Macro user'

    const getInitials = () => {
        if (!user) return 'U'
        return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U'
    }

    const clearFeedback = () => {
        if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current)
            feedbackTimeoutRef.current = null
        }

        setFeedback(null)
    }

    const showFeedback = (type, message) => {
        if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current)
        }

        setFeedback({ type, message })
        feedbackTimeoutRef.current = setTimeout(() => {
            setFeedback(null)
            feedbackTimeoutRef.current = null
        }, 3500)
    }

    const parseOptionalNumber = (value) => {
        if (value === '' || value === null || value === undefined) return undefined
        return Number(value)
    }

    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setProfileDraft((current) => ({ ...current, [name]: value }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordForm((current) => ({ ...current, [name]: value }))
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setIsSavingProfile(true)
        clearFeedback()

        const body = {
            firstName: profileForm.firstName,
            lastName: profileForm.lastName,
            email: profileForm.email,
            dob: profileForm.dob || undefined,
            gender: profileForm.gender,
            height: parseOptionalNumber(profileForm.height),
            weight: parseOptionalNumber(profileForm.weight),
            goalWeight: parseOptionalNumber(profileForm.goalWeight),
            dailyKcalGoal: parseOptionalNumber(profileForm.dailyKcalGoal),
            macroGoals: {
                carbs: parseOptionalNumber(profileForm.carbs),
                proteins: parseOptionalNumber(profileForm.proteins),
                fats: parseOptionalNumber(profileForm.fats),
            },
        }

        try {
            await editMe(body)
            await refreshUser()
            setProfileDraft({})
            showFeedback('success', 'Profile updated successfully.')
        } catch (e) {
            showFeedback('danger', e.response?.data?.message || 'Unable to update your profile.')
        } finally {
            setIsSavingProfile(false)
        }
    }

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploadingAvatar(true)
        clearFeedback()

        try {
            await uploadAvatar(file)
            await refreshUser()
            showFeedback('success', 'Profile image updated.')
        } catch (e) {
            showFeedback('danger', e.response?.data?.message || 'Unable to upload this image.')
        } finally {
            setIsUploadingAvatar(false)
            e.target.value = ''
        }
    }

    const handlePresetAvatar = async (avatar) => {
        setIsUploadingAvatar(true)
        clearFeedback()

        try {
            await editMe({ avatar })
            await refreshUser()
            showFeedback('success', 'Avatar changed.')
        } catch (e) {
            showFeedback('danger', e.response?.data?.message || 'Unable to change avatar.')
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        clearFeedback()

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showFeedback('danger', 'The new passwords do not match.')
            return
        }

        setIsSavingPassword(true)

        try {
            await changePassword(passwordForm.oldPassword, passwordForm.newPassword)
            setPasswordForm(initialPasswordForm)
            showFeedback('success', 'Password updated successfully.')
        } catch (e) {
            showFeedback('danger', e.response?.data?.message || 'Unable to update your password.')
        } finally {
            setIsSavingPassword(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleDeleteAccount = async () => {
        try {
            await deleteMe()
            await logout()
        } catch (e) {
            showFeedback('danger', 'Unable to delete account. Please try again.')
        }
    }

    const goalCards = [
        {
            icon: Flame,
            label: 'Daily Calories',
            value: user?.dailyKcalGoal || 2000,
            unit: 'kcal',
            color: 'text-fat',
        },
        {
            icon: Utensils,
            label: 'Macros (C/P/F)',
            value: `${user?.macroGoals?.carbs || 250}/${user?.macroGoals?.proteins || 120}/${user?.macroGoals?.fats || 65}`,
            unit: 'g',
            color: 'text-primary-custom',
        },
        {
            icon: Scale,
            label: 'Current Weight',
            value: latestWeight || 'Set',
            unit: latestWeight ? 'kg' : '',
            color: 'text-carbs',
        },
        {
            icon: BadgeCheck,
            label: 'Weight Target',
            value: user?.goalWeight || 'Set',
            unit: user?.goalWeight ? 'kg' : '',
            color: 'text-protein',
        },
        {
            icon: Ruler,
            label: 'Height',
            value: user?.height || 'Set',
            unit: user?.height ? 'cm' : '',
            color: 'text-info',
        },
        {
            icon: Activity,
            label: 'Current Streak',
            value: user?.currentStreak || 0,
            unit: 'days',
            color: 'text-danger',
        },
    ]

    return (
        <div className="profile-page container py-3 pb-5">
            {/* HEADER */}
            <header className="profile-topbar d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2">
                    <div className="profile-brand-mark d-flex align-items-center justify-content-center">
                        <Utensils size={18} />
                    </div>
                    <h1 className="font-heading fs-5 fw-bold mb-0">Macro</h1>
                </div>

                {/* AVATAR */}
                <button
                    type="button"
                    className="profile-mini-avatar border-0 p-0"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Change profile image"
                >
                    {user?.avatar ? <img src={user.avatar} alt={fullName} /> : <span>{getInitials()}</span>}
                </button>
            </header>

            {/* ALERT */}
            {feedback && (
                <div className={`alert alert-${feedback.type} profile-feedback-toast shadow-soft-lg small`} role="alert">
                    {feedback.message}
                </div>
            )}

            {/* GENERAL INFO */}
            <section className="profile-hero text-center mb-4">
                {/* AVATAR */}
                <div className="profile-avatar-wrap mx-auto mb-3">
                    <div className="profile-avatar d-flex align-items-center justify-content-center">
                        {user?.avatar ? <img src={user.avatar} alt={fullName} /> : <span>{getInitials()}</span>}
                    </div>
                    <button
                        type="button"
                        className="btn profile-avatar-action d-flex align-items-center justify-content-center"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        aria-label="Upload profile image"
                    >
                        <Camera size={16} />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={handleAvatarUpload}
                    />
                </div>

                <h2 className="font-heading fs-4 fw-bold mb-1">{fullName}</h2>
                <p className="text-muted-foreground small mb-0">
                    {user?.age ? `${user.age} years old - ` : ''}{user?.email}
                </p>
            </section>

            {/* GOALS & TARGETS */}
            <section className="mb-4">
                <h3 className="profile-section-title">Goals & Targets</h3>
                <div className="row g-3">
                    {goalCards.map((card) => (
                        <div className="col-6" key={card.label}>
                            <article className="profile-stat-card d-flex flex-column justify-content-center py-0">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <card.icon size={15} className={card.color} />
                                    <span>{card.label}</span>
                                </div>
                                <p className="font-heading fw-bold mb-0">
                                    {card.value} <small>{card.unit}</small>
                                </p>
                            </article>
                        </div>
                    ))}
                </div>
            </section>

            <h3 className="profile-section-title mt-3">Account</h3>

            {/* PERSOANL INFO FORM */}
            <section className="profile-card mb-4" onClick={(e) => onToggle('info')} ref={parentRef}>
                <div className="d-flex align-items-center justify-content-between gap-3 cursor-pointer">
                    <div>
                        <h3 className="profile-section-title mb-1">Personal Info</h3>
                        <p className="small text-muted-foreground mb-0">Read and edit your account details.</p>
                    </div>
                    <div className='d-flex gap-2 align-items-center'>
                        <UserRound size={20} className="text-primary-custom" />
                        <ChevronRight
                            className="text-muted transition-transform flex-shrink-0"
                            style={{ transform: openSection === 'info' ? 'rotate(90deg)' : 'rotate(0deg)' }}
                        />
                    </div>
                </div>

                {openSection === 'info' && (
                    <form onSubmit={handleProfileSubmit} onClick={(e) => e.stopPropagation()}>
                        <div className="row g-3 mt-3">
                            <div className="col-12 col-md-6">
                                <label className="form-label small fw-semibold">First name</label>
                                <input className="form-control profile-input" name="firstName" value={profileForm.firstName} onChange={handleProfileChange} />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label small fw-semibold">Last name</label>
                                <input className="form-control profile-input" name="lastName" value={profileForm.lastName} onChange={handleProfileChange} />
                            </div>
                            <div className="col-12">
                                <label className="form-label small fw-semibold">Email</label>
                                <div className="input-group">
                                    <span className="input-group-text profile-input-icon"><Mail size={16} /></span>
                                    <input type="email" className="form-control profile-input" name="email" value={profileForm.email} onChange={handleProfileChange} />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label small fw-semibold">Date of birth</label>
                                <input type="date" className="form-control profile-input" name="dob" value={profileForm.dob} onChange={handleProfileChange} />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label small fw-semibold">Gender</label>
                                <select className="form-select profile-input" name="gender" value={profileForm.gender} onChange={handleProfileChange}>
                                    <option value="not specified">Not specified</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="col-6 col-md-3">
                                <label className="form-label small fw-semibold">Height</label>
                                <input type="number" min="0" step={'any'} className="form-control profile-input" name="height" value={profileForm.height} onChange={handleProfileChange} />
                            </div>
                            <div className="col-6 col-md-3">
                                <label className="form-label small fw-semibold">Weight</label>
                                <input type="number" min="0" step={'any'} className="form-control profile-input" name="weight" value={profileForm.weight} onChange={handleProfileChange} />
                            </div>
                            <div className="col-6 col-md-3">
                                <label className="form-label small fw-semibold">Goal weight</label>
                                <input type="number" min="0" step={'any'} className="form-control profile-input" name="goalWeight" value={profileForm.goalWeight} onChange={handleProfileChange} />
                            </div>
                            <div className="col-6 col-md-3">
                                <label className="form-label small fw-semibold">Daily kcal</label>
                                <input type="number" min="1" className="form-control profile-input" name="dailyKcalGoal" value={profileForm.dailyKcalGoal} onChange={handleProfileChange} />
                            </div>
                            <div className="col-4">
                                <label className="form-label small fw-semibold">Carbs</label>
                                <input type="number" min="1" step={'any'} className="form-control profile-input" name="carbs" value={profileForm.carbs} onChange={handleProfileChange} />
                            </div>
                            <div className="col-4">
                                <label className="form-label small fw-semibold">Protein</label>
                                <input type="number" min="1" step={'any'} className="form-control profile-input" name="proteins" value={profileForm.proteins} onChange={handleProfileChange} />
                            </div>
                            <div className="col-4">
                                <label className="form-label small fw-semibold">Fats</label>
                                <input type="number" min="1" step={'any'} className="form-control profile-input" name="fats" value={profileForm.fats} onChange={handleProfileChange} />
                            </div>
                        </div>

                        <button className="btn profile-primary-btn w-100 mt-3 d-flex align-items-center justify-content-center gap-2" disabled={isSavingProfile}>
                            <Save size={17} />
                            {isSavingProfile ? 'Saving...' : 'Save changes'}
                        </button>
                    </form>
                )}
            </section>

            {/* GENERATED AVATAR */}
            <section className="profile-card mb-4" onClick={() => onToggle('avatar')} ref={parentRef}>
                <div className="d-flex align-items-center justify-content-between gap-3 cursor-pointer">
                    <div>
                        <h3 className="profile-section-title mb-1">Avatar</h3>
                        <p className="small text-muted-foreground mb-0">Upload a photo or choose a generated avatar.</p>
                    </div>

                    <div className='d-flex gap-2 align-items-center'>
                        <Image size={20} className="text-carbs" />
                        <ChevronRight
                            className="text-muted transition-transform flex-shrink-0"
                            style={{ transform: openSection === 'avatar' ? 'rotate(90deg)' : 'rotate(0deg)' }}
                        />
                    </div>
                </div>

                {openSection === 'avatar' && (
                    <div className="d-grid gap-2 profile-avatar-grid mt-3" onClick={(e) => e.stopPropagation()}>
                        {avatarPresets.map((avatar) => (
                            <button
                                key={avatar}
                                type="button"
                                className={`profile-avatar-choice ${user?.avatar === avatar ? 'active' : ''}`}
                                onClick={() => handlePresetAvatar(avatar)}
                                disabled={isUploadingAvatar}
                            >
                                <img src={avatar} alt="Avatar preset" />
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {/* PASSWORD FORM */}
            <section className="profile-card mb-4" onClick={() => onToggle('password')} ref={parentRef}>
                <div className="d-flex align-items-center justify-content-between gap-3 cursor-pointer">
                    <div>
                        <h3 className="profile-section-title mb-1">Password</h3>
                        <p className="small text-muted-foreground mb-0">Keep your account secure.</p>
                    </div>
                    <div className='d-flex gap-2 align-items-center'>
                        <Shield size={20} className="text-protein" />
                        <ChevronRight
                            className="text-muted transition-transform flex-shrink-0"
                            style={{ transform: openSection === 'password' ? 'rotate(90deg)' : 'rotate(0deg)' }}
                        />
                    </div>
                </div>

                {openSection === 'password' && (
                    <form onSubmit={handlePasswordSubmit} onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex flex-column gap-3 mt-3">
                            <div>
                                <label className="form-label small fw-semibold">Current password</label>
                                <div className="input-group">
                                    <span className="input-group-text profile-input-icon"><KeyRound size={16} /></span>
                                    <input type="password" className="form-control profile-input" name="oldPassword" value={passwordForm.oldPassword} onChange={handlePasswordChange} placeholder='••••••••' />
                                </div>
                            </div>
                            <div>
                                <label className="form-label small fw-semibold">New password</label>
                                <input type="password" className="form-control profile-input" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} />
                            </div>
                            <div>
                                <label className="form-label small fw-semibold">Confirm password</label>
                                <input type="password" className="form-control profile-input" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} />
                            </div>
                        </div>

                        <button className="btn profile-secondary-btn w-100 mt-3 d-flex align-items-center justify-content-center gap-2" disabled={isSavingPassword}>
                            <KeyRound size={17} />
                            {isSavingPassword ? 'Updating...' : 'Change password'}
                        </button>
                    </form>
                )}
            </section>


            {/* ACCOUNT STATUS */}
            <section className="profile-card mb-4">
                <div className="d-flex align-items-start gap-3">
                    <Info size={18} className="text-primary-custom mt-1" />
                    <div>
                        <h3 className="profile-section-title mb-1">Account Status</h3>
                        <p className="small text-muted-foreground mb-0">
                            {user?.isVerified ? 'Your email is verified.' : 'Your email is not verified yet.'}
                        </p>
                    </div>
                </div>
            </section>



            <div className='row g-3'>
                <div className="col col-12 col-md-8">
                    {/* LOGOUT BUTTON */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="btn profile-logout-btn w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                        <LogOut size={18} />
                        Log out
                    </button>
                </div>
                <div className="col col-12 col-md-4">
                    {/* DELETE BUTTON */}
                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="btn profile-delete-btn w-100 d-flex align-items-center justify-content-center gap-2  rounded-4 fw-bold"
                    >
                        <UserX size={18} />
                        Delete Account
                    </button>

                </div>
            </div>

            <InfoModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                title="Delete Account"
                description="Are you absolutely sure? This action is irreversible. All your logs, meals, and personal data will be lost forever."
                icon={UserX}
                onConfirm={handleDeleteAccount}
                confirmText="Delete"
                isDanger={true}
            />
        </div>

    )
}






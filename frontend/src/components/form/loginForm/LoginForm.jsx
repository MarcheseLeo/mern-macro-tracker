import { useContext, useState } from 'react'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../ui/button/Button'
import { Form, InputGroup } from 'react-bootstrap'
import { AuthContext } from '../../../context/AuthContext'
import './LoginForm.css'
import api from '../../../services/api'

export const LoginForm = () => {
    const [isLoading, setIsLoadig] = useState(false)
    const [error, setError] = useState(null)
    const [loginForm, setLoginForm] = useState({})
    const { login } = useContext(AuthContext)

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setLoginForm({
            ...loginForm,
            [name]: value
        })
    }

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoadig(true)
        setError(null)

        try {
            const response = await api.post('/auth/login', loginForm)


            setError(null)
            await login(response.data.token)
            console.log("Login Success! Token and Cookie saved.")
            navigate('/home')
        } catch (e) {
            console.error("Error:", e);
            if (e.response && e.response.data) {
                setError(e.response.data.message || 'Email or password field are wrong')
            } else {
                setError("Server connection error")
            }
        } finally {
            setIsLoadig(false)
        }

    }

    return (
        <div className='mt-4'>
            {/* GOOGLE BUTTON */}
            <Button
                asChild
                type="button"
                variant='outline'
                className='w-100 radius-2xl py-2 fw-medium google-button bg-white'
            >
                <a
                    href={import.meta.env.VITE_SERVER_BASE_URL + '/auth/google'}
                    className="w-50 d-flex justify-content-center align-items-center text-nowrap"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                        alt="Google Logo"
                        width="24"
                        height="24"
                        className="me-3"
                    />
                    Continue with Google
                </a>
            </Button>

            {/* DIVIDER */}
            <div className='my-4 d-flex align-items-center gap-3'>
                <span className='divider'></span>
                <span className='divider-between small fw-medium'>or</span>
                <span className='divider'></span>
            </div>
            {error && (
                <div className='alert alert-danger py-2 small rounded-3'>
                    {error}
                </div>
            )}

            {/*LOGIN FORM*/}
            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3 login-form">
                {/*EMAIL*/}
                <Form.Group controlId='login-email'>
                    <Form.Label className='small fw-medium mb-1'>Email</Form.Label>
                    <InputGroup className="soft-input-group">
                        <InputGroup.Text className="bg-white border-end-0 pe-2">
                            <Mail size={18} />
                        </InputGroup.Text>
                        <Form.Control
                            type='email'
                            name='email'
                            placeholder='example@gmail.com'
                            onChange={handleChangeInput}
                            required
                            className="border-start-0 ps-0"
                        ></Form.Control>
                    </InputGroup>
                </Form.Group>

                {/*PASSWORD*/}
                <Form.Group controlId='login-password'>
                    <Form.Label className="small fw-medium mb-1">Password</Form.Label>
                    <InputGroup className="soft-input-group">
                        <InputGroup.Text className="bg-white border-end-0 pe-2">
                            <Lock size={18} />
                        </InputGroup.Text>
                        <Form.Control
                            type='password'
                            name='password'
                            placeholder='••••••••'
                            onChange={handleChangeInput}
                            required
                            className="border-start-0 ps-0"
                        ></Form.Control>
                    </InputGroup>
                    <div className="d-flex justify-content-end align-items-center mt-1">
                        <Link to="/forgot-password" className="small fw-semibold text-primary-custom text-decoration-none">Forgot Password?</Link>
                    </div>
                </Form.Group>

                {/*SUBMIT BUTTON*/}
                <Button
                    type="submit"
                    variant='default'
                    disabled={isLoading}
                    className="w-100 rounded-pill py-2 mt-2 login-button"
                >
                    Login
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : ''}
                </Button>
            </Form>
        </div>
    )
}

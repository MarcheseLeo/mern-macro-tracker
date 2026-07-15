import { useState } from 'react';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/button/Button';
import { Form, InputGroup } from 'react-bootstrap';
import { InfoModal } from '../../infoModal/Infomodal';
import '../loginForm/LoginForm.css';

export const RegisterForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [registerForm, setRegisterForm] = useState({})
    const [showModal, setShowModal] = useState(false)


    const navigate = useNavigate();

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setRegisterForm({
            ...registerForm,
            [name]: value
        });
    };

    const handleModalClose = () => {
        setShowModal(false);

        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registerForm)
            });

            const data = await response.json();
            console.log(data)
            if (response.ok) {
                setShowModal(true)
                setError(null)
                console.log("Registration completed!")
            } else {
                if (data.errors && Array.isArray(data.errors)) {
                    const formattedErrors = data.errors.map(err => {
                        const fieldName = err.path ? err.path.charAt(0).toUpperCase() + err.path.slice(1) : 'Field';
                        return `${fieldName}: ${err.msg}`;
                    });
                    setError(formattedErrors);
                } else if (data.message) {
                    setError(data.message);
                } else {
                    setError('Error during registration');
                }
            }
        } catch (e) {
            console.error("Error:", e);
            setError("Server connection error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='mt-4'>
            <InfoModal
                show={showModal}
                onHide={handleModalClose}
                icon={Mail}
                title="Verify your email"
                description="
                    We`ve sent a verification link to your email.
                    Please check your inbox and click the link to activate your account.
                "
            />
            {error && (
                <div className='alert alert-danger py-2 small rounded-3'>
                    {error}
                </div>
            )}

            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3 register-form">
                <div className="row g-3">
                    {/* FIRSTNAME INPUT */}
                    <Form.Group className="col-6" controlId='register-firstname'>
                        <Form.Label className='small fw-medium mb-1'>First Name</Form.Label>
                        <InputGroup className="soft-input-group">
                            <InputGroup.Text className="bg-white border-end-0 pe-2">
                                <User size={18} />
                            </InputGroup.Text>
                            <Form.Control
                                type='text'
                                name='firstName'
                                placeholder='John'
                                onChange={handleChangeInput}
                                required
                                className="border-start-0 ps-0"
                            />
                        </InputGroup>
                    </Form.Group>

                    {/* LASTNAME INPUT */}
                    <Form.Group className="col-6" controlId='register-lastname'>
                        <Form.Label className='small fw-medium mb-1'>Last Name</Form.Label>
                        <InputGroup className="soft-input-group">
                            <InputGroup.Text className="bg-white border-end-0 pe-2">
                                <User size={18} />
                            </InputGroup.Text>
                            <Form.Control
                                type='text'
                                name='lastName'
                                placeholder='Doe'
                                onChange={handleChangeInput}
                                required
                                className="border-start-0 ps-0"
                            />
                        </InputGroup>
                    </Form.Group>
                </div>

                {/* EMAIL */}
                <Form.Group controlId='register-email'>
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
                        />
                    </InputGroup>
                </Form.Group>

                {/* PASSWORD */}
                <Form.Group controlId='register-password'>
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
                            minLength="8"
                            className="border-start-0 ps-0"
                        />
                    </InputGroup>
                </Form.Group>

                {/* SUBMIT BUTTON */}
                <Button
                    type="submit"
                    variant='default'
                    disabled={isLoading}
                    className="w-100 rounded-pill py-2 mt-2 login-button"
                >
                    Create Account
                    {isLoading && <Loader2 className="animate-spin ms-2" size={20} />}
                </Button>
            </Form>

            {/* DIVIDER */}
            <div className='my-4 d-flex align-items-center gap-3'>
                <span className='divider'></span>
                <span className='divider-between small fw-medium'>or</span>
                <span className='divider'></span>
            </div>

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
                    Sign up with Google
                </a>
            </Button>
        </div>
    );
};
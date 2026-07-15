import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home/Home"
import VerifyEmail from "./pages/verifyEmail/VerifyEmail"
import { Welcome } from './pages/Welcome/Welcome';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register'
import { NotFound } from './pages/NotFound/NotFound';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { OauthSuccessPage } from './pages/OauthSuccessPage/OauthSuccessPage';
import { GuestRoute } from './components/auth/GuestRoute';
import { MainLayout } from './components/layout/MainLayout';
import { Profile } from './pages/Profile/Profile';
import { Calendar } from './pages/Calendar/Calendar';
import { Stats } from './pages/Statistics/Stats';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword/ResetPassword';
import { ThemeProvider } from './context/ThemeContext';


const App = () => {

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}

          <Route element={<GuestRoute />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />

            <Route path='/register' element={<Register />} />
            <Route path='/verify' element={<VerifyEmail />} />
            <Route path='/oauth/success' element={<OauthSuccessPage />} />

            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='reset-password' element={<ResetPassword />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path='/home' element={<Home />} />
              <Route path='/stats' element={<Stats />} />
              <Route path='/calendar' element={<Calendar />} />
              <Route path='/profile' element={<Profile />} />
            </Route>
          </Route>


          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home/Home"
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail"
import { Welcome } from './pages/Welcome/Welcome';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register'
import { NotFound } from './pages/NotFound/NotFound';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { OauthSuccessPage } from './pages/OauthSuccessPage/OauthSuccessPage';
import { GuestRoute } from './components/auth/GuestRoute';
import { MainLayout } from './components/layout/MainLayout';


const App = () => {

  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Welcome />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />

          <Route path='/register' element={<Register />} />
          <Route path='/verify' element={<VerifyEmail />} />
          <Route path='/oauth/success' element={<OauthSuccessPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path='/home' element={<Home />} />
          </Route>
        </Route>


        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

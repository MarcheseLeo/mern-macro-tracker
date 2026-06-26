import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home/Home"
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail"
import { Welcome } from './pages/Welcome/Welcome';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
const App = () => {

  return (
    <BrowserRouter>
      <Routes>

        {/* Rotte Pubbliche */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register/>} />
        {/* <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route> * */}
      <Route path='/home' element={<Home/>}>

      </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home/Home"
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail"
import { Welcome } from './pages/Welcome/Welcome';
const App = () => {

  return (
    <BrowserRouter>
      <Routes>

        {/* Rotte Pubbliche */}
        <Route path="/" element={<Welcome />} />


        {/* <Route path="/login" element={<Login />} />

        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route> * */}

      </Routes>
    </BrowserRouter>
  )
}

export default App

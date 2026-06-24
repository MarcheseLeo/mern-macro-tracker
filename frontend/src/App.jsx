import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home/Home"
import VerifyEmail from "./pages/verifyEmail/VerifyEmail"
const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' index element={<Home/>} />
        <Route path='/verify' element={<VerifyEmail/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

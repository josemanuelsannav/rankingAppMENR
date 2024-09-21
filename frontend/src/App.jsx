import { Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import RankingPrincipal from './pages/RankingPrincipal.jsx'
import NuevoJuegoPage from './pages/NuevoJuegoPage.jsx'
import VerJuegosPage from './pages/VerJuegosPage.jsx'
import VerDuelosPage from './pages/VerDuelosPage.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/RankingPrincipal" element={<RankingPrincipal />} />
          <Route path="/NuevoJuegoPage" element={<NuevoJuegoPage />} />
          <Route path="/VerJuegosPage" element={<VerJuegosPage />} />
          <Route path="/VerDuelosPage" element={<VerDuelosPage />} />
        </Routes>
      </div>
     
    </>
  )
}

export default App

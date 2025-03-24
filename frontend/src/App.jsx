import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx'
import RankingPrincipal from './pages/RankingPrincipal.jsx'
import NuevoJuegoPage from './pages/NuevoJuegoPage.jsx'
import VerJuegosPage from './pages/VerJuegosPage.jsx'
import VerDuelosPage from './pages/VerDuelosPage.jsx'
import Login from './pages/Login.jsx'
import AceptarInvitacion from './components/LoginComponents/AceptarInvitacion.jsx';
import ApuestasPage from './pages/ApuestasPage.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/HomePage" element={<HomePageWithQuery />} />
          <Route path="/RankingPrincipal" element={<RankingPrincipal />} />
          <Route path="/NuevoJuegoPage" element={<NuevoJuegoPage />} />
          <Route path="/VerJuegosPage" element={<VerJuegosPage />} />
          <Route path="/VerDuelosPage" element={<VerDuelosPage />} />
          <Route path="/aceptar-invitacion" element={<AceptarInvitacion />} />
          <Route path="/ApuestasPage" element={<ApuestasPage />} />
        </Routes>
      </div>
     
    </>
  )
}

function HomePageWithQuery() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const rankingId = queryParams.get('rankingId');

  return <HomePage rankingId={rankingId} />;
}
export default App

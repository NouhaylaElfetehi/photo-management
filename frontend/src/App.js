import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage.js';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './components/Dashboard/Overview';
import NotFound from './pages/NotFound';
import Albums from './components/Dashboard/Albums';
import CreateAlbum from './components/Dashboard/CreateAlbum';
import AlbumView from './components/Dashboard/AlbumView';
import Upload from './components/Dashboard/Upload';
import Gallery from './components/Dashboard/Gallery';
import Search from './components/Dashboard/Search';
import Trash from './components/Dashboard/Trash';
import OAuthRedirect from './components/Auth/OAuthRedirect';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

console.log("RegisterPage:", RegisterPage);
const App = () => {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Ajout d'un wrapper pour le contenu principal */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/albums/create" element={<CreateAlbum />} />
          <Route path="/albums/:albumId" element={<AlbumView />} />
          <Route path="/photos/upload" element={<Upload />} />
          <Route path="/photos" element={<Gallery />} />
          <Route path="/photos/search" element={<Search />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/oauth/google" element={<OAuthRedirect provider="google" />} />
          <Route path="/oauth/github" element={<OAuthRedirect provider="github" />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
};


export default App;

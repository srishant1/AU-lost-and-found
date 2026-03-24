import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/Toast';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Report from './pages/Report';
import ItemDetail from './pages/ItemDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/report" element={<Report />} />
        <Route path="/item/:id" element={<ItemDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

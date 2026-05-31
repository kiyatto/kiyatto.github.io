import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeView from './components/HomeView.jsx';
import AboutView from './components/AboutView.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/about" element={<AboutView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

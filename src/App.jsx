import { HashRouter, Routes, Route } from 'react-router-dom';
import HomeView from './components/HomeView.jsx';
import AboutView from './components/AboutView.jsx';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/about" element={<AboutView />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

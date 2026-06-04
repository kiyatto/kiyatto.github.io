import { BrowserRouter, Route } from 'react-router-dom';
import HomeView from './components/HomeView.jsx';
import AboutView from './components/AboutView.jsx';
import PageTransition from './components/PageTransition.jsx';

function App() {
  return (
    <BrowserRouter>
      <PageTransition>
        <Route path="/" element={<HomeView />} />
        <Route path="/about" element={<AboutView />} />
      </PageTransition>
    </BrowserRouter>
  );
}

export default App;

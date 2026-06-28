import { BrowserRouter, Routes, Route } from 'react-router';
import Header from './components/Header.jsx';
import HomePage from './components/HomePage.jsx';
import AboutView from './components/AboutView.jsx';
import WorkView from './components/WorkView.jsx';
import LibraryView from './components/LibraryView.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="relative flex h-dvh flex-col">
        <Header />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-hidden overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/work" element={<WorkView />} />
            <Route path="/reading-list" element={<LibraryView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;

import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css"
import Loading from './components/loading/loading.jsx'


const Login = lazy(() => import('./components/auth/auth.jsx')); 
const Main = lazy(() => import('./pages/main/main.jsx'));
const Hero = lazy(() => import('./pages/hero/hero.jsx'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Hero />} />
            <Route path='/auth' element={<Login />} />
            <Route path='/chat' element={<Main />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css"
import Loading from './components/loading/loading.jsx'


const Login = lazy(() => import('./components/auth/login')); 

function App() {
  return (
    <div className="App">
      <Suspense fallback={< Loading />}>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage, LoginPage, SignUpPage, TodoPage } from 'pages';

import { AuthProvider } from 'contexts/AuthContext';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="todo" element={<TodoPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
export default App;

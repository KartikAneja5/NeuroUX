import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';

describe('ProtectedRoute Navigation Guard', () => {
  it('redirects unauthenticated user to login route when token is null', () => {
    render(
      <AuthContext.Provider value={{ token: null, loading: false }}>
        <MemoryRouter initialEntries={['/customer/dashboard']}>
          <Routes>
            <Route path="/customer/dashboard" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
            <Route path="/login" element={<div>Login Page Redirect</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Login Page Redirect')).toBeTruthy();
    expect(screen.queryByText('Protected Content')).toBeNull();
  });
});

import { useContext } from 'react';
import { AuthContext } from '../context/AuthCtx';

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthCtx must be used inside a AuthProvider');
  }
  return context;
}

export default useAuth;

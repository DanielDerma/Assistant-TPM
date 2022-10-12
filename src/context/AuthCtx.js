import PropTypes from 'prop-types';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebaseClient';
import { getCurrentUser } from '../services/firebaseFunctions';

export const AuthContext = React.createContext();

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [infoUser, setInfoUser] = useState();
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        getCurrentUser(user?.email)
          .then((data) => {
            setInfoUser(data);
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setInfoUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    infoUser,
    isAuthenticated: !!infoUser,
    userCompany: infoUser?.userCompany,
    isAdmin: infoUser?.userCompany === 'admin',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

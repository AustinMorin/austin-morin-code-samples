import { createContext, useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import app from "../util/Firebase";

const initialAuthState = {
  isAuthenticated: false,
  initializing: true,
  user: null,
};

const AuthContext = createContext({
  ...initialAuthState,
  logout: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialAuthState);

  const logout = () => {
    const auth = getAuth();
    return signOut(auth);
  };

  const setLogin = (user) => {
    setState({
      isAuthenticated: true,
      initializing: false,
      user: user,
    });
  };

  const setLogout = (user) => {
    setState({
      isAuthenticated: false,
      initializing: false,
      user: null,
    });
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setLogin(user);
        // ...
      } else {
        setLogout(user);
      }
    });

    return unsubscribe;
  }, []);

  if (state.initializing) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
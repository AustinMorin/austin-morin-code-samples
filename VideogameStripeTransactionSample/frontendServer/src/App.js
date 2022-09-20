import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Spinner from "react-bootstrap/Spinner";
import { AuthProvider } from "./context/FirebaseAuthContext";

import "./App.css"

const SigninView = lazy(() => import("./views/SigninView"));
const SignupView = lazy(() => import("./views/SignupView"));
const DashboardView = lazy(() => import("./views/DashboardView"));
const CheckoutView = lazy(() => import("./views/CheckoutView"));

// Create a react query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000 * 120,
    },
  },
});

const App = () => {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/">
              <Route
                index
                element={
                  <Suspense fallback={<Loading />}>
                    <SigninView />
                  </Suspense>
                }
              />
              <Route
                path="/signin"
                element={
                  <Suspense fallback={<Loading />}>
                    <SigninView />
                  </Suspense>
                }
              />
              <Route
                path="/signup"
                element={
                  <Suspense fallback={<Loading />}>
                    <SignupView />
                  </Suspense>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <Suspense fallback={<Loading />}>
                    <DashboardView />
                  </Suspense>
                }
              />
              <Route
                path="/checkout"
                element={
                  <Suspense fallback={<Loading />}>
                    <CheckoutView />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
};

const Loading = () => {
  return (
    <div className="App">
      <Spinner animation="border" />
    </div>
  );
};

export default App;
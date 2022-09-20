import { useState, useRef } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Navigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import Error from "../../components/Error";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const SignupView = (props) => {
  const { user } = useAuth();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [error, setError] = useState(null);

  //this is our config for FirebaseAuth
  const signup = (e) => {
    e.preventDefault();

    const auth = getAuth();
    createUserWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((userCredential) => {
        // Signed in
        console.log(userCredential.user);
      })
      .catch((err) => {
        setError(err.message);
        console.log(err.message);
      });
  };

  if (user) return <Navigate to={{ pathname: "/dashboard" }} />;

  return (
    <div className="container">
      <h1>Signup</h1>
      <Form onSubmit={signup}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            ref={emailRef}
            type="email"
            placeholder="Enter email"
          />
          <Form.Text className="text-muted">
            We'll never share your email.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            ref={passwordRef}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        {error && <Error error={error} />}
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <p className="reminder">
        Already have an account? <a href="/">Click here to sign in</a>
      </p>
    </div>
  );
};

export default SignupView;
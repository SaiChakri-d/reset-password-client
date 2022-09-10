import { Form, Button } from "semantic-ui-react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import { API_URL } from "./global_constant";

function Login() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function loginVerify(values) {
    try {
      const { request, data } = await axios.post(
        `${API_URL}/users/login`,
        values
      );
      console.log(request.status, data);
      if (request.status === 200) {
        localStorage.setItem("x-auth-token", data.token);
        return true;
      }
    } catch (err) {
      setInfo("Invalid Email/Username/Password");
      return false;
    }
  }

  const signInSchema = yup.object({
    email: yup.string().required("Email/Username is required"),
    password: yup.string().required("Password cannot be empty"),
  });

  const { handleChange, handleSubmit, handleBlur, errors, touched, values } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: signInSchema,
      onSubmit: async (values) => {
        setLoading(true);
        let isUser = await loginVerify(values);
        console.log(isUser);
        let result = () => (isUser ? history.push("/securedpage") : "");
        setLoading(false);
        result();
      },
    });

  const formStyles = {
    background: "whitesmoke",
    boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37)",
    width: "28rem",
    padding: "2rem",
    borderRadius: "1rem",
    margin: "0rem 1.5rem",
  };

  return (
    <section className="loginPage">
      <Form style={formStyles} onSubmit={handleSubmit}>
        <h3 style={{ textAlign: "center" }}>Login to your Account</h3>
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
          error={errors.email && touched.email && errors.email}
          fluid
          label="Email/Username"
          placeholder="Email/Username"
          id="email"
          name="email"
          type="text"
        />
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
          error={errors.password && touched.password && errors.password}
          fluid
          label="Password"
          placeholder="Password"
          id="password"
          name="password"
          type="password"
        />
        <div className="signin">
          <Button type="submit" inverted color="red">
            Sign in
          </Button>
        </div>
        <section className="FormAction">
          <p>
            New here? <Link to="/register">Sign up</Link>
          </p>
          {loading ? (
            <div className="LoaderDiv">
              <Loader type="Oval" color="crimson" height={50} width={30} />
              <p style={{ color: "crimson" }}>Validating..</p>
            </div>
          ) : (
            ""
          )}
          <Link to="/forgotPassword">Forgot Password</Link>
        </section>
        {info ? <p style={{ color: "red" }}>{info}</p> : ""}
      </Form>
    </section>
  );
}

export { Login };

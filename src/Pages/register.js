import { Form, Button } from "semantic-ui-react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { useState } from "react";
import Loader from "react-loader-spinner";
import { API_URL } from "./global_constant";
function Register() {
  const [info, setInfo] = useState(null);
  const [loader, setLoader] = useState(false);
  const signUpSchema = yup.object({
    username: yup
      .string()
      .min(5, "Minimum 5 characters needed")
      .required("Username is required"),
    email: yup.string().email().required("Please enter your email"),
    password: yup
      .string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
        "Password must contain eight or more characters including one uppercase letter, one lowercase letter, one number and one special character"
      )
      .required("Please enter your new password"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Required Field"),
  });

  const { handleChange, handleSubmit, handleBlur, errors, touched, values } =
    useFormik({
      initialValues: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      validationSchema: signUpSchema,
      onSubmit: (values, { resetForm }) => {
        setLoader(true);
        const { confirmPassword, ...others } = values;

        const req = fetch(`${API_URL}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(others),
        }).then((response) => {
          //  console.log(response)
          if (response.status === 400) {
            setLoader(false);
            setInfo("Username/Email already exists");
          } else {
            setLoader(false);
            setInfo(
              `Hi ${others.username},Your account has been created successfully! Please Login with your Email/Password`
            );
            resetForm();
          }
        });
        console.log(req);
      },
    });
  const formStyles = {
    background: "whitesmoke",
    boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37)",
    width: "28rem",
    height: "minContent",
    margin: "2rem",
    padding: "1rem 2rem",
    borderRadius: "1rem",
  };
  return (
    <section className="RegisterPage">
      <Form style={formStyles} onSubmit={handleSubmit}>
        <h3 style={{ textAlign: "center" }}>Register new Account</h3>
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.username}
          error={errors.username && touched.username && errors.username}
          fluid
          label="Username"
          placeholder="Username"
          id="username"
          name="username"
          type="text"
        />

        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
          error={errors.email && touched.email && errors.email}
          fluid
          label="Email"
          placeholder="Email"
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
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.confirmPassword}
          error={
            errors.confirmPassword &&
            touched.confirmPassword &&
            errors.confirmPassword
          }
          fluid
          label="Confirm Password"
          placeholder="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
        />
        <div className="signin">
          <Button type="submit" inverted color="red">
            Sign up
          </Button>
        </div>
        {loader ? (
          <Loader type="Oval" color="crimson" height={50} width={30} />
        ) : (
          ""
        )}
        {info ? (
          <p style={{ color: info.length > 40 ? "blue" : "red" }}>{info}</p>
        ) : (
          ""
        )}
        <section className="FormAction">
          <Link to="/login">Back to Login</Link>
        </section>
      </Form>
    </section>
  );
}

export { Register };

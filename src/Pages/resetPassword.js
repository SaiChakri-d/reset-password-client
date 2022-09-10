import { Form, Button } from "semantic-ui-react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import { API_URL } from "./global_constant";

export function ResetPassword() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id, token } = useParams();
  const history = useHistory();

  const ResetSchema = yup.object({
    password: yup
      .string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
        "Password must contain eight or more characters including one uppercase letter, one lowercase letter, one number and one special character"
      )
      .required("Password is required"),
    confirmpassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const { handleChange, handleSubmit, handleBlur, errors, touched, values } =
    useFormik({
      initialValues: {
        password: "",
        confirmpassword: "",
      },
      validationSchema: ResetSchema,
      onSubmit: async (values, { resetForm }) => {
        setLoading(true);
        const { password } = values;
        try {
          await axios.post(`${API_URL}/resetPassword/${id}/${token}`, {
            password: password,
          });
          resetForm();
          setInfo("Password has been changed successfully.😊");
        } catch (err) {
          setInfo("Invalid Link or Expired");
          setTimeout(() => {
            history.push("/login");
          }, 3500);
        }
        setLoading(false);
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
        <h3 style={{ textAlign: "center" }}>Change Password</h3>
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
          error={errors.password && touched.password && errors.password}
          fluid
          label="New Password"
          placeholder="New Password"
          id="password"
          name="password"
          type="password"
        />
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.confirmpassword}
          error={
            errors.confirmpassword &&
            touched.confirmpassword &&
            errors.confirmpassword
          }
          fluid
          label="Confirm New Password"
          placeholder="Confirm New Password"
          id="confirmpassword"
          name="confirmpassword"
          type="password"
        />
        <div className="signin">
          <Button type="submit" inverted color="red">
            Change Password
          </Button>
        </div>
        <div className="forgetDiv">
          {loading ? (
            <div className="LoaderDiv">
              <Loader type="Oval" color="crimson" height={50} width={30} />
              <p style={{ color: "crimson" }}>Please wait..</p>
            </div>
          ) : (
            ""
          )}
          {info ? (
            <p
              style={{
                color: info.length > 24 ? "blue" : "red",
                marginTop: "1rem",
              }}
            >
              {info}
            </p>
          ) : (
            ""
          )}
        </div>
        <section className="FormAction">
          <Link to="/login">Back to Login</Link>
        </section>
      </Form>
    </section>
  );
}

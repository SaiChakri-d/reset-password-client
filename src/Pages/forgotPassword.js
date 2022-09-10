import { Form, Button } from "semantic-ui-react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import { API_URL } from "./global_constant";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const ForgetPassSchema = yup.object({
    email: yup.string().email().required("Please enter your email"),
  });

  const { handleChange, handleSubmit, handleBlur, errors, touched, values } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: ForgetPassSchema,
      onSubmit: async (values, { resetForm }) => {
        setLoading(true);
        try {
          const { request } = await axios.post(
            `${API_URL}/resetPassword`,
            values
          );
          console.log(request);
          resetForm();
          setInfo(
            "Reset Password Link has been sent to your mail. Please check your mail"
          );
        } catch (err) {
          setInfo("Entered email does not exist");
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
    <section className="ForgetPasswordPage">
      <Form style={formStyles} onSubmit={handleSubmit}>
        <h3 style={{ textAlign: "center" }}>Forgot Password</h3>
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
        <div className="signin">
          <Button type="submit" inverted color="red">
            Send Mail
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
                color: info.length > 37 ? "blue" : "red",
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
        <p>
          <b>Note:</b> Please enter your registered email address to receive
         reset password link
        </p>
      </Form>
    </section>
  );
}
export { ForgotPassword };

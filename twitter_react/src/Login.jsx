import { Input, Button } from "@material-tailwind/react";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// export default function Example() {
//   return (
//     <div className="w-72">
//         <h2>Login</h2><br></br>
//       <Input label="Emailid" /><br></br>
//       <Input label="Password" /><br></br>
//     </div>
//   );
// }

import axios from "axios";
import { Link, Navigate } from "react-router-dom";

function Login(props) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loginForm, setloginForm] = useState({
    email: "",
    password: "",
  });

  function logMeIn(event) {
    if (loginForm.email != "" && loginForm.password != "") {
      axios({
        method: "POST",
        url: "/token",
        data: {
          email: loginForm.email,
          password: loginForm.password,
        },
      })
        .then((response) => {
          localStorage.setItem("token", response.data.access_token);
          setToken(response.data.access_token);
          toast.success("Login Successfully");
          // props.setToken(response.data.access_token);
          console.log(response.data.access_token);
        })
        .catch((error) => {
          toast.error(error);
          if (error.response) {
            toast.error(error.response);
            // console.log(error.response);
            // console.log(error.response.status);
            // console.log(error.response.headers);
          }
        });

      setloginForm({
        email: "",
        password: "",
      });
    } else {
      toast.error("Email and password are required");
    }

    event.preventDefault();
  }

  function handleChange(event) {
    const { value, name } = event.target;
    setloginForm((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  if (token) return <Navigate to="/" replace />;
  else {
    return (
      <div className="flex justify-center">
        <div className="w-50 border rounded-xl px-5 py-5">
          <ToastContainer />
          <h1>Login</h1> <br></br>
          <form className="login">
            <Input
              onChange={handleChange}
              type="email"
              text={loginForm.email}
              name="email"
              placeholder="Email"
              value={loginForm.email}
            />{" "}
            <br></br>
            <Input
              onChange={handleChange}
              type="password"
              text={loginForm.password}
              name="password"
              placeholder="Password"
              value={loginForm.password}
            />{" "}
            <br></br>
            <Button onClick={logMeIn}>Submit</Button> <br /> <br/>
            <Link to="/register">Don't have an account ? Register</Link>
          </form>
        </div>
      </div>
    );
  }
}
export default Login;

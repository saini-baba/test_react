import React, { useState } from "react";
import styles from "./home.module.scss";
import { RegForm } from "../component/RegForm";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [userData, setUserData] = useState();

  function login() {
    const Email = email.trim();
    const Password = password.trim();

    axios
      .post("http://localhost:3200/user/login", {
        Email,
        Password,
      })
      .then(function (response) {
        const { token, userData } = response.data;
        setUserData(userData);
        if (token) {
          localStorage.setItem("token", token);
          console.log("Login successful, token stored.");
          localStorage.setItem("userData", JSON.stringify(userData));
          navigate("/data", { state: { userData } });
        }
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            toast.error(
              "Error: " +
                (error.response.data.error || "pls enter correct credentials")
            );
          } else {
            toast.error("Network or other error: " + error.message);
          }
        }
      })
      .finally(function () {
        setPassword("");
        setEmail("");
      });
  }

  return (
    <div>
      <div className={styles.add}>
        <div className="container">
          <RegForm />
        </div>
      </div>
      <div className={styles.login}>
        <div className={styles.content}>
          <h1>Login</h1>
          <input
            type="text"
            required
            value={email}
            placeholder="Username"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login}>Login</button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Home;

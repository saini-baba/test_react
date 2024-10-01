import React from "react";
import Modal from "react-modal";
import { useState } from "react";
import styles from "./reg_form.module.scss";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

Modal.setAppElement("#root");
export const RegForm = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  function check(event) {
    event.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return toast.error("Pls enter correct email");
    }

    // Password validation (at least 8 characters, one uppercase, one lowercase, one number, and one special character)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should have at least 8 characters, one uppercase, one lowercase, one number, and one special character"
      );
    }

    // Phone validation (ensure phone number contains exactly 10 or more digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone)) {
      return toast.error("Pls enter correct number");
    }

    // Name validation (ensure it's a full name, contains two or more words, each word starts with a capital letter)
    const nameRegex = /^[A-Z][a-z]+\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/;
    if (!nameRegex.test(name)) {
      return toast.error("Pls enter full name");
    }
    add();
  }

  function add() {
    axios
      .post("http://localhost:3200/user/register", {
        name,
        email,
        phone,
        password,
      })
      .then(function (response) {
        toast.success(response.data);
        setModalIsOpen(false);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            if (error.response.status === 400) {
              toast.error("User already exists");
            } else {
              toast.error("Error inserting data:", error.response.data.error);
            }
          } else {
            toast.error("Network or other error:", error.message);
          }
        }
      })
      .finally(function () {
        setPassword("");
        setEmail("");
        setName("");
        setPhone("");
      });
  }

  return (
    <div className={styles.main}>
      <button onClick={() => setModalIsOpen(true)}>Add User</button>

      <Modal
        className={`container ${styles.form}`}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <button className={styles.button} onClick={() => setModalIsOpen(false)}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>
        <form onSubmit={check} className={styles.content}>
          <h2>Welcome</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            placeholder="Full Name"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            required
            placeholder="Email"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="text"
            placeholder="Phone Number"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            required
            placeholder="Password"
          />

          <button type="submit">Add</button>
        </form>
      </Modal>
     
    </div>
  );
};

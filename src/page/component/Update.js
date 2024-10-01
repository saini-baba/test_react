import React from "react";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import styles from "./update.module.scss";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import {
  faPenToSquare,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export const Update = (props) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [id, setId] = useState(props.userdata.id);
  const [name, setName] = useState(props.userdata.full_name);
  const [phone, setPhone] = useState(props.userdata.phone_no);
  const [newpassword, setNewpassword] = useState("");

  function updatevalue() {
    setId(props.userdata.id);
    setName(props.userdata.full_name);
    setPhone(props.userdata.phone_no);
  }

  useEffect(() => {
    updatevalue();
  }, []);

  function add(event) {
    event.preventDefault();
    console.log("Update function called");

    // Phone validation (ensure phone number contains exactly 10 or more digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone)) {
      return toast.error("Pls enter correct number");
    }

    if (
      newpassword &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(
        newpassword
      )
    ) {
      return toast.error(
        "Password must be at least 8 characters, include an uppercase, lowercase, number, and special character"
      );
    }

    // Name validation (ensure it's a full name, contains two or more words, each word starts with a capital letter)
    const nameRegex = /^[A-Z][a-z]+\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/;
    if (!nameRegex.test(name)) {
      return toast.error("Pls enter full name");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found. Please login again.");
      return;
    }

    axios
      .patch(
        "http://localhost:3200/user/update",
        {
          id,
          name,
          phone,
          newpassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then(function (response) {
        alert("Data Updated");
        setModalIsOpen(false);
        localStorage.removeItem("token");
        console.log("Logged out successfully.");
        navigate("/");
      })

      .catch((error) => {
        console.error("Error during update:", error); // Add this line to log the error
        if (error instanceof AxiosError) {
          if (error.response) {
            toast.error(error.response.data.error || "Error updating data");
          } else {
            toast.error("Network error: " + error.message);
          }
        } else {
          toast.error("Unexpected error: " + error.message);
        }
      });
  }

  return (
    <div className={styles.main}>
      <button
        className={styles.open}
        title="edit"
        onClick={() => setModalIsOpen(true)}
      >
        Update
      </button>
      <Modal
        className={`container ${styles.form}`}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <button
          className={styles.button}
          onClick={() => {
            setModalIsOpen(false);
          }}
        >
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>
        <form onSubmit={add} className={styles.content}>
          <h2>Update Data</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="text"
            placeholder="Phone"
          />
          <input
            value={newpassword}
            onChange={(e) => setNewpassword(e.target.value)}
            type="text"
            placeholder="New Password"
          />
          <button type="submit">Update and Logout</button>
        </form>
      </Modal>
    </div>
  );
};

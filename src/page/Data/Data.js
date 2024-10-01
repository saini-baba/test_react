import { React, useState, useEffect } from "react";
import styles from "./data.module.scss";
import axios, { AxiosError } from "axios";
import { Table } from "../component/Table";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Update } from "../component/Update";

const Data = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData;
  console.log("User Data:", userData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Logged out successfully.");
    navigate("/");
  };

  const fetchData = (searchQuery) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found. Please login again.");
      return;
    }

    axios
      .post(
        `http://localhost:3200/user/data`,
        { searchQuery },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(function (response) {
        setData(response.data);
        if (response.data.length === 0) {
          setData([{ name: "Employee not found" }]);
        }
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          console.error("Axios error message:", error.message);
          console.error("Error status code:", error.response?.status);
          console.error("Error response data:", error.response?.data);
          setData([{ name: "Error retrieving data from server" }]);
        }
      });
  };

  const handleSearch = () => {
    const trimmedInput = input.trim();
    setSearch(trimmedInput || "");
  };

  const handleReset = () => {
    setInput("");
    setSearch("");
  };

  useEffect(() => {
    fetchData(search);
  }, [search]);

  const delete_byid = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found. Please login again.");
      return;
    }
    console.log(token);
    axios
      .delete(`http://localhost:3200/user/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        toast.success(response.data.message || "User deleted successfully");
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          toast.error("Axios error message:", error.message);
          toast.error("Error status code:", error.response?.status);
          toast.error("Error response data:", error.response?.data);
        }
      });
  };

  const handleSort = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found. Please login again.");
      return;
    }

    if (!sortCriteria) {
      alert("Please select a sorting criteria.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3200/user/sort",
        { sortBy: sortCriteria },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data)) {
        setData(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error sorting users:", error);
      alert("An error occurred while sorting users.");
    }
  };

  const clearSort = () => {
    setSortCriteria("");
    fetchData(search);
  };

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={`container ${styles.control}`}>
          <div>
            <input
              placeholder="Search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <button onClick={handleReset}>Clear</button>
          </div>
          <div>
            <select
              onChange={(e) => setSortCriteria(e.target.value)}
              value={sortCriteria}
            >
              <option value="">Sort By</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
            <button onClick={handleSort}>Sort</button>

            <button onClick={clearSort}>Clear Sort</button>
          </div>
          <Update userdata={userData} />
          <button onClick={delete_byid}>Delete Your Account</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className={`container ${styles.table}`}>
        <Table data={data} />
      </div>
    </div>
  );
};

export default Data;

import { React, useState } from "react";
import styles from "./table.module.scss";

export const Table = (props) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = props.data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = props.data.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.full_name}</td>
              <td>{item.email}</td>
              <td>{item.phone_no}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className={styles.pageButton}
          style={{
            marginRight: "10px",
            cursor: page === 1 ? "not-allowed" : "pointer",
            backgroundColor: page === 1 ? "#ccc" : "#6c7ae0",
            color: "#fff",
            padding: "5px 10px",
            border: "none",
          }}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={styles.pageButton}
            style={{
              fontWeight: page === index + 1 ? "bold" : "normal",
              margin: "0 5px",
              backgroundColor: page === index + 1 ? "#355070" : "#fff",
              color: page === index + 1 ? "#fff" : "#000",
              border: "1px solid #6c7ae0",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className={styles.pageButton}
          style={{
            marginLeft: "10px",
            cursor: page === totalPages ? "not-allowed" : "pointer",
            backgroundColor: page === totalPages ? "#ccc" : "#6c7ae0",
            color: "#fff",
            padding: "5px 10px",
            border: "none",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

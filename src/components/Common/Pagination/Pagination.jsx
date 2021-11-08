import React from "react";
import styles from "./Pagination.module.scss";

const Pagination = ({
  arrayLength,
  postsPerPage,
  currentPage,
  setCurrentPage,
  currentPosts,
  disable,
}) => {
  const getLastPage = () => {
    let lastPage;
    if (arrayLength % postsPerPage === 0) {
      lastPage = arrayLength / postsPerPage;
    } else {
      lastPage = parseInt(arrayLength / postsPerPage) + 1;
    }

    return lastPage;
  };

  const isNextDisabled = () => {
    let lastPage = getLastPage();
    if (currentPage >= lastPage) return true;
    else return false;
  };

  const isPreviousDisabled = () => {
    if (currentPage === 1) {
      return true;
    } else return false;
  };

  const getPreviousDisabledClass = () => {
    if (disable) {
      return styles.disabled;
    } else if (isPreviousDisabled()) {
      return styles.disabled;
    } else {
      return "";
    }
  };

  const getNextDisabledClass = () => {
    if (disable) {
      return styles.disabled;
    } else if (isNextDisabled()) {
      return styles.disabled;
    } else {
      return "";
    }
  };

  const nextPage = (e) => {
    let lastPage = getLastPage();
    console.log("lastPage:", lastPage);
    if (currentPage < lastPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const previousPage = (e) => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className={styles.container}>
      <h4>
        Showing {currentPosts.length} entries of {currentPage}. page{" "}
      </h4>
      <div className={styles.paginationButtons}>
        <button
          disabled={disable ? disable : isPreviousDisabled()}
          className={getPreviousDisabledClass()}
          onClick={(e) => {
            previousPage(e);
          }}
        >
          Previous
        </button>
        <p>{currentPage}</p>
        <button
          disabled={disable ? disable : isNextDisabled()}
          className={getNextDisabledClass()}
          onClick={(e) => {
            nextPage(e);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

import React from "react";
import styles from "./Table.module.scss";

const Table = ({ headers, children }) => {
  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            <th></th>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;

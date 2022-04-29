import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./InternList.module.css";
import { ReactComponent as Logo } from "./logo.svg";
import { ReactComponent as EditIcon } from "./edit.svg";

const InternList = () => {
  const [interns, setInterns] = useState([]);

  useEffect(() => {
    const fetchInterns = async () => {
      const response = await fetch("http://localhost:3001/interns");
      const interns = await response.json();
      setInterns(interns);
    };
    fetchInterns();
  }, []);

  return (
    <>
      <Logo className={`${styles["logo"]}`} />
      <section className={`${styles["container"]}`}>
        <h1 className={`${styles["container__header"]}`}>Participants</h1>
        <ul className={`${styles["container__list"]}`}>
          {interns.map((u) => (
            <li key={u.id} className={`${styles["container__list__item"]}`}>
              {u.name}
              <NavLink
                to={`/interns/${u.id}`}
                className={`${styles["container__list__item__link"]}`}
              >
                <EditIcon className={`${styles["container__editIcon"]}`} />
                Edit
              </NavLink>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default InternList;

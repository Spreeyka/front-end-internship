import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import validator from "validator";
import { ReactComponent as Logo } from "./logo.svg";
import styles from "./EditIntern.module.css";
import { ReactComponent as GoBackIcon } from "./goBack.svg";

const EditIntern = () => {
  const { id } = useParams();
  const [internshipDatesError, setInternshipDatesError] = useState("");
  const [formValues, setFormValues] = useState({
    name: "name",
    email: "email@email",
    internshipStart: "2022-03-02",
    internshipEnd: "2022-03-02",
  });

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const validateInternshipDates = useCallback((intern) => {
    if (intern.internshipStart > intern.internshipEnd) {
      setInternshipDatesError(
        "Internship start date can't be greater than internship end date"
      );
    } else {
      setInternshipDatesError("");
    }
  }, []);

  useEffect(() => {
    async function getIntern() {
      const res = await fetch(`http://localhost:3001/interns/${id}`);
      const intern = await res.json();
      setFormValues(intern);
    }
    getIntern();
  }, [id]);

  useEffect(() => {
    validateInternshipDates(formValues);
  }, [formValues, validateInternshipDates]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (internshipDatesError === "") {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      };
      await fetch(`http://localhost:3001/interns/${id}`, requestOptions);
    }
  }

  return (
    <>
      <Logo className={`${styles["logo"]}`} />
      <NavLink to="/" className={`${styles["goBackLink"]}`}>
        <GoBackIcon className={`${styles["goBackLink__editIcon"]}`} />
        Back to list{" "}
      </NavLink>
      <form onSubmit={handleSubmit} className={`${styles["formContainer"]}`}>
        <h2 className={`${styles["formContainer__header"]}`}>Edit</h2>
        <div>
          <label htmlFor="name">Full name *</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formValues.name}
            onChange={handleInputChange}
            required
          />
          <span></span>
        </div>
        <div>
          <label htmlFor="email">Email address *</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formValues.email}
            onChange={handleInputChange}
            required
          />
          <span></span>
        </div>
        <div className={`${styles["formContainer__date"]}`}>
          <div>
            <label htmlFor="internshipStart">Internship start *</label>
            <input
              type="date"
              id="internshipStart"
              name="internshipStart"
              value={formValues.internshipStart}
              onChange={handleInputChange}
              required
            />
            <span
              className={internshipDatesError ? `${styles["dateError"]}` : ""}
            ></span>
          </div>
          <div>
            <label htmlFor="internshipEnd">Internship end *</label>
            <input
              type="date"
              id="internshipEnd"
              name="internshipEnd"
              value={formValues.internshipEnd}
              onChange={handleInputChange}
              required
            />
            <span></span>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default EditIntern;

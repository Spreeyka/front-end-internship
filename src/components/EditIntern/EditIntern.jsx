import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import styles from "./EditIntern.module.css";

const FULL_DATE_LENGTH = "YYYY-MM-DD".length;

const EditIntern = () => {
  const { id } = useParams();
  const [internshipDatesError, setInternshipDatesError] = useState("");
  const [formValues, setFormValues] = useState({
    name: "name",
    email: "email@email",
    internshipStart: "2022-03-02",
    internshipEnd: "2022-03-02",
  });

  //handler for any input type
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

      //slicing to fill the date input in format YYYY-MM-DD
      intern.internshipStart = intern.internshipStart.slice(
        0,
        FULL_DATE_LENGTH
      );
      intern.internshipEnd = intern.internshipEnd.slice(0, FULL_DATE_LENGTH);
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
      //converting back to ISOString
      //to send data to database
      convertDatesToISOString();
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      };
      await fetch(`http://localhost:3001/interns/${id}`, requestOptions);
    }
  }

  function convertDatesToISOString() {
    formValues.internshipStart = new Date(
      formValues.internshipStart
    ).toISOString();
    formValues.internshipEnd = new Date(formValues.internshipEnd).toISOString();
  }

  return (
    <>
      <Logo className={styles.logo} />
      <NavLink to="/" className={styles.goBackLink}>
        Back to list{" "}
      </NavLink>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <fieldset className={styles.formContainer__noBorder}>
          <legend className={styles.formContainer__header}>Edit</legend>
          <div>
            <label htmlFor="name" className={styles.formContainer__label}>
              <span className={styles.visuallyHidden}>Edit </span>
              Full name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formValues.name}
              onChange={handleInputChange}
              aria-required="true"
              required
            />
            <span></span>
          </div>
          <div>
            <label htmlFor="email" className={styles.formContainer__label}>
              Email address *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formValues.email}
              onChange={handleInputChange}
              aria-required="true"
              required
            />
            <span></span>
          </div>
          <div className={styles.formContainer__date}>
            <div>
              <label
                htmlFor="internshipStart"
                className={styles.formContainer__label}
              >
                Internship start *
              </label>
              <input
                type="date"
                name="internshipStart"
                id="internshipStart"
                value={formValues.internshipStart}
                onChange={handleInputChange}
                className={internshipDatesError ? styles.dateErrorInput : ""}
                aria-required="true"
                required
              />
              <span
                className={internshipDatesError ? styles.dateError : ""}
              ></span>
            </div>
            <div>
              <label
                htmlFor="internshipEnd"
                className={styles.formContainer__label}
              >
                Internship end *
              </label>
              <input
                type="date"
                id="internshipEnd"
                name="internshipEnd"
                value={formValues.internshipEnd}
                onChange={handleInputChange}
                aria-required="true"
                required
              />
              <span></span>
            </div>
          </div>
        </fieldset>
        <button type="submit" className={styles.submitButton}>
          {/* visually hidden span
        to make sure that visually impaired user
        knows about dates error */}
          <span className={styles.visuallyHidden}>{internshipDatesError} </span>
          Submit
        </button>
      </form>
    </>
  );
};

export default EditIntern;

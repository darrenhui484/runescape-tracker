import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./submitButton.module.css";

export function SubmitButton(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button className={styles.submit} {...props}>
      Submit
    </button>
  );
}

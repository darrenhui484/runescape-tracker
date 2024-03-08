import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./addButton.module.css";

export function AddButton(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button className={styles.add} {...props}>
      +
    </button>
  );
}

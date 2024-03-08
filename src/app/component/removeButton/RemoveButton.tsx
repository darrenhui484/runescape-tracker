import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./removeButton.module.css";

export function RemoveButton(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button className={styles.remove} {...props}>
      -
    </button>
  );
}

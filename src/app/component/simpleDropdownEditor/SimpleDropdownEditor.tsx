import { useState } from "react";
import styles from "./simpleDropdownEditor.module.css";
import { SubmitButton } from "../submitButton/SubmitButton";

type SimpleTextInputEditorProps = {
  title: string;
  items: Array<string>;
  onSubmit: (text: string) => void;
};
export function SimpleDropdownEditor({
  title,
  items,
  onSubmit,
}: SimpleTextInputEditorProps) {
  const [text, setText] = useState("");
  return (
    <div className={styles.container}>
      <div className={`${styles.textSize} ${styles.center}`}>{title}</div>
      <select
        onChange={(event) => {
          console.log(event.target.value)
          setText(event.target.value);
        }}
        name="items"
      >
        <option disabled selected> -- select an option -- </option>
        {items.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <SubmitButton onClick={() => onSubmit(text)} />
    </div>
  );
}

import { useState } from "react";
import styles from "./simpleTextInputEditor.module.css";
import { SubmitButton } from "../submitButton/SubmitButton";

type SimpleTextInputEditorProps = {
  title: string;
  onSubmit: (text: string) => void;
};
export function SimpleTextInputEditor({
  title,
  onSubmit,
}: SimpleTextInputEditorProps) {
  const [text, setText] = useState("");
  return (
    <div className={styles.container}>
      <div className={`${styles.textSize} ${styles.center}`}>{title}</div>
      <input type="text" onChange={(event) => setText(event.target.value)} />
      <SubmitButton onClick={() => onSubmit(text)} />
    </div>
  );
}

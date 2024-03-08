import { useState } from "react";
import { Counter } from "../counter/Counter";
import styles from "./simpleCounterEditor.module.css";
import { SubmitButton } from "../submitButton/SubmitButton";

type SimpleCounterEditorProps = {
  title: string;
  onSubmit: (delta: number) => void;
};
export function SimpleCounterEditor({
  title,
  onSubmit,
}: SimpleCounterEditorProps) {
  const [count, setCount] = useState(0);
  return (
    <div className={`${styles.container} ${styles.center}`}>
      <div className={`${styles.textSize} ${styles.center}`}>
        {title}: {count}
      </div>
      <Counter
        onIncrement={() => {
          setCount((prev) => prev + 1);
        }}
        onDecrement={() => {
          setCount((prev) => prev - 1);
        }}
      />
      <SubmitButton onClick={() => onSubmit(count)} />
    </div>
  );
}

import { AddButton } from "../addButton/AddButton";
import { RemoveButton } from "../removeButton/RemoveButton";
import { SubmitButton } from "../submitButton/SubmitButton";
import Image from "next/image";
import styles from "./imageCounterListEditor.module.css";
import { useState } from "react";

type ImageCounterListEditorProps<T extends { [key: string]: number }> = {
  initialState: T;
  onSubmit: (counter: T) => void;
};
export function ImageCounterListEditor<T extends { [key: string]: number }>({
  initialState,
  onSubmit,
}: ImageCounterListEditorProps<T>) {
  const [counter, setCounter] = useState<T>(initialState);
  return (
    <div>
      <div className={styles.grid}>
        {Object.keys(counter).map((counterKey) => {
          const imageSource = `/resource/${counterKey}.png`;
          return (
            <ImageCounterEditor
              key={counterKey}
              src={imageSource}
              alt={counterKey}
              count={counter[counterKey]}
              onAdd={() => {
                setCounter((prev) => ({
                  ...prev,
                  [counterKey]: prev[counterKey] + 1,
                }));
              }}
              onRemove={() => {
                setCounter((prev) => ({
                  ...prev,
                  [counterKey]: prev[counterKey] - 1,
                }));
              }}
            />
          );
        })}
      </div>
      <SubmitButton onClick={() => onSubmit(counter)} />
    </div>
  );
}

type ImageCounterEditorProps = {
  src: string;
  alt: string;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
};
function ImageCounterEditor({
  src,
  alt,
  count,
  onAdd,
  onRemove,
}: ImageCounterEditorProps) {
  return (
    <div className={styles.box}>
      <div className={styles.row}>
        <Image height={80} width={80} src={src} alt={alt} />
        <div>{count}</div>
        <div className={styles.column}>
          <AddButton onClick={onAdd} />
          <RemoveButton onClick={onRemove} />
        </div>
      </div>
    </div>
  );
}

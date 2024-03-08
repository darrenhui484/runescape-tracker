import { AddButton } from "../addButton/AddButton";
import { RemoveButton } from "../removeButton/RemoveButton";
import styles from "./counter.module.css";
type CounterProps = {
  onIncrement: () => void;
  onDecrement: () => void;
};
export function Counter({ onIncrement, onDecrement }: CounterProps) {
  return (
    <div className={styles.container}>
      <RemoveButton
        className={styles.decrementCounterButton}
        onClick={onDecrement}
      />
      <AddButton
        className={styles.incrementCounterButton}
        onClick={onIncrement}
      />
    </div>
  );
}

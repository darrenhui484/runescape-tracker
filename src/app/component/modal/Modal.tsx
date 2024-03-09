import { ReactNode } from "react";
import { Action, ModalActionType, ModalState } from "../../types";
import styles from "./modal.module.css"

type ModalProps = { isOpen: boolean; content: ReactNode };
export function Modal({ isOpen, content }: ModalProps) {
  const displayCss = isOpen ? { display: "grid" } : { display: "none" };
  return <div className={styles.modal} style={displayCss}>{content}</div>;
}

export function modalReducer(
  state: ModalState,
  action: Action<ModalActionType, ReactNode>
): ModalState {
  switch (action.type) {
    case "open":
      return { isOpen: true, content: action.payload };
    case "close":
      return { isOpen: false, content: null };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}

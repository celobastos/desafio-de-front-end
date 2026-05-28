"use client";

import type { ReactNode } from "react";
import styles from "./StatusShell.module.css";

type StatusActionButtonProps = {
  children: ReactNode;
  onClick: () => void;
};

export function StatusActionButton({ children, onClick }: StatusActionButtonProps) {
  return (
    <button className={styles.actionButton} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

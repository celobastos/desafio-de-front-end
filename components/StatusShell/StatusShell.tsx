import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./StatusShell.module.css";

type StatusShellProps = {
  title?: string;
  message: string;
  details?: string[];
  visual?: ReactNode;
  action?: ReactNode;
  backHref?: string;
};

export function StatusShell({ title, message, details = [], visual, action, backHref }: StatusShellProps) {
  const footer =
    action ??
    (backHref ? (
      <Link className={styles.backLink} href={backHref}>
        Back
      </Link>
    ) : null);

  return (
    <main className={styles.screen}>
      <section className={styles.shell}>
        {visual ? <div className={styles.visual}>{visual}</div> : null}
        {title ? <h1>{title}</h1> : null}
        <p className={styles.message}>{message}</p>
        {details.length > 0 ? (
          <div className={styles.details}>
            {details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>
        ) : null}
        {footer}
      </section>
    </main>
  );
}

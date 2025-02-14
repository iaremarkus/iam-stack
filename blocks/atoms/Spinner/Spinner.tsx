import classNames from "classnames";

import styles from "./Spinner.module.css";

export interface SpinnerProps {
  className?: string;
}

export function Spinner({ className = "", ...props }: SpinnerProps) {
  return (
    <div className={classNames(styles.loader, className)} {...props}></div>
  );
}

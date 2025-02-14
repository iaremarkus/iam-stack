import classNames from "classnames";

import styles from "./ButtonGroup.module.css";

export interface ButtonGroupProps {
  children?: React.ReactNode;
  gap?: "none" | "sm" | "md" | "lg";
  className?: string;
}

export function ButtonGroup({
  children,
  gap = "none",
  className = "",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      className={classNames(
        "flex items-center",
        gap === "sm" && "gap-1",
        gap === "md" && "~gap-1/2",
        gap === "lg" && "~gap-2/4",
        gap === "none" && styles.group,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

import classNames from "classnames";

import { Spinner } from "../Spinner";

export interface LoadingProps {
  text?: string;
  className?: string;
}

export async function Loading({
  text = "Loading...",
  className = "",
  ...props
}: LoadingProps) {
  return (
    <div
      className={classNames("flex items-center gap-4", className)}
      {...props}
    >
      <Spinner />
      <span>{text}</span>
    </div>
  );
}

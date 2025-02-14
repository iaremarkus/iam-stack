import classNames from "classnames";
import { CircleOff } from "lucide-react";

export interface NothingFoundProps {
  className?: string;
}

export async function NothingFound({
  className = "",
  ...props
}: NothingFoundProps) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "calc(100svh - 400px)" }}
      {...props}
    >
      <div
        className={classNames(
          "flex flex-col items-start justify-start ~p-4/8",
          "border border-muted bg-muted/20 rounded-lg max-w-lg",
          className
        )}
      >
        <CircleOff className="h-10 w-10 text-primary ~mb-2/4" />
        <h3 className="~text-lg/xl font-semibold">Nothing Found</h3>
        <p className="text-muted-foreground">
          Nothing was found for this page / query. Please try again.
        </p>
      </div>
    </div>
  );
}

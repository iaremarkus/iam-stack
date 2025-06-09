"use client";

import classNames from "classnames";
import { useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";

import { Spinner } from "../Spinner";

export interface SubmitButtonProps {
  text?: string;
  pendingText?: string;
  className?: string;
}

export function SubmitButton({
  text = "Submit",
  pendingText = "Submitting",
  className = "",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={twMerge(classNames("w-full", className))}
      disabled={pending}
      {...props}
    >
      {pending && <Spinner />}
      <span>{pending ? pendingText : text}</span>
    </Button>
  );
}

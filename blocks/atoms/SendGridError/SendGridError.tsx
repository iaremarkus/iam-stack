import classNames from "classnames";
import { MailWarning } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TSendGridError } from "@/types";

export interface SendGridErrorProps {
  error: TSendGridError;
  className?: string;
}

export async function SendGridError({
  error,
  className = "",
  ...props
}: SendGridErrorProps) {
  if (!error) return null;

  const getErrorMessage = (errorType: TSendGridError) => {
    switch (errorType) {
      case "Configuration":
        return (
          <div>
            There was a problem with the email server when sending this email.
            Please contact us if this error persists.
          </div>
        );

      case "AccessDenied":
        return (
          <div>
            You do not have permission to access this site using the email
            address provided. If you believe this to be an error, please contact
            us.
          </div>
        );

      case "Verification":
        return (
          <div>
            There was a problem verifying this site with the email provider.
            Please contact us if this error persists.
          </div>
        );

      default:
        return (
          <div>
            Something went wrong in logging you in. Please try again, or contact
            us if this error persists.
          </div>
        );
    }
  };

  return (
    <Alert
      variant="destructive"
      className={classNames(
        "w-full max-w-sm flex flex-col gap-2 bg-red-100 dark:bg-red-300",
        className
      )}
      {...props}
    >
      <MailWarning className="h-5 w-5" />
      <AlertTitle className="text-base">Something went wrong</AlertTitle>
      <AlertDescription>
        {getErrorMessage(error) ||
          "An unexpected error occured. Please contact us if this error persists."}
      </AlertDescription>
    </Alert>
  );
}

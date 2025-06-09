import { toast } from "sonner";
import { ZSAError } from "zsa";

import { Separator } from "@/components/ui/separator";
import { TFormError } from "@/types";

export const toastyErrors = (err: TFormError | ZSAError): void => {
  const { name, code, message } = err;

  if (message)
    toast.error(
      <div className="flex items-start gap-2 flex-col text-base w-full">
        <h5 className="text-sm w-full text-foreground flex flex-row justify-between items-center">
          <code className="bg-background p-1 rounded-sm text-foreground/60 mr-2">
            {code}
          </code>
          <span>{name}</span>
        </h5>

        <Separator />

        <div className="flex flex-col gap-2">
          <p>{message}</p>
        </div>

        {"meta" in err && <pre>{JSON.stringify(err.meta, null, 2)}</pre>}
      </div>
    );

  if ("fieldErrors" in err) {
    Object.entries(err.fieldErrors).forEach(([field, errors]) => {
      errors.forEach((error) =>
        toast.error(
          <div className="flex items-start gap-2 flex-col text-base w-full">
            <h5 className="text-sm w-full text-foreground flex flex-row justify-between items-center">
              <code className="bg-background p-1 rounded-sm text-foreground/60 mr-2">
                {field}
              </code>
              <span>{name}</span>
            </h5>

            <Separator />

            <div className="flex flex-col gap-2">
              <p>{error}</p>
              <code className="text-xs font-mono text-foreground">{code}</code>
            </div>
          </div>
        )
      );
    });
  }
};

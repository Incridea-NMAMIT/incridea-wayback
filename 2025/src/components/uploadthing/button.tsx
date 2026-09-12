import { generateUploadButton } from "@uploadthing/react";
import { getSession } from "next-auth/react";
import { memo, type ComponentProps } from "react";

import type { UploadRouter } from "~/server/uploadthing/router";
import { env } from "~/env";

const InternalUploadButton = generateUploadButton<UploadRouter>({
  url: `${env.NEXT_PUBLIC_THIS_APP_URL}/api/uploadthing`,
});

const UploadButton = memo(
  (
    props: ComponentProps<typeof InternalUploadButton> & {
      customId?: string;
    },
  ) => (
    <InternalUploadButton
      {...props}
      headers={async () => ({
        Authorization: (await getSession())?.accessToken ?? "",
        ...(props.customId ? { custom_id: props.customId } : {}),
      })}
    />
  )
);

UploadButton.displayName = "UploadButton";

export { UploadButton };

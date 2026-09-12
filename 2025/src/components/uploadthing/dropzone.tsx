import { generateUploadDropzone } from "@uploadthing/react";
import { getSession } from "next-auth/react";
import { memo, type ComponentProps } from "react";

import { env } from "~/env";
import { type UploadRouter } from "~/server/uploadthing/router";

const InternalUploadDropzone = generateUploadDropzone<UploadRouter>({
  url: `${env.NEXT_PUBLIC_THIS_APP_URL}/api/uploadthing`,
});

const UploadDropzone = memo((
  props: ComponentProps<typeof InternalUploadDropzone> & {
    customId?: string;
  },
) => (
  <InternalUploadDropzone
    {...props}
    headers={async () => ({
      Authorization: (await getSession())?.accessToken ?? "",
      ...(props.customId ? { custom_id: props.customId } : {}),
    })}
  />
))

UploadDropzone.displayName = "UploadDropzone";

export { UploadDropzone };

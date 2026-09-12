import { memo } from "react";

type ArchiveUploadProps = {
  className?: string;
  [key: string]: unknown;
};

/** Historical snapshots never upload files or contact the former API. */
const UploadButton = memo(({ className }: ArchiveUploadProps) => (
  <button
    type="button"
    className={className}
    disabled
    title="This is just a snapshot. Data not available."
  >
    This is just a snapshot. Data not available.
  </button>
));

UploadButton.displayName = "UploadButton";

export { UploadButton };

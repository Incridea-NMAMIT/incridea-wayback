import { memo } from "react";

type ArchiveUploadProps = {
  className?: string;
  [key: string]: unknown;
};

/** Historical snapshots never upload files or contact the former API. */
const UploadDropzone = memo(({ className }: ArchiveUploadProps) => (
  <div className={className} role="status">
    This is just a snapshot. Data not available.
  </div>
));

UploadDropzone.displayName = "UploadDropzone";

export { UploadDropzone };

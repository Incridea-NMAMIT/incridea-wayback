import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";
import styles from "~/components/general/event/eventDetails.module.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function EventDetails({ details }: { details: string }) {
  return (
    <ReactQuill
      value={details}
      readOnly={true}
      theme="bubble"
      className={`${styles.markup} event-description w-full`}
    />
  );
}

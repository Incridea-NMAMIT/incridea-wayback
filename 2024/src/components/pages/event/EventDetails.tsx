import React from "react";
import styles from "./EventDetails.module.css";
import draftToHtml from "draftjs-to-html";
function EventDetails({ details }: { details: string }) {
  let markup = details;

  // Older 2024 records used Draft.js JSON, while the archived server export
  // stores the already-rendered public HTML description.
  try {
    markup = draftToHtml(JSON.parse(details));
  } catch {
    markup = details;
  }

  return (
    <section
      className={`${styles.markup} w-full event-description`}
      dangerouslySetInnerHTML={{ __html: markup }}></section>
  );
}

export default EventDetails;

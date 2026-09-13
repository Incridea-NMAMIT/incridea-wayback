import React from "react";
import styles from "./EventDetails.module.css";
import draftToHtml from "draftjs-to-html";
function EventDetails({ details }: { details: string }) {
  let data;
  try {
    data = JSON.parse(details as string);
  } catch {
    data = {
      blocks: [{ key: "description", text: details, type: "unstyled", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }],
      entityMap: {},
    };
  }
  const markup = draftToHtml(data);

  return (
    <section
      className={`${styles.markup} w-full event-description`}
      dangerouslySetInnerHTML={{ __html: markup }}></section>
  );
}

export default EventDetails;

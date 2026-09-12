import { useQuery } from "@apollo/client";
import { type FC } from "react";

import { RoundsByEventDocument } from "~/generated/generated";

const RoundsDone: FC<{
  eventId: string;
}> = (eventId) => {
  //query to get rounds by event
  const { data } = useQuery(RoundsByEventDocument, {
    variables: {
      eventId: eventId.eventId,
    },
  });

  let total = 0,
    done = 0;

  //checks if the rounds are completed or not
  if (data?.roundsByEvent.__typename === "QueryRoundsByEventSuccess")
    data.roundsByEvent.data.map((round) =>
      round.completed ? done++ : total++,
    );

  return (
    <>
      <div
        className={`flex items-center justify-center ${
          done === total && done !== 0 ? "border-green-500 text-green-500" : ""
        }`}
      >
        {done === total && done !== 0
          ? "Event has Ended"
          : done + " / " + total}
      </div>
    </>
  );
};

export default RoundsDone;

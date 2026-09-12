import { useQuery } from "@apollo/client";
import React from "react";

import Spinner from "~/components/spinner";
import { type DayType, GetCardsDocument } from "~/generated/generated";

type Props = {
  day: string;
};

const Cards = ({ day }: Props) => {
  const { data: cards, loading: cardsLoading } = useQuery(GetCardsDocument, {
    variables: {
      day: day as DayType,
    },
  });

  return (
    <>
      {cardsLoading ? (
        <Spinner intent={"secondary"} className="mt-10" />
      ) : cards?.getCards.__typename === "QueryGetCardsSuccess" ? (
        <>
          <div className="flex max-w-6xl flex-wrap justify-center gap-8 text-white/90">
            {cards.getCards.data.length > 0 ? (
              cards.getCards.data.map((card, index) => (
                <div
                  key={index}
                  className="flex min-w-[300px] basis-full flex-col rounded-md bg-black/20 shadow-sm md:basis-[45%]"
                >
                  <h2 className="mb-2 px-4 pt-4 text-xl md:px-6 md:pt-6">
                    Clue {index + 1}
                  </h2>
                  <h2 className="mb-3 px-4 md:px-6">{card.clue}</h2>
                  <div className="flex grow flex-col md:px-6 md:pb-4">
                    {/* <ImageUpload
                      loading={submissionsLoading}
                      existingImage={
                        submissions?.submissionsByUser.__typename ===
                        "QuerySubmissionsByUserSuccess"
                          ? submissions?.submissionsByUser.data.filter(
                              (submission) => submission.cardId === card.id
                            )[0]?.image
                          : null
                      }
                      setImage={(file) => {
                        setSaved(false);
                        setImageFiles((prev) => {
                          const newFiles = [...prev];
                          newFiles[index] = file;
                          return newFiles;
                        });
                      }}
                    /> */}
                  </div>
                </div>
              ))
            ) : (
              <span className="mt-10 text-white/70">No cards found</span>
            )}
          </div>
        </>
      ) : (
        <span className="text-white/70">
          Error: Could not fetch cards, please try again later
        </span>
      )}
    </>
  );
};

export default Cards;

import { type Criteria } from "~/generated/generated";

import Score from "./score";

const CriteriaBox = ({
  criteria,
  roundNo,
  teamId,
}: // onUpdateScore,
{
  criteria: Criteria;
  roundNo: number;
  teamId: string;
  // onUpdateScore: (newScore: number) => void;
}) => {
  return (
    <div className="mt-2 flex w-[250px] grow flex-col items-center justify-between gap-3 rounded-md bg-white/10 p-5">
      <div className="flex items-center gap-1.5">
        <p className="mr-2 font-semibold text-white/90">{criteria.name}</p>
      </div>
      <Score
        key={criteria.id}
        teamId={teamId}
        criteriaId={criteria.id}
        roundNo={roundNo}
        type={criteria.type as string}
        // onUpdateScore={onUpdateScore}
      />
    </div>
  );
};

export default CriteriaBox;

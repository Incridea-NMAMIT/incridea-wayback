import { type Criteria } from "~/generated/generated";

import CreateCriteriaModal from "./createCriteriaModal";
import CriteriaBox from "./criteriaBox";
import DeleteCriteriaModal from "./deleteCriteriaModal";
import Remarks from "./remarks";

type Props = {
  eventId: string;
  roundNo: number;
  criterias: Criteria[] | null | undefined;
  selectedTeam: string | null;
};

const Criterias = ({ eventId, roundNo, criterias, selectedTeam }: Props) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 mb-2 flex items-end justify-between rounded-t-lg bg-[#35436F] px-4 py-3 shadow-sm">
        <h1 className="text-2xl font-semibold">Criterias</h1>
        <div className="flex gap-2">
          <CreateCriteriaModal eventId={eventId} roundNo={roundNo} />
          <DeleteCriteriaModal
            eventId={eventId}
            roundNo={roundNo}
            criterias={criterias}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-start gap-4 px-3 pb-3 text-white">
        {criterias?.length === 0 && (
          <div className="w-full py-5 text-center text-white/60">
            <p>No criterias yet</p>
          </div>
        )}
        {criterias?.map((criteria, index) => (
          <div key={index}>
            <CriteriaBox
              key={index}
              teamId={selectedTeam!}
              criteria={criteria}
              roundNo={roundNo}
            />
          </div>
        ))}
      </div>
      <Remarks eventId={eventId} roundNo={roundNo} teamId={selectedTeam!} />
    </div>
  );
};

export default Criterias;

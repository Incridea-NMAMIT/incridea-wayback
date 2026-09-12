import { useMemo } from "react";
import type { Team } from "../../../api/judging";
import { ID } from "../../../utils/id";

interface Props {
  teams: Team[];
  roundNo: number;
  eventId: number;
  eventType: string;
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
  selectionMode?: boolean; 
  setSelectionMode?: (mode: boolean) => void;
  finalRound?: boolean;
  criteria?: { id: number; name: string }[];
}

export default function TeamList({
  teams,
  selectedTeam,
  setSelectedTeam,
}: Props) {

  const getTeamScore = (team: Team) => {
      if (!team.Score) return 0;
      return team.Score.reduce((acc, curr) => acc + Number(curr.score || 0), 0);
  };
  
  const displayTeams = useMemo(() => {
      return [...teams].sort((a,b) => a.name.localeCompare(b.name));
  }, [teams]);

  return (
    <div className="h-full flex flex-col">
       {}

       <div className="flex-1 overflow-y-auto px-1 pt-2">
            <div className="space-y-2">
                {displayTeams.map(team => (
                    <div 
                        key={team.id}
                        onClick={() => setSelectedTeam(team)}
                        className={`p-3 rounded-lg border flex items-center gap-4 cursor-pointer transition ${selectedTeam?.id === team.id ? 'bg-indigo-900/40 border-indigo-500' : 'bg-slate-800 border-transparent hover:bg-slate-700'}`}
                    >
                        <div className="flex-1">
                            <p className="font-semibold text-white">{team.name}</p>
                            <p className="text-sm text-slate-400">
                                {ID.toTeamId(team.id)}
                            </p>
                        </div>
                        
                        <div className="text-right">
                             <p className="text-xl font-bold text-indigo-400">{getTeamScore(team)}</p>
                             <p className="text-xs text-slate-500">Score</p>
                        </div>
                    </div>
                ))}
                {displayTeams.length === 0 && <p className="text-center text-slate-500 py-10">No teams found</p>}
            </div>
       </div>
    </div>
  );
}

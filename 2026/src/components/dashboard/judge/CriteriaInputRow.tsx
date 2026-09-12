import { useState, useEffect } from "react";
import { AiOutlineCheck, AiOutlineLoading } from "react-icons/ai";
import { showToast } from "../../../utils/toast";
import apiClient from "../../../api/client";

interface Props {
  criteria: {
    id: number;
    name: string;
    type?: 'POINT' | 'TIME';
    scoreOutOf?: number;
  };
  teamId: number;
  eventId: number;
  roundNo: number;
  initialScore?: string;
}

export default function CriteriaInputRow({
  criteria,
  teamId,
  eventId,
  roundNo,
  initialScore,
}: Props) {
  const isTime = criteria.type === 'TIME';

  const parseTime = (val: string) => {
    if (!val || !val.includes(':')) return ["00", "00", "00", "00"];
    const parts = val.split(':');
    return [
      parts[0] || "00",
      parts[1] || "00",
      parts[2] || "00",
      parts[3] || "00"
    ];
  };

  const [value, setValue] = useState(initialScore || "");
  const [timeParts, setTimeParts] = useState<string[]>(parseTime(initialScore || ""));
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setValue(initialScore || "");
    if (isTime) setTimeParts(parseTime(initialScore || ""));
    setIsDirty(false);
  }, [initialScore, teamId, isTime]);

  const handleSubmit = async () => {
    const finalValue = isTime ? timeParts.join(':') : value;
    if (!finalValue) return;
    
    if (!isTime && criteria.scoreOutOf && Number(finalValue) > criteria.scoreOutOf) {
        showToast(`Score cannot exceed ${criteria.scoreOutOf}`, "error");
        return;
    }

    setLoading(true);
    try {
      await apiClient.post(
        `/judge/events/${eventId}/rounds/${roundNo}/score`,
        {
          teamId,
          criteriaId: criteria.id,
          score: finalValue,
        }
      );
      showToast(`Score for ${criteria.name} saved`, "success");
      setIsDirty(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to save score", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-300 flex justify-between">
        <span>{criteria.name}</span>
        <span className="text-xs text-slate-500 self-center">
          {isTime ? 'Time (HH:MM:SS:MS)' : `Out of ${criteria.scoreOutOf || 10}`}
        </span>
      </label>
      <div className="flex gap-2">
        {isTime ? (
          <div className="flex-1 flex gap-1 items-center">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="flex items-center gap-1">
                <input
                  type="text"
                  maxLength={2}
                  className="w-12 bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                  placeholder="00"
                  value={timeParts[idx]}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                    const newParts = [...timeParts];
                    newParts[idx] = val;
                    setTimeParts(newParts);
                    setIsDirty(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                />
                {idx < 3 && <span className="text-slate-500 font-bold">:</span>}
              </div>
            ))}
          </div>
        ) : (
          <input
            type="number"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder={`max ${criteria.scoreOutOf || 10}`}
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              if (criteria.scoreOutOf && Number(val) > criteria.scoreOutOf) return;
              setValue(val);
              setIsDirty(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
        )}
        
        <button
          onClick={handleSubmit}
          disabled={loading || !isDirty}
          className={`px-3 py-2 rounded-lg flex flex-shrink-0 items-center justify-center transition-colors ${
            loading || !isDirty
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
          title="Submit Score"
        >
          {loading ? <AiOutlineLoading className="w-4 h-4 animate-spin" /> : <AiOutlineCheck className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

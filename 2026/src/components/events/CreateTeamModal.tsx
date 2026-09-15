import { useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { createTeam } from "../../api/registration";
import { showToast } from "../../utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import NavActionButton from "../NavActionButton";
import { useTask } from "../../hooks/useTask";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

export default function CreateTeamModal({
  eventId,
  onClose,
}: {
  eventId: number;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { completeTask } = useTask();
  useBodyScrollLock(true);

  const glassCardStyle = {
    borderRadius: "1.75rem",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    background: "rgba(12, 12, 12, 0.96)",
    boxShadow: `
      inset 0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.22)
    `,
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
  } as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await createTeam(eventId, name);
      showToast("Team created successfully!", "success");
      completeTask("l2w5x8d3");
      queryClient.invalidateQueries({ queryKey: ["my-team", eventId] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      onClose();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to create team",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-xl sm:max-w-md rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(0,255,255,0.15)] p-6 sm:p-8 relative overflow-hidden"
        style={glassCardStyle}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/75 hover:text-white transition-colors z-10 cursor-target"
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-3xl sm:text-2xl font-bold text-white mb-6">Create Team</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-base sm:text-sm font-medium text-white/75 mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-base sm:text-sm text-white placeholder:text-white/40 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/30 transition-all"
              placeholder="Enter a cool team name"
              required
            />
          </div>
          <div className="flex justify-center">
            <NavActionButton onClick={() => handleSubmit({ preventDefault: () => { } } as React.FormEvent)} disabled={loading}>
              {loading ? "Creating..." : "Create Team"}
            </NavActionButton>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}


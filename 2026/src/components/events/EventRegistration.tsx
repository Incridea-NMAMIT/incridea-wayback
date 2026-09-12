import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyTeam,
  registerSoloEvent,
  confirmTeam,
  leaveTeam,
  deleteTeam,
} from "../../api/registration";
import { fetchMe } from "../../api/auth";
import { showToast } from "../../utils/toast";
import CreateTeamModal from "./CreateTeamModal";
import JoinTeamModal from "./JoinTeamModal";
import NavActionButton from "../NavActionButton";
import {
  IoCheckmarkDoneCircle,
  IoCopyOutline,
  IoExitOutline,
} from "react-icons/io5";
import { useTask } from "../../hooks/useTask";
import ConfirmDialog from "../dialogs/ConfirmDialog";

type EventRegistrationProps = {
  eventId: number;
  type: string;
  minTeamSize?: number;
  maxTeamSize?: number;
  isRegistrationFull?: boolean;
};

export default function EventRegistration({
  eventId,
  type,
  minTeamSize = 1,
  maxTeamSize = 1,
  isRegistrationFull = false,
}: EventRegistrationProps) {
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  const user = userData?.user;
  const token = !!user;
  const queryClient = useQueryClient();
  const { completeTask } = useTask();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showUnregisterConfirm, setShowUnregisterConfirm] = useState(false);

  const { data: team, isLoading } = useQuery({
    queryKey: ["my-team", eventId],
    queryFn: () => getMyTeam(eventId),
    enabled: !!user,
  });

  const registerSoloMutation = useMutation({
    mutationFn: (eId: number) => registerSoloEvent(eId),
    onSuccess: () => {
      showToast("Registered successfully!", "success");
      completeTask("l2w5x8d3");
      queryClient.invalidateQueries({ queryKey: ["my-team", eventId] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || "Registration failed", "error");
    },
  });

  const confirmTeamMutation = useMutation({
    mutationFn: (tId: number) => confirmTeam(tId),
    onSuccess: () => {
      showToast("Team confirmed!", "success");
      queryClient.invalidateQueries({ queryKey: ["my-team", eventId] });
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || "Confirmation failed", "error");
    },
  });

  const leaveTeamMutation = useMutation({
    mutationFn: (tId: number) => leaveTeam(tId),
    onSuccess: () => {
      showToast("Left team successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["my-team", eventId] });
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || "Failed to leave team", "error");
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (tId: number) => deleteTeam(tId),
    onSuccess: () => {
      showToast("Unregistered successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["my-team", eventId] });
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || "Failed to unregister", "error");
    },
  });



  if (!user) {
    return (
      <Link
        to={`/login?redirectUrl=${encodeURIComponent(`/events/${eventId}`)}`}
        className="w-full my-4 block"
      >
        <NavActionButton
          width="w-full sm:w-auto md:w-full lg:w-auto xl:w-full"
          bgColor="bg-[#5b21b6]"
          hoverBgColor="hover:bg-[#4c1d95]"
          size="micro"
        >
          Login to Register
        </NavActionButton>
      </Link>
    );
  }

  const isFestRegistered = !!userData?.user?.pid;

  if (isLoading || (token && isUserLoading)) {
    return <div className="text-center text-slate-400">Loading status...</div>;
  }

  if (token && !isFestRegistered) {
    return (
      <Link to="/register" className="w-full my-4 block">
        <NavActionButton width="w-full" height="h-auto">
          Register to Incridea
        </NavActionButton>
      </Link>
    );
  }

  if (
    userData?.user?.category === "ALUMNI" ||
    userData?.user?.roles?.includes("ALUMNI")
  ) {
    return null;
  }

  if (team) {
    const isLeader = String(team.Leader?.User?.id) === String(user.id);
    return (
      <div className="w-full md:max-w-2xl md:mx-auto p-1 lg:pr-24 xl:pr-32 space-y-3 overflow-hidden mt-[2vh] sm:mt-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {type.includes("TEAM") && (
              <p className="text-xs sm:text-sm text-slate-400 uppercase mb-1">
                Team Name
              </p>
            )}
            <h3 className="font-semibold text-sm sm:text-base text-sky-100 break-words">
              {type.includes("TEAM") ? team.name : `Participant: ${user?.name}`}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {type.includes("TEAM") && (
              <span className="text-sm text-slate-400">
                ID: <span className="text-white font-mono">{team.id}</span>
              </span>
            )}
            {team.confirmed ? (
              <span className="flex items-center gap-1 text-sm sm:text-sm text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded whitespace-nowrap">
                <IoCheckmarkDoneCircle /> Confirmed
              </span>
            ) : (
              <span className="text-sm sm:text-sm text-amber-400 bg-amber-950/30 px-1.5 py-0.5 rounded whitespace-nowrap">
                Not Confirmed
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          {type.includes("TEAM") && (
            <p className="text-sm sm:text-sm text-slate-400 uppercase">Members</p>
          )}
          {type.includes("TEAM") ? (
            team.TeamMembers?.map((member: any) => (
              <div
                key={member.id}
                className="text-sm sm:text-sm text-slate-200 flex justify-between break-words"
              >
                <span className="truncate">
                  {member.PID?.User?.name || `User ${member.PID?.User?.email}`}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm sm:text-sm text-slate-300">
              Registration ID: {team.name}
            </div>
          )}
        </div>

        {isLeader && (
          <div className="pt-2 flex flex-row gap-2 w-full justify-center items-center flex-wrap">
            {!team.confirmed && (
              <NavActionButton
                onClick={() => {
                  if (isRegistrationFull) {
                    showToast("You cannot confirm since the event has reached the maximum team limit", "error");
                    return;
                  }
                  const currentSize = team.TeamMembers.length;
                  const isTeam = type.toUpperCase().includes("TEAM");
                  const effectiveMinSize = isTeam ? Math.max(minTeamSize, 2) : minTeamSize;

                  if (isTeam && (currentSize < effectiveMinSize || currentSize > maxTeamSize)) {
                    if (currentSize < effectiveMinSize) {
                      const diff = effectiveMinSize - currentSize;
                      showToast(
                        `You still need ${diff} more ${diff === 1 ? "person" : "people"} in the team to confirm your team`,
                        "error"
                      );
                    } else {
                      showToast(
                        `Your team size (${currentSize}) exceeds the maximum allowed size of ${maxTeamSize}`,
                        "error"
                      );
                    }
                    return;
                  }
                  confirmTeamMutation.mutate(team.id);
                }}
                disabled={confirmTeamMutation.isPending || isRegistrationFull}
                width="w-auto"
                bgColor="bg-[#5b21b6]"
                hoverBgColor="hover:bg-[#4c1d95]"
                size="micro"
                title={isRegistrationFull ? "Registrations are full" : ""}
              >
                <span className="text-sm sm:text-sm">
                  {confirmTeamMutation.isPending ? "Confirming..." : "Confirm"}
                </span>
              </NavActionButton>
            )}

            <NavActionButton
              onClick={() => setShowUnregisterConfirm(true)}
              disabled={deleteTeamMutation.isPending}
              width="w-auto"
              bgColor="bg-red-600"
              hoverBgColor="hover:bg-red-700"
              size="micro"
            >
              <span className="text-sm sm:text-sm">
                {deleteTeamMutation.isPending
                  ? "Deleting..."
                  : type.includes("TEAM")
                    ? "Delete"
                    : "Unregister"}
              </span>
            </NavActionButton>
          </div>
        )
        }

        {
          !isLeader && (
            <button
              onClick={() => leaveTeamMutation.mutate(team.id)}
              className="w-full flex items-center justify-center gap-2 text-sm sm:text-sm text-red-400 hover:text-red-300 mt-2 cursor-target"
            >
              <IoExitOutline /> Leave Team
            </button>
          )
        }

        {/* Copy Team Id - Fixed */}
        {
          type.includes("TEAM") && (
            <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded text-sm sm:text-sm text-slate-400 mt-2">
              <span>
                Team ID: <span className="text-white font-mono">{team.id}</span>
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(String(team.id));
                  showToast("Copied Team ID", "success");
                }}
                title="Copy Team ID"
                className="cursor-target text-slate-400 hover:text-white transition-colors"
              >
                <IoCopyOutline />
              </button>
            </div>
          )
        }

        <ConfirmDialog
          isOpen={showUnregisterConfirm}
          title="Confirm Unregister"
          message="Are you sure you want to unregister? This action cannot be undone."
          confirmText="Unregister"
          cancelText="Cancel"
          variant="danger"
          onConfirm={() => {
            deleteTeamMutation.mutate(team.id);
            setShowUnregisterConfirm(false);
          }}
          onCancel={() => setShowUnregisterConfirm(false)}
        />
      </div >
    );
  }

  const isSolo = type === "INDIVIDUAL" || type === "INDIVIDUAL_MULTIPLE_ENTRY";

  if (isRegistrationFull) {
    return (
      <div className="w-full mt-4 flex items-center justify-center p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-200">
        <span className="text-sm font-medium font-moco">You cannot register since the event has reached the maximum team limit</span>
      </div>
    );
  }

  if (isSolo) {
    return (
      <>
        <div className="flex justify-center items-center w-full mt-[2vh] sm:mt-0">
          <NavActionButton
            width="w-full sm:w-auto md:w-full lg:w-auto xl:w-full"
            bgColor="bg-[#5b21b6]"
            hoverBgColor="hover:bg-[#4c1d95]"
            size="micro"
            onClick={() => registerSoloMutation.mutate(eventId)}
            disabled={registerSoloMutation.isPending}
          >
            {registerSoloMutation.isPending ? "Registering..." : "Register Now"}
          </NavActionButton>
        </div>
        <hr className="border-white/10 mt-4" />
      </>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-3 relative items-stretch">
      <div className="flex-1 mt-4 md:mt-0">
        <NavActionButton
          onClick={() => setShowCreateModal(true)}
          width="w-full"
          size="micro"
        >
          Create
        </NavActionButton>
      </div>

      <div className="flex-1">
        <NavActionButton
          onClick={() => setShowJoinModal(true)}
          width="w-full"
          size="micro"
        >
          Join Team
        </NavActionButton>
      </div>

      {showCreateModal && (
        <CreateTeamModal
          eventId={eventId}
          onClose={() => setShowCreateModal(false)}
        />
      )}
      {showJoinModal && (
        <JoinTeamModal
          eventId={eventId}
          onClose={() => setShowJoinModal(false)}
        />
      )}
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryFunction,
  type MutationFunction,
} from "@tanstack/react-query";
import { useNavigate, Link, Link as RouterLink } from "react-router-dom";
import {
  changePassword,
  fetchMe,
  updateProfile,
  type ChangePasswordPayload,
  type ChangePasswordResponse,
  type MeResponse,
} from "../api/auth";
import { fetchLeaderboard } from "../api/leaderboard";
import {
  fetchRegistrationConfig,
  fetchPublishedEvents,
  type PublicEvent,
} from "../api/public";
import { getTaskStatus } from "../api/task";
import {
  getMyRegisteredEvents,
  getRecommendedEvents,
  type RegisteredEvent,
} from "../api/registration";
import { useForm } from "react-hook-form";
import { showToast } from "../utils/toast";
import {
  Pencil,
  QrCode as QrCodeIcon,
  X,
  Settings,
  Plus,
  Copy,
  Zap,
} from "lucide-react";
import LiquidGlassCard from "../components/liquidglass/LiquidGlassCard";
import InfiniteScroll from "../components/InfiniteScroll";
import QRCode from "react-qr-code";
import { useTask } from "../hooks/useTask";
import SettingsPopup from "../components/profile/SettingsPopup";
import SEO from "../components/SEO";
import { useUploadThing } from "../utils/uploadthing";
import { compressImage } from "../utils/compression";
import EventCard from "../components/events/EventCard";
import UpgradePassModal from "../components/profile/UpgradePassModal";

const HARDCODED_AVATARS = [
  "https://9ec732lutu.ufs.sh/f/aVR2JOdkpmeKNSykpbjeo7aBRk9WNnV4EIZsAMfugzJxGQPd",
  "https://9ec732lutu.ufs.sh/f/aVR2JOdkpmeKQAA9sIwUnsapVqcXgArT5DSFdZihWOe1Qfb3",
];

function toSlug(event: PublicEvent) {
  const base = event.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${event.id}`;
}

function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { completeTask } = useTask();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showUpgradePass, setShowUpgradePass] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("userProfileImage");

  const [showQRCode, setShowQRCode] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const profileQueryFn: QueryFunction<MeResponse> = () => {
    return fetchMe();
  };

  const profileQuery = useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: profileQueryFn,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const user = profileQuery.data?.user;
  const userName = profileQuery.isLoading
    ? "Loading..."
    : (user?.name ?? user?.email ?? "User");
  const userProfileImage = user?.profileImage;

  const { data: publishedEventsData, isLoading: isEventsLoading } = useQuery({
    queryKey: ["published-events"],
    queryFn: fetchPublishedEvents,
  });

  const allEvents = useMemo(
    () => publishedEventsData?.events || [],
    [publishedEventsData],
  );

  const myEventsQuery = useQuery<RegisteredEvent[]>({
    queryKey: ["my-registrations"],
    queryFn: getMyRegisteredEvents,
  });

  const recommendedEventsQuery = useQuery<RegisteredEvent[]>({
    queryKey: ["recommendations"],
    queryFn: getRecommendedEvents,
    staleTime: 0, // Ensure fresh random recommendations on every mount
    gcTime: 0, // Don't cache the result
  });

  const myPublicEvents = useMemo(() => {
    if (!myEventsQuery.data || !allEvents.length) return [];
    return myEventsQuery.data
      .map((reg) => allEvents.find((e) => e.id === reg.eventId))
      .filter((e): e is PublicEvent => !!e);
  }, [myEventsQuery.data, allEvents]);

  const recommendedPublicEvents = useMemo(() => {
    if (!recommendedEventsQuery.data || !allEvents.length) return [];
    return recommendedEventsQuery.data
      .map((rec) => allEvents.find((e) => e.id === rec.eventId))
      .filter((e): e is PublicEvent => !!e);
  }, [recommendedEventsQuery.data, allEvents]);

  const leaderboardQuery = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: config } = useQuery({
    queryKey: ["registration-config"],
    queryFn: fetchRegistrationConfig,
  });

  const showLeaderboard = config?.showLeaderboard ?? false;
  const isSpotRegistration = config?.isSpotRegistration ?? false;

  const rank = leaderboardQuery.data?.currentUser?.rank;

  const { data: taskStatus } = useQuery({
    queryKey: ["taskStatus", user?.id],
    queryFn: getTaskStatus,
    enabled: !!user?.pid,
  });

  useEffect(() => {
    if (profileQuery.isError) {
      void navigate("/login");
    }
  }, [profileQuery.isError, navigate]);

  const form = useForm<ChangePasswordPayload>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const changePasswordMutationFn: MutationFunction<
    ChangePasswordResponse,
    ChangePasswordPayload
  > = (payload) => {
    return changePassword(payload);
  };

  const changePasswordMutation = useMutation<
    ChangePasswordResponse,
    Error,
    ChangePasswordPayload
  >({
    mutationFn: changePasswordMutationFn,
    onSuccess: () => {
      form.reset();
      showToast("Password updated successfully", "success");
      setShowChangePassword(false);
    },
  });

  const onSubmit = form.handleSubmit((values) =>
    changePasswordMutation.mutate(values),
  );

  const handleCloseModal = () => {
    setShowChangePassword(false);
    setShowEditProfile(false);
    setEditFullName("");
    setSelectedAvatar(null);
    setCustomImage(null);
    setPreviewUrl(null);
    form.reset();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];

      try {
        if (file.size > 1 * 1024 * 1024) {
          showToast("Compressing image...", "info");
          file = await compressImage(file, 1); // Compress to 1MB
        }

        setCustomImage(file);
        setSelectedAvatar(null);

        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Image compression failed:", error);
        showToast("Failed to process image", "error");
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!editFullName.trim()) {
      showToast("Full name cannot be empty", "error");
      return;
    }

    setIsUploading(true);
    try {
      let finalProfileImage = user?.profileImage;

      if (customImage) {
        // Upload custom image
        const uploadRes = await startUpload([customImage]);
        if (uploadRes && uploadRes[0]) {
          finalProfileImage = uploadRes[0].ufsUrl;
        } else {
          console.error("Upload result invalid:", uploadRes);
          throw new Error("Failed to upload image: No URL returned");
        }
      } else if (selectedAvatar) {
        // Use selected hardcoded avatar
        finalProfileImage = selectedAvatar;
      }

      const updatedUserResponse = await updateProfile({
        name: editFullName,
        profileImage: finalProfileImage,
      });

      // Update the cache with the server response
      queryClient.setQueryData<MeResponse>(["me"], (old) => {
        if (!old) return old;
        return {
          ...old,
          user: {
            ...old.user,
            ...updatedUserResponse.user,
          },
        };
      });

      showToast("Profile updated successfully", "success");
      handleCloseModal();
      void profileQuery.refetch();
    } catch (error) {
      console.error("Profile update error:", error);
      if (error instanceof Error) {
        showToast(error.message, "error");
      } else {
        showToast("Failed to update profile", "error");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-full overflow-x-hidden touch-pan-y">
      <SEO title="My Profile" url="/profile" />
      <div className="fixed inset-0 bg-black/40 -z-10 pointer-events-none"></div>
      <section className="flex flex-col items-center justify-start pb-10 overflow-x-hidden">
        {}
        <div className="w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[85%] 2xl:max-w-7xl mt-4 px-2.5 sm:px-4">
          <div className="relative flex w-full gap-4 items-start flex-col xl:flex-row">
            <LiquidGlassCard className="p-3.5 sm:p-4 lg:p-6 rounded-3xl w-full xl:flex-[0_0_33%]">
              <div className="relative flex flex-col items-center gap-3">
                {/* Settings Button - Top Left */}
                <button
                  className="cursor-target absolute top-0 left-0 p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110 group z-20"
                  title="Settings"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="w-5 h-5 text-slate-200 group-hover:text-white" />
                </button>

                {/* Edit Profile Button - Top Right */}
                <button
                  onClick={() => {
                    setEditFullName(userName);
                    setShowEditProfile(true);
                  }}
                  className="cursor-target absolute top-0 right-0 z-20 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110 group"
                  title="Edit profile"
                >
                  <Pencil className="w-4 h-4 text-slate-200 group-hover:text-white" />
                </button>

                {/* Profile Picture */}
                <div className="relative flex items-center justify-center mt-5 sm:mt-6">
                  <div
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-linear-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-xl transition-transform duration-500 overflow-hidden ${
                      isRotating ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    {userProfileImage ? (
                      <img
                        src={userProfileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : (
                      <span className="text-5xl text-slate-800 font-moco font-bold">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {user?.pid && (
                    <button
                      onClick={() => {
                        setIsRotating(true);
                        const isCompleted = user?.completedTasks?.some(
                          (t) =>
                            t.taskKey === "e2n7z4w6" || t.taskId === "e2n7z4w6",
                        );
                        const isActive =
                          taskStatus?.status === "ACTIVE" &&
                          taskStatus?.task?.key === "e2n7z4w6";

                        if (user?.pid && !isCompleted && isActive) {
                          void completeTask("e2n7z4w6");
                        }
                        setTimeout(() => {
                          setShowQRCode(true);
                          setIsRotating(false);
                        }, 500);
                      }}
                      className="cursor-target absolute -bottom-1 -right-1 w-9 h-9 rounded-lg bg-white/10 border border-white/25 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-110 shadow-lg"
                      title="Show QR Code"
                    >
                      <QrCodeIcon className="w-5 h-5 text-slate-200" />
                    </button>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="text-center space-y-1.5 w-full flex flex-col items-center">
                <h2 className="text-2xl sm:text-3xl text-slate-50 font-moco font-bold wrap-break-word max-w-full px-2">
                  {userName}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 max-w-[95%] leading-snug wrap-break-word line-clamp-2">
                  {user?.college ?? "No College Info"}
                </p>

                <button
                  onClick={() => {
                    if (user?.pid) {
                      void navigator.clipboard.writeText(user.pid);
                      showToast("PID copied to clipboard", "success");
                    }
                  }}
                  className={`group relative flex items-center justify-center gap-2 mt-2 text-white px-4 py-2 rounded-lg transition-all ${user?.pid ? "hover:bg-white/5 cursor-pointer" : "cursor-default"}`}
                  title={user?.pid ? "Click to copy PID" : "PID Not Generated"}
                >
                  <span className="text-slate-500 font-mono text-xs font-bold uppercase tracking-wider group-hover:text-slate-400 transition-colors">
                    PID
                  </span>
                  <span className="text-xl sm:text-2xl font-moco font-bold text-white transition-all tracking-widest leading-none">
                    {user?.pid ?? "No PID"}
                  </span>
                  {user?.pid && (
                    <Copy className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors ml-1" />
                  )}
                </button>

                <div className="flex flex-col pt-1 items-center gap-3 mt-2">
                  <p className="text-base sm:text-sm text-amber-400 font-bold">
                    {rank
                      ? `Ranked #${rank} on the leaderboard`
                      : "Complete your profile to rank"}
                  </p>
                  {showLeaderboard && (
                    <Link
                      to="/leaderboard"
                      className="cursor-pointer group flex items-center justify-center gap-2 px-5 sm:px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-sky-300 text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg w-full max-w-55"
                    >
                      Go to Leaderboard
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </Link>
                  )}
                  {user?.regType === "EVENTS_ONLY" && (
                    <button
                      onClick={() => setShowUpgradePass(true)}
                      className="cursor-pointer group flex flex-col items-center justify-center py-2.5 mt-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20 w-full max-w-55"
                    >
                      <div className="flex items-center gap-1.5 text-xs opacity-90 mb-0.5 uppercase tracking-widest">
                        <Zap className="w-3 h-3 fill-amber-400" />
                        Upgrade to
                      </div>
                      <div className="text-sm font-moco font-bold tracking-wider">
                        Dimensional Pass
                      </div>
                    </button>
                  )}
                </div>

                {/* <Link
                    to="/leaderboard"
                    className="cursor-target group flex items-center justify-center gap-2 px-6 py-3 mt-4 w-full max-w-[230px] rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-sky-300 text-base sm:text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Open Leaderboard
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link> */}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 justify-center items-center w-full mt-4 mb-2">
                {/* <button
                    className="cursor-target px-6 py-2 card text-white font-medium rounded-3xl transition-all duration-200 w-full max-w-xs hover:opacity-80 active:opacity-60"
                    type="button"
                    onClick={() => {
                      setShowChangePassword(true);
                    }}
                  >
                    Change password
                  </button>*/}
                {/*<button
                    className="cursor-target px-6 py-2 card text-white font-medium rounded-3xl transition-all duration-200 w-full max-w-xs hover:opacity-80 active:opacity-60"
                    type="button"
                    onClick={() => {
                      void handleLogout();
                    }}
                  >
                    Logout
                  </button>*/}
              </div>
            </LiquidGlassCard>

            {}
            <LiquidGlassCard className="p-3.5 sm:p-4 lg:p-5 rounded-3xl w-full xl:absolute xl:top-0 xl:bottom-0 xl:right-0 xl:w-[calc(67%-1rem)] overflow-y-auto scrollbar-hide">
              <div className="grid gap-4 xl:grid-rows-[auto_auto] overflow-hidden">
                {}
                <div className="flex flex-col overflow-hidden">
                  <div className="flex justify-center mb-4 mt-2 w-full">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white text-center w-full font-moco font-bold">
                      MY MISSIONS
                    </h2>
                  </div>
                  {myEventsQuery.isLoading || isEventsLoading ? (
                    <div className="flex justify-center py-10">
                      <p className="text-base sm:text-sm text-slate-400 font-moco animate-pulse">
                        Loading missions...
                      </p>
                    </div>
                  ) : myPublicEvents.length > 0 ? (
                    <InfiniteScroll
                      items={myPublicEvents.map((event, index) => (
                        <RouterLink
                          to={`/events/${toSlug(event)}`}
                          key={`${event.id}-${index}`}
                          className="w-full flex justify-center"
                        >
                          <EventCard event={event} index={index} />
                        </RouterLink>
                      ))}
                      speed="normal"
                      gap="gap-4"
                      itemWidth="w-[240px]"
                      pauseOnHover={true}
                      autoScroll={false}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-8 px-4 text-center">
                      <p className="text-base sm:text-sm text-slate-300 font-medium">
                        You have not registered for any events yet.
                      </p>
                      <Link
                        to="/events"
                        className="cursor-target px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:brightness-95 text-white font-semibold rounded-3xl transition-all duration-200 shadow-lg hover:shadow-amber-500/20"
                      >
                        Go to Events
                      </Link>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 my-3"></div>

                {/* Recommended Missions */}
                <div className="flex flex-col overflow-hidden">
                  <div className="flex justify-center mb-4 mt-2 w-full">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white text-center w-full font-moco font-bold">
                      RECOMMENDED MISSIONS
                    </h2>
                  </div>
                  {recommendedEventsQuery.isLoading || isEventsLoading ? (
                    <div className="flex justify-center py-10">
                      <p className="text-slate-400 font-moco animate-pulse">
                        Loading recommendations...
                      </p>
                    </div>
                  ) : recommendedPublicEvents.length > 0 ? (
                    <InfiniteScroll
                      items={recommendedPublicEvents.map((event, index) => (
                        <RouterLink
                          to={`/events/${toSlug(event)}`}
                          key={`${event.id}-${index}`}
                          className="w-full flex justify-center"
                        >
                          <EventCard event={event} index={index} />
                        </RouterLink>
                      ))}
                      speed="normal"
                      gap="gap-4"
                      itemWidth="w-full sm:w-[240px]"
                      pauseOnHover={true}
                      autoScroll={false}
                    />
                  ) : (
                    <div className="flex justify-center py-10">
                      <p className="text-slate-400 font-moco">
                        No recommendations available at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </LiquidGlassCard>
          </div>
        </div>

        {showQRCode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-2 sm:p-1.5 backdrop-blur">
            <LiquidGlassCard
              className="
                w-[94%]! sm:w-[70%]! md:w-[45%]! lg:w-[25%]!
                max-w-[94%]! sm:max-w-[70%]! md:max-w-[45%]! lg:max-w-[25%]!
                flex-none space-y-6 md:space-y-8 px-5 sm:px-8 md:px-10 py-6 sm:py-8 md:py-9 rounded-3xl
              "
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="pt-1">
                  <h3 className="text-xl sm:text-lg text-slate-50 pl-0.5 font-moco font-bold">
                    QR Code
                  </h3>
                </div>
                <button
                  type="button"
                  className="cursor-target text-slate-300 hover:text-sky-300 p-1 hover:bg-white/10 rounded transition-colors"
                  onClick={() => setShowQRCode(false)}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col items-center space-y-5 md:space-y-7 pb-1">
                {}
                <div className="bg-white rounded-2xl p-3 sm:p-4 flex items-center justify-center shadow-inner overflow-hidden w-full max-w-65 sm:max-w-none">
                  <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                    {user?.pid ? (
                      <QRCode
                        value={user.pid}
                        size={256}
                        style={{
                          height: "auto",
                          maxWidth: "100%",
                          width: "100%",
                        }}
                        viewBox={`0 0 256 256`}
                      />
                    ) : (
                      <QrCodeIcon className="w-32 h-32 text-slate-400" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-400 text-center pb-1 font-moco">
                  Scan this QR code
                </p>
              </div>
            </LiquidGlassCard>
          </div>
        )}

        {showEditProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-2 sm:p-1.5 backdrop-blur">
            <LiquidGlassCard
              className="
                w-10/12! sm:w-[70%]! md:w-[45%]! lg:w-[25%]!
                max-w-10/12! sm:max-w-[70%]! md:max-w-[45%]! lg:max-w-[25%]!
                flex-none space-y-3 sm:space-y-6 px-3.5 sm:px-8 md:px-10 py-3.5 sm:py-7 md:py-8 rounded-3xl
              "
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="pt-1">
                  <h3 className="text-xl sm:text-lg text-slate-50 pl-1 font-moco font-bold">
                    Edit profile
                  </h3>
                </div>
                <button
                  type="button"
                  className="cursor-target text-slate-300 hover:text-sky-300 p-1 hover:bg-white/10 rounded transition-colors"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-slate-500 shadow-lg group">
                    {previewUrl || selectedAvatar || user?.profileImage ? (
                      <img
                        src={
                          previewUrl ??
                          selectedAvatar ??
                          user?.profileImage ??
                          ""
                        }
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                        <span className="text-3xl text-slate-300 font-bold">
                          {editFullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <div className="text-white text-xs font-semibold text-center px-1">
                        Upload Custom
                      </div>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <p className="text-xs sm:text-sm text-slate-400 mb-1.5 sm:mb-2 font-moco">
                      Choose Profile
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                      {HARDCODED_AVATARS.map((avatar, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedAvatar(avatar);
                            setCustomImage(null);
                            setPreviewUrl(null);
                          }}
                          className={`relative rounded-full overflow-hidden aspect-square border-2 transition-all ${
                            selectedAvatar === avatar
                              ? "border-amber-500 scale-110 shadow-amber-500/20 shadow-lg"
                              : "border-transparent hover:border-white/30"
                          }`}
                        >
                          <img
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            className="w-full h-full object-cover"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          document.getElementById("avatar-upload")?.click()
                        }
                        className="relative rounded-full overflow-hidden aspect-square border-2 border-dashed border-slate-500 hover:border-slate-300 flex items-center justify-center transition-all bg-white/5 hover:bg-white/10 group/upload"
                        title="Upload Custom Image"
                      >
                        <Plus className="w-5 h-5 text-slate-400 group-hover/upload:text-white transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-0.5 sm:pt-1">
                  {/* Commented out the username editing */}
                  {/* <input
                      id="fullName"
                      type="text"
                      className="w-full px-4! py-2.5 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-moco"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      placeholder="Enter your full name"
                    /> */}
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2.5 sm:gap-4 pb-2 sm:pb-3">
                  <button
                    className="cursor-target w-full sm:w-auto px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-3xl transition-all duration-200 min-w-34 shadow-lg hover:shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    type="button"
                    onClick={() => {
                      void handleSaveProfile();
                    }}
                    disabled={isUploading}
                  >
                    {isUploading ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="cursor-target w-full sm:w-auto px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-3xl transition-colors duration-200 min-w-34"
                    type="button"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </LiquidGlassCard>
          </div>
        )}

        {showChangePassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-2 sm:p-1.5 backdrop-blur">
            <LiquidGlassCard
              className="
                w-[94%]! sm:w-[70%]! md:w-[45%]! lg:w-[25%]!
                max-w-[94%]! sm:max-w-[70%]! md:max-w-[45%]! lg:max-w-[25%]!
                flex-none space-y-6 sm:space-y-8 px-5 sm:px-7 md:px-9 py-6 sm:py-8 md:py-9 rounded-3xl
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div className="pt-0.5 pl-0.5">
                  <h3 className="text-lg text-slate-50 font-moco font-bold">
                    Change password
                  </h3>
                </div>
                <button
                  type="button"
                  className="cursor-target text-slate-300 hover:text-sky-300 p-1 hover:bg-white/10 rounded transition-colors"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                className="space-y-7 pt-2"
                onSubmit={(event) => void onSubmit(event)}
              >
                <div className="space-y-1.5">
                  <label
                    className="label text-base sm:text-sm text-slate-200 block px-5 md:px-6 font-moco font-bold"
                    htmlFor="currentPassword"
                  >
                    Current password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    className={`w-full px-5 md:px-6 py-2.5 md:py-3 leading-tight bg-linear-to-b from-slate-600/30 to-slate-700/30 shadow-inner rounded-full text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:from-slate-600/50 focus:to-slate-700/50 transition-all duration-200 ${form.formState.errors.currentPassword ? "ring-2 ring-rose-500/50" : ""}`}
                    {...form.register("currentPassword", {
                      required: "Current password is required",
                    })}
                    placeholder="Enter your current password"
                  />
                  {form.formState.errors.currentPassword && (
                    <p className="text-sm sm:text-xs text-rose-300 px-6">
                      {form.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label
                    className="label text-sm text-slate-200 block px-5 md:px-6 font-moco font-bold"
                    htmlFor="newPassword"
                  >
                    New password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className={`w-full px-5 md:px-6 py-2.5 md:py-3 leading-tight bg-linear-to-b from-slate-600/30 to-slate-700/30 shadow-inner rounded-full text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:from-slate-600/50 focus:to-slate-700/50 transition-all duration-200 ${form.formState.errors.newPassword ? "ring-2 ring-rose-500/50" : ""}`}
                    {...form.register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    placeholder="Create a new password"
                  />
                  {form.formState.errors.newPassword && (
                    <p className="text-xs text-rose-300 px-6">
                      {form.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label
                    className="label text-sm text-slate-200 block px-5 md:px-6 font-moco font-bold"
                    htmlFor="confirmNewPassword"
                  >
                    Confirm new password
                  </label>
                  <input
                    id="confirmNewPassword"
                    type="password"
                    className={`w-full px-5 md:px-6 py-2.5 md:py-3 leading-tight bg-linear-to-b from-slate-600/30 to-slate-700/30 shadow-inner rounded-full text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:from-slate-600/50 focus:to-slate-700/50 transition-all duration-200 ${form.formState.errors.confirmNewPassword ? "ring-2 ring-rose-500/50" : ""}`}
                    {...form.register("confirmNewPassword", {
                      required: "Please confirm your password",
                      validate: (val) => {
                        if (form.watch("newPassword") !== val) {
                          return "Your passwords do no match";
                        }
                      },
                    })}
                    placeholder="Confirm your new password"
                  />
                  {form.formState.errors.confirmNewPassword && (
                    <p className="text-xs text-rose-300 px-6">
                      {form.formState.errors.confirmNewPassword.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3">
                  <button
                    className="cursor-target w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:brightness-95 text-white font-semibold rounded-3xl transition-all duration-200 min-w-36 shadow-lg hover:shadow-amber-500/20"
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending
                      ? "Updating…"
                      : "Update password"}
                  </button>
                  <button
                    className="cursor-target w-full sm:w-auto px-6 py-2.5 bg-slate-600/40 hover:bg-slate-600/60 text-slate-100 font-semibold rounded-3xl transition-all duration-200 min-w-36"
                    type="button"
                    onClick={handleCloseModal}
                    disabled={changePasswordMutation.isPending}
                  >
                    Cancel
                  </button>
                </div>
                {changePasswordMutation.isError && (
                  <p className="text-sm text-rose-300 pt-1 font-moco">
                    {changePasswordMutation.error instanceof Error
                      ? changePasswordMutation.error.message
                      : "Failed to update password."}
                  </p>
                )}
              </form>
            </LiquidGlassCard>
          </div>
        )}

        {showSettings && (
          <SettingsPopup onClose={() => setShowSettings(false)} />
        )}

        {showUpgradePass && user && (
          <UpgradePassModal
            onClose={() => setShowUpgradePass(false)}
            userId={user.id}
            category={user.category}
            collegeId={user.collegeId}
            isSpotRegistration={isSpotRegistration}
          />
        )}
      </section>
    </div>
  );
}

export default ProfilePage;

import { useQuery } from "@apollo/client";
import { Bed, LogOut, QrCode, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaAward } from "react-icons/fa";

import { Button } from "~/components/button/button";
import { CONSTANT } from "~/constants";
import {
  GetUserXpDocument,
  GetXpLeaderboardDocument,
} from "~/generated/generated";
import { AuthStatus, useAuth } from "~/hooks/useAuth";

const techTeamPid = CONSTANT.PID.TECH_TEAM;

function LeaderBoard({
  setQr,
  isShowQr,
}: {
  setQr: () => void;
  isShowQr: boolean;
}) {
  const router = useRouter();
  const session = useAuth();

  const [level, setLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [userId, setUser] = useState("");
  const [rank, setRank] = useState(0);
  const [progress, setProgress] = useState(0);
  const [needMneedMoreore, setNeedMore] = useState(0);

  const userXp = useQuery(GetUserXpDocument, {});

  useEffect(() => {
    if (
      userXp?.data &&
      userXp.data.getUserXp.__typename === "QueryGetUserXpSuccess"
    ) {
      const totalXp = userXp.data.getUserXp?.data?.reduce((acc, curr) => {
        if (
          techTeamPid.includes(parseInt(curr.user.id)) &&
          parseInt(curr.level.id) <= 6
        )
          return acc;
        return acc + curr.level.point;
      }, 0);

      // Calculate the level thresholds dynamically
      const levels = userXp.data.getUserXp?.data?.length || 0;
      const newLevelThresholds = Array.from(
        { length: levels + 1 },
        (_, i) => (i + 1) * 10,
      );
      // Calculate the user's current level based on the thresholds
      let level = 1;
      let totalPoints = 0;
      let levelPoints = 0;

      for (const threshold of newLevelThresholds) {
        totalPoints += threshold;
        levelPoints = threshold;
        if (totalXp >= threshold) {
          level++;
        } else {
          break;
        }
      }
      setLevel(level);
      setXp(totalXp);
      if (userXp.data.getUserXp.data[0])
        setUser(userXp.data.getUserXp.data[0].user.id);
      console.log(totalPoints, totalXp, newLevelThresholds);

      setNeedMore(totalPoints - totalXp);
      setProgress(((levelPoints - totalPoints + totalXp) / levelPoints) * 100);
    }
    console.log("Progress : ", progress);
  }, [userXp.data]);

  type UserTotalPoints = {
    [userId: string]: {
      levelPoints: number;
      name: string;
      count: number;
      createdAt: Date;
    };
  };
  const { data: Leaderboard } = useQuery(GetXpLeaderboardDocument, {});

  useEffect(() => {
    if (
      Leaderboard?.getXpLeaderboard.__typename ===
      "QueryGetXpLeaderboardSuccess"
    ) {
      const userTotalPoints: UserTotalPoints = {};

      Leaderboard?.getXpLeaderboard.data.forEach((item) => {
        const userId = item.user.id;
        const levelPoints = item.level.point;
        const userName = item.user.name;
        const levelCount = 1;
        const createdAt = item.createdAt;

        // Check if the user ID is already in the userTotalPoints object
        if (userTotalPoints[userId]) {
          // If yes, add the level points to the existing total
          userTotalPoints[userId].levelPoints += levelPoints;
          userTotalPoints[userId].count += levelCount;
          //store only the latest date
          if (createdAt > userTotalPoints[userId].createdAt) {
            userTotalPoints[userId].createdAt = createdAt;
          }
        } else {
          if (
            techTeamPid.includes(parseInt(userId)) &&
            parseInt(item.level.id) <= 6
          )
            return;
          // If no, create a new entry for the user ID
          userTotalPoints[userId] = {
            levelPoints,
            name: userName,
            count: 1,
            createdAt: createdAt,
          };
        }
      });
      // Convert userTotalPoints to an array of objects
      const userTotalPointsArray = Object.entries(userTotalPoints).map(
        ([userId, data]) => ({
          userId,
          ...data,
        }),
      );
      // Sort the array in descending order based on total points
      userTotalPointsArray.sort((a, b) => b.levelPoints - a.levelPoints);
      //also sort based on the latest date but points should be primary
      userTotalPointsArray.sort((a, b) => {
        if (a.levelPoints === b.levelPoints) {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        return b.levelPoints - a.levelPoints;
      });
      const currentUserRank = userTotalPointsArray.findIndex(
        (item) => item.userId === userId,
      );
      setRank(currentUserRank + 1);
    }
  }, [Leaderboard, userId]);

  return (
    <div className="row-span-1 flex w-full flex-col items-center justify-evenly gap-2 border-t-2 border-secondary-500/50 p-2">
      <div className="flex w-full max-w-sm flex-col flex-nowrap items-center justify-between gap-2 sm:max-w-full sm:flex-row md:flex-col xl:flex-row">
        <Button
          className="w-full max-w-sm text-white hover:scale-[105%] hover:bg-primary-800/60 hover:text-white sm:max-w-full"
          variant={"outline"}
          onClick={() => setQr()}
        >
          {!isShowQr ? (
            <>
              <QrCode className="stroke-secondary-200" />
              Show QR
            </>
          ) : (
            <>
              <User className="stroke-secondary-200" />
              Show Name
            </>
          )}
        </Button>
        <Button
          variant={"destructive"}
          className="w-full hover:scale-[105%]"
          onClick={async () => {
            toast.loading("Logging out...");
            await signOut();
            toast.success("Logged out successfully");
          }}
        >
          Log out <LogOut />
        </Button>
      </div>
      <div className="relative mt-2 h-fit w-full overflow-hidden rounded-xl border-2 border-secondary-500/50">
        <div
          className={`h-2 bg-amber-600`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="mb-2 w-full px-2 text-white">
        <div className="mx-auto mb-4 flex w-full max-w-md flex-row justify-between px-4">
          <div className="text-sm font-semibold">
            Domain{" "}
            <span className="text-base font-bold text-secondary-500">
              {level} 🗺
            </span>
          </div>
          <div className="text-sm font-semibold">
            Timestones{" "}
            <span className="text-base font-bold text-secondary-500">
              {xp} 💎
            </span>
          </div>
        </div>

        {rank === 0 ? (
          <>
            <div className="my-2 text-center text-sm opacity-90">
              You need to collect {needMneedMoreore} 💎 TimeStones to join the
              leaderboard
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex max-w-md flex-row items-center justify-between rounded-full border border-secondary-500 bg-primary-500/20 px-4 py-2">
              <div className="flex flex-row flex-nowrap gap-1 text-sm font-semibold">
                <Image
                  className="size-10"
                  src={CONSTANT.ASSETS.PROFILE.TROPHY}
                  alt="trophy"
                  width={100}
                  height={100}
                />
                <div>
                  <p>Leaderboard</p>
                  <p className="text-accent-400">Rank {rank}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm font-semibold">
                <p>You need</p>
                <p>
                  <span className="text-accent-400">{needMneedMoreore}</span> 💎
                  more
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        {/* TODO: Move component to the top */}
        {/* <div className="w-full flex xl:flex-row md:flex-col sm:flex-row flex-col justify-between items-center flex-nowrap gap-2 sm:max-w-full max-w-sm">
          <Button
            className="w-full hover:scale-[105%] hover:bg-primary-800/60 text-white hover:text-white sm:max-w-full max-w-sm"
            variant={"outline"}
            onClick={() => setQr()}
          >
            {!isShowQr ?(
              <>
                <QrCode className="stroke-secondary-200" />
                Show QR
              </>
            )
            :(<>
            <User className="stroke-secondary-200" />
            Show Name
            </>)
          }
          </Button>
          <Button
            variant={"destructive"}
            className="w-full hover:scale-[105%]"
            onClick={async () => {
              await signOut();
            }}
          >
            Log out <LogOut />
          </Button>
        </div> */}

        <div className="flex w-full max-w-sm flex-col flex-nowrap items-center justify-between gap-2 sm:max-w-full sm:flex-row md:flex-col xl:flex-row">
          <Button
            onClick={() => router.push("/leaderboard")}
            className="w-full px-1"
          >
            <FaAward className="mr-1 inline-block" />
            Leaderboard
          </Button>

          {session.status === AuthStatus.AUTHENTICATED &&
            session.user.college &&
            session.user.college.id !== "1" && (
              <Button className="w-full px-1 py-2 hover:scale-[105%]" asChild>
                <Link href="/accommodation">
                  <Bed />
                  Accomodation
                </Link>
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;

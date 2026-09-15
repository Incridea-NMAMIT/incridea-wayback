import {
  Avatar,
  GetAvatarsDocument,
  MeDocument,
  UpdateProfileImageDocument,
} from "~/generated/generated";
import { useMutation, useQuery } from "@apollo/client";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/modal/modal"


type Props = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

const AvatarModal: React.FunctionComponent<Props> = ({
  showModal,
  setShowModal,
}) => {
  const [updateAvatarMutation] = useMutation(UpdateProfileImageDocument, {
    refetchQueries: [{ query: MeDocument }],
  });

  const data = useQuery(GetAvatarsDocument) || [];
  let avatarList: Avatar[] = [];
  if (data.loading === false && data.data !== undefined) {
    console.log(data.data.getAvatars);
    avatarList = data.data.getAvatars
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose your Avatar</DialogTitle>
          <div className="w-full h-full flex justify-center">
            <div className="max-h-[40vh] w-full grid md:grid-cols-2 grid-cols-1 m-4 bg-white/10 backdrop-filter backdrop-blur-lg bg-clip-padding rounded-lg p-2 items-center justify-center gap-2 overflow-y-scroll">
              {avatarList.map((avatar, index) => (
                <div
                  className="rounded-xl border border-primary-200/30 items-center justify-center flex h-full p-2 hover:bg-primary-200/20 transition-colors duration-300"
                  key={index}
                  onClick={async () => {
                    await updateAvatarMutation({
                      variables: {
                        imageURL: avatar.url,
                      },
                    });
                    setShowModal(false);
                  }}
                >
                  <Image
                    src={avatar.url}
                    alt={avatar.name}
                    className="h-[100px] cursor-pointer"
                    width={100}
                    height={100}
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarModal;

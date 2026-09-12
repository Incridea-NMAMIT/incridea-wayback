import { useMutation, useQuery } from "@apollo/client";
import Image from "next/image";

import Modal from "~/components/modal";
import {
  type Avatar,
  GetAvatarsDocument,
  MeDocument,
  UpdateProfileImageDocument,
} from "~/generated/generated";

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

  const { data, loading } = useQuery(GetAvatarsDocument) || [];
  let avatarList: Avatar[] = [];
  if (loading === false && data !== undefined) avatarList = data.getAvatars;

  return (
    <Modal
      showModal={showModal}
      onClose={() => setShowModal(false)}
      title={"Choose your avatar"}
      size="md"
    >
      <div className="flex h-full w-full justify-center">
        <div className="m-4 grid max-h-[40vh] w-full grid-cols-1 items-center justify-center gap-2 overflow-y-scroll rounded-lg bg-white/10 bg-clip-padding p-2 backdrop-blur-lg backdrop-filter md:grid-cols-2">
          {avatarList.map((avatar, index) => (
            <div
              className="flex h-full items-center justify-center rounded-xl border border-primary-200/30 p-2 transition-colors duration-300 hover:bg-primary-200/20"
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
    </Modal>
  );
};

export default AvatarModal;

import { useMutation, useQuery } from "@apollo/client";
import { Combobox, Transition } from "@headlessui/react";
import Link from "next/link";
import {
  useState,
  type FunctionComponent,
  type FormEventHandler,
  Fragment,
} from "react";
import { BsChevronExpand } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { TbArrowBackUp } from "react-icons/tb";

import Button from "~/components/button";
import ViewUserAccommodation from "~/components/general/profile/viewUserAccommodation";
import Spinner from "~/components/spinner";
import {
  AddAccommodationRequestDocument,
  AccommodationRequestsByUserDocument,
} from "~/generated/generated";
import { UploadButton } from "~/components/uploadthing/button";
import toast from "react-hot-toast";
import { CONSTANT } from "~/constants";

const AccommodationForm: FunctionComponent = () => {
  const [addAccommodation, { loading: emailVerificationLoading }] = useMutation(
    AddAccommodationRequestDocument,
    {
      refetchQueries: [AccommodationRequestsByUserDocument],
    },
  );

  const { data: accommodationData, loading: accommodationLoading } = useQuery(
    AccommodationRequestsByUserDocument,
  );

  const [uploading, setUploading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const genders = ["Male", "Female", "Other"];
  const [gender, setGender] = useState("");
  const [genderQuery, setGenderQuery] = useState("");

  const filteredGenders =
    genderQuery === ""
      ? genders
      : genders.filter((gender) => {
        return gender.toLowerCase().includes(genderQuery.toLowerCase());
      });

  const [accommodationInfo, setAccommodationInfo] = useState({
    hotelId: 1,
    gender: "",
    checkInTime: CONSTANT.DATE.ACCOMODATION.CHECK_IN_TIME,
    checkOutTime: CONSTANT.DATE.ACCOMODATION.CHECK_OUT_TIME,
    id: "",
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    addAccommodation({
      variables: accommodationInfo,
    }).catch(console.log);
    setFormSubmitted(true);
  };

  return (
    <>
      {showModal && (
        <ViewUserAccommodation
          inAccommodation={true}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      <div className="mb-4 mt-10 h-max min-w-[350px] max-w-[350px] rounded-md bg-primary-800 px-6 py-8 text-accent-200 transition-all ease-suck-in md:min-w-[450px] md:max-w-[450px]">
        {accommodationLoading ? (
          <div className="flex w-full flex-col md:flex-row">
            <Spinner className="text-[#dd5c6e]" intent={"white"} />
          </div>
        ) : formSubmitted ? (
          <div className="flex flex-col md:flex-row">
            <div className="flex justify-center">
              We will get back to you within 2 working days.
            </div>
            <Link
              href="/profile"
              className="flex w-full items-center justify-center"
            >
              <Button size={"small"} className="mt-3 w-max md:mt-0">
                <TbArrowBackUp />
                Go Back
              </Button>
            </Link>
          </div>
        ) : accommodationData?.accommodationRequestsByUser.__typename ===
          "QueryAccommodationRequestsByUserSuccess" &&
          accommodationData.accommodationRequestsByUser.data[0]?.status ? (
          <div className="flex flex-col md:flex-row">
            <div className="flex justify-center">
              We are processing your request. Please bear with us.
            </div>
            <Button
              onClick={() => {
                setShowModal(true);
              }}
              size={"small"}
              className="ml-3 mt-3 w-max self-center md:mt-0"
            >
              <IoEye />
              View Request
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`relative flex min-h-full flex-col justify-center gap-5 px-3 py-3`}
          >
            {(uploading || emailVerificationLoading) && (
              <div className="absolute inset-0 z-10 flex h-full w-full cursor-not-allowed flex-col rounded-lg bg-[#561e98]/80 md:flex-row">
                <Spinner className="text-[#dd5c6e]" intent={"white"} />
              </div>
            )}
            <p className="mb-3 text-center text-2xl font-semibold">
              Accommodation Request
            </p>
            <Combobox
              value={gender}
              onChange={(value) => {
                setAccommodationInfo((prev) => {
                  return { ...prev, gender: value?.toUpperCase() ?? "" };
                });
                setGender(value ?? "");
              }}
            >
              <div className="relative">
                <div className="relative w-full cursor-default overflow-hidden border-b border-gray-400 md:focus-within:border-[#dd5c6e] md:focus:border-[#dd5c6e]">
                  <Combobox.Input
                    required
                    placeholder="Gender"
                    displayValue={(gender: string) => {
                      return gender;
                    }}
                    className="w-full bg-transparent py-2 pl-1 pr-10 text-sm outline-none placeholder:text-slate-400 md:text-base"
                    onChange={(e) => setGenderQuery(e.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <BsChevronExpand
                      className="h-5 w-5 text-gray-100 md:text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setGenderQuery("")}
                >
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredGenders?.length === 0 && genderQuery !== "" ? (
                      <div className="relative select-none px-4 py-2 text-xs font-semibold text-gray-600 md:text-base">
                        Please select from dropdown
                      </div>
                    ) : (
                      filteredGenders?.map((gender) => (
                        <Combobox.Option
                          className={({ active }) =>
                            `relative cursor-pointer select-none px-4 py-2 text-xs md:text-base ${active
                              ? "bg-[#dd5c6e] text-white"
                              : "text-gray-900"
                            }`
                          }
                          key={gender}
                          value={gender}
                        >
                          {gender}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>

            <div>
              <label className="mb-2 block text-sm text-white">Upload ID</label>
              <UploadButton
                endpoint="accommodation"
                onUploadBegin={() => {
                  setUploading(true);
                }}
                onClientUploadComplete={(res: { url: string }[]) => {
                  if (res[0]) {
                    toast.success("Image uploaded", {
                      position: "bottom-right",
                    });
                    setAccommodationInfo((prevValue) => ({
                      ...prevValue,
                      id: res[0]!.url,
                    }));
                    setUploading(false);
                  }
                }}
                onUploadAborted={() => {
                  toast.error("Image upload aborted", {
                    position: "bottom-right",
                  });
                  setUploading(false);
                }}
                onUploadError={(error: Error) => {
                  console.log(error);
                  toast.error("Image upload failed", {
                    position: "bottom-right",
                  });
                  setUploading(false);
                }}
              />
            </div>

            <Button
              intent={"primary"}
              type="submit"
              className="mt-4 flex justify-center"
            >
              <MdModeEditOutline />
              Submit
            </Button>
            <h1 className="text-xs text-gray-100 md:text-sm">
              By clicking the above button, you agree to the mentioned terms and
              conditions
            </h1>
          </form>
        )}
      </div>
    </>
  );
};

export default AccommodationForm;

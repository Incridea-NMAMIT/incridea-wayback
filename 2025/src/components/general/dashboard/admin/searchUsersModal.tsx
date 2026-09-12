import { useQuery } from "@apollo/client";
import { useState, useEffect, useRef, useCallback } from "react";
import { RiUserSearchFill } from "react-icons/ri";

import Badge from "~/components/badge";
import Button from "~/components/button";
import Modal from "~/components/modal";
import SearchBox from "~/components/searchbox";
import Spinner from "~/components/spinner";
import { Role, SearchUsersDocument } from "~/generated/generated";

const SearchUsers = () => {
  const [showModal, setShowModal] = useState(false);

  // Search Users Query
  // Currently searched user
  const [name, setName] = useState<string>("");

  const {
    data: searchUsersData,
    loading: searchUsersLoading,
    fetchMore: searchUsersFetchMore,
  } = useQuery(SearchUsersDocument, {
    variables: {
      first: 10,
      contains: name,
    },
  });

  /* Infinite Scroll Logic */
  // Get pageInfo for infinite scroll
  const { endCursor, hasNextPage } = searchUsersData?.users.pageInfo ?? {};

  // Create a ref for the last item in the list
  const lastItemRef = useRef<HTMLDivElement>(null);

  // State to check if we're fetching more data
  const [isFetching, setIsFetching] = useState(false);

  /* Intersection Observer callback function
 (memoize the handleObserver to avoid triggering unnecessary re-renders,
 function will only be recreated if any of its dependencies change, and not on every render) */
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]!;
      if (target.isIntersecting && hasNextPage) {
        setIsFetching(true);
        void searchUsersFetchMore({
          variables: { after: endCursor },
          updateQuery: (prevResult, { fetchMoreResult }) => {
            fetchMoreResult.users.edges = [
              ...prevResult.users.edges,
              ...fetchMoreResult.users.edges,
            ];
            setIsFetching(false);
            return fetchMoreResult;
          },
        });
      }
    },
    [endCursor, hasNextPage, searchUsersFetchMore],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1 });

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    let currentRef = lastItemRef.current;

    // Observe changes to the lastItemRef.current value and update the observer accordingly, because initial value will be null
    const updateObserver = () => {
      if (currentRef !== lastItemRef.current) {
        if (currentRef) {
          observer.unobserve(currentRef);
        }

        if (lastItemRef.current) {
          observer.observe(lastItemRef.current);
          currentRef = lastItemRef.current;
        }
      }
    };

    const timeoutId = setInterval(updateObserver, 1000);

    // Return cleanup function that clears the intrval and disconnects observer.
    return () => {
      clearInterval(timeoutId);
      observer.disconnect();
    };
  }, [handleObserver, lastItemRef]);

  return (
    <>
      <Button
        intent={"info"}
        className="flex items-center justify-center gap-2"
        size={"medium"}
        onClick={() => setShowModal(true)}
      >
        <RiUserSearchFill />
        Users
      </Button>
      <Modal
        title="Search Users"
        showModal={showModal}
        onClose={() => setShowModal(false)}
      >
        {/* List of queried users */}
        <div className="basis-7/12 rounded-lg bg-gray-700 p-3">
          <SearchBox
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <div className="mr-4 mt-2 hidden h-10 items-center justify-between gap-2.5 rounded-t-lg bg-white bg-opacity-20 bg-clip-padding p-1 text-base font-bold backdrop-blur-lg backdrop-filter md:flex">
            <h1 className="basis-1/3 py-2.5 pl-2 text-start">PID</h1>
            <h1 className="basis-1/3 py-2.5 pr-5 text-center">User Name</h1>
            <h1 className="basis-1/3 py-2.5 pr-5 text-end">Role</h1>
          </div>
          <div className="mt-3 max-h-64 overflow-y-auto md:h-72 md:max-h-72">
            {searchUsersLoading && <Spinner size={"small"} />}
            {searchUsersData?.users?.edges.map((user, index) => (
              <div
                key={index}
                className="mb-2 mr-2 flex items-center justify-between rounded-lg border border-gray-500 p-1 px-2 md:p-2"
                ref={
                  index === searchUsersData.users.edges.length - 1
                    ? lastItemRef
                    : null
                }
              >
                <div className="flex w-full flex-row items-center justify-center">
                  <h1 className="basis-1/4 text-start text-sm md:text-xl">
                    {user?.node.id}
                  </h1>
                  <h1 className="flex basis-2/4 items-center justify-start text-center text-lg md:justify-center md:text-xl">
                    {user?.node.name}
                  </h1>
                  <h1 className="basis-1/4 text-end text-lg md:text-xl">
                    <Badge
                      color={
                        user?.node.role === Role.Admin
                          ? "success"
                          : user?.node.role === Role.User
                            ? "danger"
                            : user?.node.role === Role.Participant
                              ? "success"
                              : user?.node.role === Role.BranchRep
                                ? "info"
                                : user?.node.role === Role.Organizer
                                  ? "info"
                                  : user?.node.role === Role.Judge
                                    ? "info"
                                    : "danger"
                      }
                    >
                      {user?.node.role}
                    </Badge>
                  </h1>
                </div>
              </div>
            ))}
            {isFetching && <Spinner size={"small"} />}
            {!hasNextPage && !searchUsersLoading && (
              <p className="my-5 text-center text-gray-400">
                no more users to show
              </p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SearchUsers;

import LinkCard from "@/components/LinkCard";
import useCollectionStore from "@/store/collections";
import useLinkStore from "@/store/links";
import { CollectionIncludingMembersAndLinkCount, Sort } from "@/types/global";
import { faEllipsis, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import ProfilePhoto from "@/components/ProfilePhoto";
import SortDropdown from "@/components/SortDropdown";
import useModalStore from "@/store/modals";
import useLinks from "@/hooks/useLinks";
import usePermissions from "@/hooks/usePermissions";
import NoLinksFound from "@/components/NoLinksFound";
import useLocalSettingsStore from "@/store/localSettings";

export default function Index() {
  const { setModal } = useModalStore();

  const { settings } = useLocalSettingsStore();

  const router = useRouter();

  const { links } = useLinkStore();
  const { collections } = useCollectionStore();

  const [sortBy, setSortBy] = useState<Sort>(Sort.DateNewestFirst);

  const [activeCollection, setActiveCollection] =
    useState<CollectionIncludingMembersAndLinkCount>();

  const permissions = usePermissions(activeCollection?.id as number);

  useLinks({ collectionId: Number(router.query.id), sort: sortBy });

  useEffect(() => {
    setActiveCollection(
      collections.find((e) => e.id === Number(router.query.id))
    );
  }, [router, collections]);

  return (
    <MainLayout>
      <div className="p-5 flex flex-col gap-5 w-full h-full">
        <div
          style={{
            backgroundImage: `linear-gradient(-45deg, ${
              activeCollection?.color
            }30 10%, ${
              settings.theme === "dark" ? "#262626" : "#f3f4f6"
            } 50%, ${settings.theme === "dark" ? "#262626" : "#f9fafb"} 100%)`,
          }}
          className="border border-solid border-neutral-content rounded-2xl shadow min-h-[10rem] p-5 flex gap-5 flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-between sm:items-start">
            {activeCollection && (
              <div className="flex gap-3 items-center">
                <div className="flex gap-2">
                  <FontAwesomeIcon
                    icon={faFolder}
                    style={{ color: activeCollection?.color }}
                    className="sm:w-8 sm:h-8 w-6 h-6 mt-3 drop-shadow"
                  />
                  <p className="sm:text-4xl text-3xl capitalize w-full py-1 break-words hyphens-auto font-thin">
                    {activeCollection?.name}
                  </p>
                </div>
              </div>
            )}

            {activeCollection ? (
              <div
                className={`min-w-[15rem] ${
                  activeCollection.members[1] && "mr-3"
                }`}
              >
                <div
                  onClick={() =>
                    setModal({
                      modal: "COLLECTION",
                      state: true,
                      method: "UPDATE",
                      isOwner: permissions === true,
                      active: activeCollection,
                      defaultIndex: permissions === true ? 1 : 0,
                    })
                  }
                  className="hover:opacity-80 duration-100 flex justify-center sm:justify-end items-center w-fit sm:mr-0 sm:ml-auto cursor-pointer"
                >
                  {activeCollection?.members
                    .sort((a, b) => (a.userId as number) - (b.userId as number))
                    .map((e, i) => {
                      return (
                        <ProfilePhoto
                          key={i}
                          src={e.user.image ? e.user.image : undefined}
                          className={`${
                            activeCollection.members[1] && "-mr-3"
                          } border-[3px]`}
                        />
                      );
                    })
                    .slice(0, 4)}
                  {activeCollection?.members.length &&
                  activeCollection.members.length - 4 > 0 ? (
                    <div className="h-10 w-10 text-white flex items-center justify-center rounded-full border-[3px] bg-sky-600 dark:bg-sky-600 border-slate-200 -mr-3">
                      +{activeCollection?.members?.length - 4}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex justify-between items-end gap-5">
            <p>{activeCollection?.description}</p>
            <div className="flex items-center gap-2">
              <SortDropdown sortBy={sortBy} setSort={setSortBy} />
              <div className="relative">
                <div className="dropdown dropdown-bottom dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-sm btn-square text-neutral"
                  >
                    <FontAwesomeIcon
                      icon={faEllipsis}
                      title="More"
                      className="w-5 h-5"
                    />
                  </div>
                  <ul className="dropdown-content z-[30] menu p-1 shadow bg-base-200 border border-neutral-content rounded-xl w-44 mt-1">
                    {permissions === true ? (
                      <li>
                        <div
                          className="px-2 py-1 rounded-lg"
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            (document?.activeElement as HTMLElement)?.blur();
                            activeCollection &&
                              setModal({
                                modal: "COLLECTION",
                                state: true,
                                method: "UPDATE",
                                isOwner: permissions === true,
                                active: activeCollection,
                              });
                          }}
                        >
                          Edit Collection Info
                        </div>
                      </li>
                    ) : undefined}
                    <li>
                      <div
                        className="px-2 py-1 rounded-lg"
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          (document?.activeElement as HTMLElement)?.blur();
                          activeCollection &&
                            setModal({
                              modal: "COLLECTION",
                              state: true,
                              method: "UPDATE",
                              isOwner: permissions === true,
                              active: activeCollection,
                              defaultIndex: permissions === true ? 1 : 0,
                            });
                        }}
                      >
                        {permissions === true
                          ? "Share and Collaborate"
                          : "View Team"}
                      </div>
                    </li>
                    <li>
                      <div
                        className="px-2 py-1 rounded-lg"
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          (document?.activeElement as HTMLElement)?.blur();
                          activeCollection &&
                            setModal({
                              modal: "COLLECTION",
                              state: true,
                              method: "UPDATE",
                              isOwner: permissions === true,
                              active: activeCollection,
                              defaultIndex: permissions === true ? 2 : 1,
                            });
                        }}
                      >
                        {permissions === true
                          ? "Delete Collection"
                          : "Leave Collection"}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {links.some((e) => e.collectionId === Number(router.query.id)) ? (
          <div className="grid grid-cols-1 2xl:grid-cols-3 xl:grid-cols-2 gap-5">
            {links
              .filter((e) => e.collection.id === activeCollection?.id)
              .map((e, i) => {
                return <LinkCard key={i} link={e} count={i} />;
              })}
          </div>
        ) : (
          <NoLinksFound />
        )}
      </div>
    </MainLayout>
  );
}

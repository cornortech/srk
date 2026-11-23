"use client";

import { useRef, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@nextui-org/react";
import { Award, ExternalLink, ImagePlus, Trash2, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  contentRewardApi,
  formatDateKey,
  formatNepalDateTime,
  formatWeekRange,
  nepalDateKey,
  ordinalRank,
  TAdminWeek,
  TAdminWeekSubmission,
  TAdminWeekUser,
} from "../../lib/api/contentReward/contentReward.api";
import useAlert from "../../hooks/useAlert";
import ConfirmationModal from "../../components/admin/modal/ConfirmationModal";
import { platformMeta } from "../../lib/api/contentReward/platforms";
import {
  prepareImageDataUrl,
  UnreadableImageError,
} from "../../lib/kycImage";
import { getUniversityAssetUrl } from "../../lib/cdn";

// The most (in NRS) one leader can be rewarded
const MAX_REWARD_NRS = 500;

// Only the top three places are rewarded
const RANK_OPTIONS = [
  { key: "1", label: "1st place" },
  { key: "2", label: "2nd place" },
  { key: "3", label: "3rd place" },
];

const Links = ({ links }: { links: string[] }) => (
  <div className="flex flex-wrap gap-1.5">
    {links.map((link, i) => (
      <a
        key={i}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        title={link}
        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
      >
        Post {i + 1}
        <ExternalLink className="w-3 h-3" />
      </a>
    ))}
  </div>
);

const PlatformChip = ({ platform }: { platform: keyof typeof platformMeta }) => {
  const meta = platformMeta[platform];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.text}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {platform}
    </span>
  );
};

type TPicked = {
  week: TAdminWeek;
  user: TAdminWeekUser;
  submission: TAdminWeekSubmission;
};

export default function AdminContentRewards() {
  const { show } = useAlert();
  const queryClient = useQueryClient();

  // Weeks are Sunday - Saturday (Nepal). Any date inside a week selects the whole
  // week, so the default shows last week and this week.
  const [from, setFrom] = useState(nepalDateKey(-7));
  const [to, setTo] = useState(nepalDateKey(0));

  const [picked, setPicked] = useState<TPicked | null>(null);
  const [rank, setRank] = useState("1");
  const [postImage, setPostImage] = useState("");
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  // Photo being added to an already selected leader
  const leaderPhotoInputRef = useRef<HTMLInputElement>(null);
  const [photoLeaderId, setPhotoLeaderId] = useState<string | null>(null);

  const { data: weeks, isLoading: isLoadingWeeks } = useQuery({
    queryKey: ["contentSubmissionsByWeek", from, to],
    queryFn: () =>
      contentRewardApi.getSubmissionsByWeek({
        from: from || undefined,
        to: to || undefined,
      }),
  });

  const { data: leaders } = useQuery({
    queryKey: ["contentLeadersAdmin"],
    queryFn: contentRewardApi.getLeadersForAdmin,
  });

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["contentSubmissionsByWeek"] });
    queryClient.invalidateQueries({ queryKey: ["contentLeadersAdmin"] });
  };

  const { mutate: selectLeader, isPending: isSelecting } = useMutation({
    mutationFn: contentRewardApi.selectLeader,
    onSuccess: () => {
      show("Leader selected", "success");
      setPicked(null);
      refreshAll();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data.message || "Failed to select leader", "error");
    },
  });

  const { mutate: saveLeaderPhoto, isPending: isSavingPhoto } = useMutation({
    mutationFn: ({ id, image }: { id: string; image: string }) =>
      contentRewardApi.setLeaderImage(id, image),
    onSuccess: () => {
      show("Photo saved", "success");
      refreshAll();
      queryClient.invalidateQueries({ queryKey: ["contentLeaderboard"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data.message || "Failed to save photo", "error");
    },
  });

  const { mutate: removeLeader } = useMutation({
    mutationFn: contentRewardApi.removeLeader,
    onSuccess: () => {
      show("Leader removed", "success");
      refreshAll();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data.message || "Failed to remove leader", "error");
    },
  });

  const takenRanks = (week: TAdminWeek) =>
    new Set(week.leaders.map((l) => l.rank));

  const openPicker = (
    week: TAdminWeek,
    user: TAdminWeekUser,
    submission: TAdminWeekSubmission
  ) => {
    const taken = takenRanks(week);
    // Start on the first place that is still free
    const firstFree = [1, 2, 3].find((r) => !taken.has(r)) ?? 1;
    setPicked({ week, user, submission });
    setRank(String(firstFree));
    setPostImage("");
    setImageError("");
    setIsPreparingImage(false);
    setRewardAmount("");
  };

  const handleSelect = () => {
    const rankNumber = Number(rank);
    if (!picked) return;
    if (![1, 2, 3].includes(rankNumber)) {
      show("Choose 1st, 2nd or 3rd place", "error");
      return;
    }
    if (takenRanks(picked.week).has(rankNumber)) {
      show(`${ordinalRank(rankNumber)} place is already taken this week`, "error");
      return;
    }
    const amount = rewardAmount === "" ? 0 : Number(rewardAmount);
    if (!Number.isFinite(amount) || amount < 0 || amount > MAX_REWARD_NRS) {
      show(`Reward amount must be between 0 and NRS ${MAX_REWARD_NRS}`, "error");
      return;
    }
    if (isPreparingImage) {
      show("Please wait, the photo is still being prepared", "error");
      return;
    }
    // The week is taken from the submission itself on the server
    selectLeader({
      submissionId: picked.submission._id,
      rank: rankNumber,
      postImage: postImage || undefined,
      rewardAmount: amount > 0 ? amount : undefined,
    });
  };

  const handleImagePick = async (file?: File) => {
    if (!file) return;
    setImageError("");
    setPostImage("");
    setIsPreparingImage(true);
    try {
      setPostImage(await prepareImageDataUrl(file));
    } catch (error) {
      const message =
        error instanceof UnreadableImageError
          ? error.message
          : "Could not read this image";
      // Shown inside the form (a pop-up can be hidden behind it)
      setImageError(message);
      show(message, "error");
    } finally {
      setIsPreparingImage(false);
    }
  };

  // Add or replace the photo of a leader that is already selected
  const handleLeaderPhoto = async (file?: File) => {
    const id = photoLeaderId;
    setPhotoLeaderId(null);
    if (!file || !id) return;
    try {
      saveLeaderPhoto({ id, image: await prepareImageDataUrl(file) });
    } catch (error) {
      show(
        error instanceof UnreadableImageError
          ? error.message
          : "Could not read this image",
        "error"
      );
    }
  };

  const setRange = (fromKey: string, toKey: string) => {
    setFrom(fromKey);
    setTo(toKey);
  };

  const currentWeekKeys = (weeks ?? [])
    .filter((w) => w.isCurrent)
    .map((w) => w.weekStart);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-custom-gradient flex items-center justify-center shrink-0">
          <Award className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Content Rewards</h1>
          <p className="text-sm text-gray-400">
            Open a week, then a user, and pick the 1st, 2nd and 3rd place from
            their submissions
          </p>
        </div>
      </div>

      <Tabs aria-label="Content rewards" className="mb-4">
        <Tab key="submissions" title="Submissions">
          <div className="flex flex-wrap items-end gap-3 mb-4 rounded-2xl bg-bgSecondary border border-white/5 p-4">
            <Input
              type="date"
              label="From"
              labelPlacement="outside"
              className="w-44"
              value={from}
              max={to || undefined}
              onChange={(e) => setFrom(e.target.value)}
            />
            <Input
              type="date"
              label="To"
              labelPlacement="outside"
              className="w-44"
              value={to}
              min={from || undefined}
              onChange={(e) => setTo(e.target.value)}
            />
            <Button
              size="sm"
              variant="flat"
              onPress={() => setRange(nepalDateKey(0), nepalDateKey(0))}
            >
              This week
            </Button>
            <Button
              size="sm"
              variant="flat"
              onPress={() => setRange(nepalDateKey(-7), nepalDateKey(-7))}
            >
              Last week
            </Button>
            <Button
              size="sm"
              variant="flat"
              onPress={() => setRange(nepalDateKey(-28), nepalDateKey(0))}
            >
              Last 4 weeks
            </Button>
            <p className="text-xs text-gray-400 w-full">
              Weeks run Sunday to Saturday (Nepal time). Any date you choose
              includes its whole week.
            </p>
          </div>

          {isLoadingWeeks && <p className="text-gray-400">Loading...</p>}

          {weeks && weeks.length === 0 && (
            <div className="rounded-2xl bg-bgSecondary border border-white/5 p-10 text-center text-gray-400">
              No submissions in these weeks
            </div>
          )}

          {weeks && weeks.length > 0 && (
            <Accordion
              selectionMode="multiple"
              variant="splitted"
              defaultExpandedKeys={currentWeekKeys}
              key={`${from}|${to}|${weeks.length}`}
            >
              {weeks.map((week) => (
                <AccordionItem
                  key={week.weekStart}
                  aria-label={formatWeekRange(week.weekStart, week.weekEnd)}
                  title={
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">
                        {formatWeekRange(week.weekStart, week.weekEnd)}
                      </span>
                      {week.isCurrent && (
                        <Chip size="sm" color="primary" variant="flat">
                          Current week
                        </Chip>
                      )}
                    </div>
                  }
                  subtitle={`${week.totalSubmissions} submission${
                    week.totalSubmissions === 1 ? "" : "s"
                  } · ${week.users.length} user${
                    week.users.length === 1 ? "" : "s"
                  } · ${week.leaders.length}/3 leaders chosen`}
                >
                  {/* Places already given this week */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[1, 2, 3].map((r) => {
                      const l = week.leaders.find((x) => x.rank === r);
                      return (
                        <Chip
                          key={r}
                          size="sm"
                          variant="flat"
                          color={l ? "success" : "default"}
                        >
                          {ordinalRank(r)}:{" "}
                          {l
                            ? `${l.userName}${
                                l.rewardAmount ? ` (NRS ${l.rewardAmount})` : ""
                              }`
                            : "not chosen yet"}
                        </Chip>
                      );
                    })}
                  </div>

                  <Accordion selectionMode="multiple" variant="bordered">
                    {week.users.map((user) => {
                      const userLeader = user.submissions.find((s) => s.leader);
                      return (
                        <AccordionItem
                          key={user.userId}
                          aria-label={user.fullName}
                          title={
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium">{user.fullName}</span>
                              {userLeader?.leader && (
                                <Chip size="sm" color="warning" variant="flat">
                                  {ordinalRank(userLeader.leader.rank)} place
                                </Chip>
                              )}
                            </div>
                          }
                          subtitle={`${user.email} · ${user.phoneNumber} · ${
                            user.submissions.length
                          } submission${user.submissions.length === 1 ? "" : "s"}`}
                        >
                          <div className="space-y-2">
                            {user.submissions.map((s) => (
                              <div
                                key={s._id}
                                className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3"
                              >
                                <PlatformChip platform={s.platform} />
                                <div className="flex-1 min-w-[160px]">
                                  <Links links={s.links} />
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatNepalDateTime(s.submittedAt)}
                                  </p>
                                </div>
                                {s.leader ? (
                                  <Chip size="sm" color="success" variant="flat">
                                    {ordinalRank(s.leader.rank)} place
                                  </Chip>
                                ) : (
                                  <Button
                                    size="sm"
                                    color="primary"
                                    variant="flat"
                                    isDisabled={
                                      !!userLeader ||
                                      week.leaders.length >= 3
                                    }
                                    onPress={() => openPicker(week, user, s)}
                                  >
                                    Select as leader
                                  </Button>
                                )}
                              </div>
                            ))}
                            {userLeader && user.submissions.some((s) => !s.leader) && (
                              <p className="text-xs text-gray-400">
                                This user already has a place this week.
                              </p>
                            )}
                          </div>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Tab>

        <Tab key="leaders" title="Selected Leaders">
          <Table aria-label="Selected leaders">
            <TableHeader>
              <TableColumn>Week</TableColumn>
              <TableColumn>Rank</TableColumn>
              <TableColumn>User</TableColumn>
              <TableColumn>Platform</TableColumn>
              <TableColumn>Links</TableColumn>
              <TableColumn>Image</TableColumn>
              <TableColumn>Reward</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No leaders selected yet">
              {(leaders ?? []).map((l) => (
                <TableRow key={l._id}>
                  <TableCell>
                    {formatDateKey(l.weekStart)} - {formatDateKey(l.weekEnd)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={l.rank === 1 ? "warning" : "default"}
                    >
                      #{l.rank}
                    </Chip>
                  </TableCell>
                  <TableCell>{l.userName}</TableCell>
                  <TableCell>
                    <PlatformChip platform={l.platform} />
                  </TableCell>
                  <TableCell>
                    <Links links={l.links} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {l.postImage && (
                        <a
                          href={getUniversityAssetUrl(l.postImage)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={getUniversityAssetUrl(l.postImage)}
                            alt="Post"
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        </a>
                      )}
                      <Button
                        size="sm"
                        variant="flat"
                        isDisabled={isSavingPhoto}
                        startContent={<ImagePlus className="w-3.5 h-3.5" />}
                        onPress={() => {
                          setPhotoLeaderId(l._id);
                          leaderPhotoInputRef.current?.click();
                        }}
                      >
                        {l.postImage ? "Change" : "Add photo"}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {l.rewardAmount ? `NRS ${l.rewardAmount}` : "-"}
                  </TableCell>
                  <TableCell>
                    <ConfirmationModal
                      title="Remove leader"
                      message="Remove this leader from the leaderboard?"
                      onConfirm={() => removeLeader(l._id)}
                      trigger={
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          aria-label="Remove leader"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tab>
      </Tabs>

      <input
        ref={leaderPhotoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleLeaderPhoto(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <Modal isOpen={!!picked} onClose={() => setPicked(null)}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Select as leader</ModalHeader>
              <ModalBody className="space-y-3">
                {picked && (
                  <div className="rounded-xl bg-white/5 p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{picked.user.fullName}</span>
                      <PlatformChip platform={picked.submission.platform} />
                    </div>
                    <p className="text-xs text-gray-400">
                      Week{" "}
                      {formatWeekRange(
                        picked.week.weekStart,
                        picked.week.weekEnd
                      )}
                    </p>
                  </div>
                )}
                <Select
                  label="Position"
                  labelPlacement="outside"
                  disallowEmptySelection
                  selectedKeys={[rank]}
                  disabledKeys={
                    picked
                      ? [...takenRanks(picked.week)].map((r) => String(r))
                      : []
                  }
                  onChange={(e) => e.target.value && setRank(e.target.value)}
                >
                  {RANK_OPTIONS.map((o) => (
                    <SelectItem key={o.key}>{o.label}</SelectItem>
                  ))}
                </Select>
                <p className="text-xs text-gray-400">
                  Places already given this week are greyed out.
                </p>
                <Input
                  type="number"
                  min={0}
                  max={MAX_REWARD_NRS}
                  step="0.01"
                  label="Reward amount (NRS)"
                  labelPlacement="outside"
                  placeholder="0"
                  description={`Added to the user's earnings right away. Maximum NRS ${MAX_REWARD_NRS}. Leave empty for no payment.`}
                  isInvalid={Number(rewardAmount) > MAX_REWARD_NRS}
                  errorMessage={`Cannot be more than NRS ${MAX_REWARD_NRS}`}
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                />
                <div className="space-y-2">
                  <p className="text-sm">Poster image (shown on the leaderboard)</p>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handleImagePick(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                  {isPreparingImage && (
                    <p className="text-xs text-primary">Preparing photo...</p>
                  )}
                  {imageError && (
                    <p className="text-xs text-danger">{imageError}</p>
                  )}
                  {postImage ? (
                    <div className="relative">
                      <img
                        src={postImage}
                        alt="Post preview"
                        className="w-full max-h-48 object-cover rounded-xl border border-white/10"
                      />
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="absolute top-2 right-2"
                        aria-label="Remove image"
                        onPress={() => setPostImage("")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="flat"
                      isLoading={isPreparingImage}
                      startContent={<ImagePlus className="w-4 h-4" />}
                      onPress={() => imageInputRef.current?.click()}
                    >
                      Upload image
                    </Button>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={() => setPicked(null)}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isSelecting}
                  isDisabled={isPreparingImage}
                  onPress={handleSelect}
                >
                  Select
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

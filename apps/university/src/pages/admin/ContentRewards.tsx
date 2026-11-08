"use client";

import { useState } from "react";
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@nextui-org/react";
import { Award, ExternalLink, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  contentRewardApi,
  formatDateKey,
  formatNepalDateTime,
  nepalDateKey,
  TAdminContentSubmission,
} from "../../lib/api/contentReward/contentReward.api";
import useAlert from "../../hooks/useAlert";
import ConfirmationModal from "../../components/admin/modal/ConfirmationModal";
import { platformMeta } from "../../lib/api/contentReward/platforms";

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

export default function AdminContentRewards() {
  const { show } = useAlert();
  const queryClient = useQueryClient();

  // Default to the last 7 days (Nepal dates), the usual "week" to review
  const [from, setFrom] = useState(nepalDateKey(-6));
  const [to, setTo] = useState(nepalDateKey(0));
  const [page, setPage] = useState(1);

  const [picked, setPicked] = useState<TAdminContentSubmission | null>(null);
  const [rank, setRank] = useState("1");
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");

  const { data: submissions } = useQuery({
    queryKey: ["contentSubmissions", page, from, to],
    queryFn: () =>
      contentRewardApi.getSubmissionsForAdmin({
        page,
        from: from || undefined,
        to: to || undefined,
      }),
  });

  const { data: leaders } = useQuery({
    queryKey: ["contentLeadersAdmin"],
    queryFn: contentRewardApi.getLeadersForAdmin,
  });

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["contentSubmissions"] });
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

  const openPicker = (submission: TAdminContentSubmission) => {
    setPicked(submission);
    setRank("1");
    // The week being reviewed is whatever date range the admin filtered on
    setWeekStart(from);
    setWeekEnd(to);
  };

  const handleSelect = () => {
    const rankNumber = Number(rank);
    if (!picked) return;
    if (!Number.isInteger(rankNumber) || rankNumber < 1) {
      show("Rank must be a whole number, 1 or higher", "error");
      return;
    }
    if (!weekStart || !weekEnd || weekStart > weekEnd) {
      show("Choose a valid week (start date before end date)", "error");
      return;
    }
    selectLeader({
      submissionId: picked._id,
      rank: rankNumber,
      weekStart,
      weekEnd,
    });
  };

  const changeDate = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-custom-gradient flex items-center justify-center shrink-0">
          <Award className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Content Rewards</h1>
          <p className="text-sm text-gray-400">
            Review submitted content, then pick and rank the leaders of the week
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
              onChange={(e) => changeDate(setFrom)(e.target.value)}
            />
            <Input
              type="date"
              label="To"
              labelPlacement="outside"
              className="w-44"
              value={to}
              min={from || undefined}
              onChange={(e) => changeDate(setTo)(e.target.value)}
            />
            <Button
              size="sm"
              variant="flat"
              onPress={() => {
                setFrom(nepalDateKey(-6));
                setTo(nepalDateKey(0));
                setPage(1);
              }}
            >
              Last 7 days
            </Button>
            <Button
              size="sm"
              variant="light"
              onPress={() => {
                setFrom("");
                setTo("");
                setPage(1);
              }}
            >
              Clear
            </Button>
          </div>

          <Table
            aria-label="Content submissions"
            bottomContent={
              submissions && submissions.totalPages > 1 ? (
                <div className="flex justify-center">
                  <Pagination
                    page={page}
                    total={submissions.totalPages}
                    onChange={setPage}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn>SN</TableColumn>
              <TableColumn>User</TableColumn>
              <TableColumn>Phone</TableColumn>
              <TableColumn>Platform</TableColumn>
              <TableColumn>Links</TableColumn>
              <TableColumn>Submitted (Nepal time)</TableColumn>
              <TableColumn>Leader</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No submissions in this date range">
              {(submissions?.data ?? []).map((s, index) => (
                <TableRow key={s._id}>
                  <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                  <TableCell>
                    <div>{s.user.fullName}</div>
                    <div className="text-xs text-gray-400">{s.user.email}</div>
                  </TableCell>
                  <TableCell>{s.user.phoneNumber}</TableCell>
                  <TableCell>
                    <PlatformChip platform={s.platform} />
                  </TableCell>
                  <TableCell>
                    <Links links={s.links} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-300 whitespace-nowrap">
                    {formatNepalDateTime(s.submittedAt)}
                  </TableCell>
                  <TableCell>
                    {s.leader ? (
                      <Chip size="sm" color="success" variant="flat">
                        Rank {s.leader.rank} ({formatDateKey(s.leader.weekStart)} -{" "}
                        {formatDateKey(s.leader.weekEnd)})
                      </Chip>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      isDisabled={!!s.leader}
                      onPress={() => openPicker(s)}
                    >
                      Select as leader
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tab>

        <Tab key="leaders" title="Selected Leaders">
          <Table aria-label="Selected leaders">
            <TableHeader>
              <TableColumn>Week</TableColumn>
              <TableColumn>Rank</TableColumn>
              <TableColumn>User</TableColumn>
              <TableColumn>Platform</TableColumn>
              <TableColumn>Links</TableColumn>
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

      <Modal isOpen={!!picked} onClose={() => setPicked(null)}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Select as leader</ModalHeader>
              <ModalBody className="space-y-3">
                {picked && (
                  <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                    <span className="font-medium">{picked.user.fullName}</span>
                    <PlatformChip platform={picked.platform} />
                  </div>
                )}
                <Input
                  type="number"
                  min={1}
                  label="Rank"
                  labelPlacement="outside"
                  placeholder="1"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                />
                <p className="text-xs text-gray-400">
                  Leaders with the same week dates are grouped together on the
                  leaderboard. Each rank can be used once per week.
                </p>
                <Input
                  type="date"
                  label="Week start"
                  labelPlacement="outside"
                  value={weekStart}
                  onChange={(e) => setWeekStart(e.target.value)}
                />
                <Input
                  type="date"
                  label="Week end"
                  labelPlacement="outside"
                  value={weekEnd}
                  onChange={(e) => setWeekEnd(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={() => setPicked(null)}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isSelecting}
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

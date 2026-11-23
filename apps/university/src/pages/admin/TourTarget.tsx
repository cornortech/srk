"use client";

import { useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import {
  ImagePlus,
  MapPin,
  Pencil,
  Plus,
  Star,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  isTourImage,
  tourApi,
  TTourTargetInput,
} from "../../lib/api/tour/tour.api";
import { TTourTarget } from "../../lib/types/entities";
import { getUniversityAssetUrl } from "../../lib/cdn";
import { prepareImageDataUrl, UnreadableImageError } from "../../lib/kycImage";
import useAlert from "../../hooks/useAlert";
import ConfirmationModal from "../../components/admin/modal/ConfirmationModal";

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

type FormState = {
  destination: string;
  description: string;
  targetAmount: string;
  duration: string;
  accommodation: string;
  difficulty: (typeof DIFFICULTIES)[number];
  rating: string;
  /** Existing value: https URL, emoji or stored key */
  imageText: string;
  /** A newly picked photo (data URL), sent instead of imageText */
  imageData: string;
  features: string[];
  isActive: boolean;
};

const emptyForm: FormState = {
  destination: "",
  description: "",
  targetAmount: "",
  duration: "30",
  accommodation: "",
  difficulty: "Easy",
  rating: "5",
  imageText: "",
  imageData: "",
  features: [],
  isActive: true,
};

const difficultyColor = {
  Easy: "success",
  Medium: "warning",
  Hard: "danger",
} as const;

const toForm = (t: TTourTarget): FormState => ({
  destination: t.destination,
  description: t.description,
  targetAmount: String(t.targetAmount),
  duration: String(t.duration),
  accommodation: t.accommodation,
  difficulty: t.difficulty,
  rating: String(t.rating),
  imageText: t.image,
  imageData: "",
  features: t.features,
  isActive: t.isActive,
});

function TourImage({ value, alt }: { value: string; alt: string }) {
  if (isTourImage(value)) {
    return (
      <img
        src={getUniversityAssetUrl(value)}
        alt={alt}
        className="h-14 w-14 rounded-lg object-cover shrink-0"
      />
    );
  }
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/5 text-3xl shrink-0">
      {value || "🏝️"}
    </span>
  );
}

export default function AdminTourTargets() {
  const { show } = useAlert();
  const queryClient = useQueryClient();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<TTourTarget | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [newFeature, setNewFeature] = useState("");

  const { data: targets, isLoading } = useQuery<TTourTarget[]>({
    queryKey: ["tourTargets"],
    queryFn: tourApi.getTourTargets,
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["tourTargets"] });

  const onError =
    (fallback: string) => (error: AxiosError<{ message: string }>) =>
      show(error.response?.data.message || fallback, "error");

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: (data: TTourTargetInput) =>
      editing
        ? tourApi.updateTourTarget(editing._id, data)
        : tourApi.createTourTarget(data),
    onSuccess: () => {
      show(editing ? "Tour target updated" : "Tour target created", "success");
      closeForm();
      refresh();
    },
    onError: onError("Failed to save tour target"),
  });

  const { mutate: setActive } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      tourApi.setTourTargetActive(id, isActive),
    onSuccess: (res: { message: string }) => {
      show(res.message, "success");
      refresh();
    },
    onError: onError("Failed to change status"),
  });

  const { mutate: remove } = useMutation({
    mutationFn: tourApi.deleteTourTarget,
    onSuccess: () => {
      show("Tour target deleted", "success");
      refresh();
    },
    onError: onError("Failed to delete tour target"),
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setNewFeature("");
    setIsOpen(true);
  };

  const openEdit = (target: TTourTarget) => {
    setEditing(target);
    setForm(toForm(target));
    setNewFeature("");
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setEditing(null);
  };

  const addFeature = () => {
    const value = newFeature.trim();
    if (!value) return;
    if (form.features.some((f) => f.toLowerCase() === value.toLowerCase())) {
      setNewFeature("");
      return;
    }
    set("features", [...form.features, value]);
    setNewFeature("");
  };

  const pickImage = async (file?: File) => {
    if (!file) return;
    try {
      set("imageData", await prepareImageDataUrl(file));
    } catch (error) {
      show(
        error instanceof UnreadableImageError
          ? error.message
          : "Could not read this image",
        "error"
      );
    }
  };

  const handleSave = () => {
    const targetAmount = Number(form.targetAmount);
    const duration = Number(form.duration);
    const rating = Number(form.rating);

    if (!form.destination.trim()) return show("Destination is required", "error");
    if (!form.description.trim()) return show("Description is required", "error");
    if (!form.accommodation.trim())
      return show("Accommodation is required", "error");
    if (!(targetAmount > 0))
      return show("Target amount must be more than 0", "error");
    if (!Number.isInteger(duration) || duration < 1)
      return show("Duration must be a whole number of days (1 or more)", "error");
    if (!(rating >= 0 && rating <= 5))
      return show("Rating must be between 0 and 5", "error");

    save({
      destination: form.destination.trim(),
      description: form.description.trim(),
      targetAmount,
      duration,
      accommodation: form.accommodation.trim(),
      difficulty: form.difficulty,
      rating,
      image: form.imageData || form.imageText.trim(),
      features: form.features,
      // Create only; an existing target's status has its own switch
      ...(editing ? {} : { isActive: form.isActive }),
    });
  };

  const previewValue = form.imageData || form.imageText;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-custom-gradient flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Tour Targets</h1>
            <p className="text-sm text-gray-400">
              Create the tour target affiliates earn towards. Only one target
              can be active at a time.
            </p>
          </div>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={openCreate}
        >
          Add tour target
        </Button>
      </div>

      {isLoading && <p className="text-gray-400">Loading...</p>}

      {targets && targets.length === 0 && (
        <Card className="bg-bgSecondary border border-white/5">
          <CardBody className="py-12 text-center">
            <Target className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p className="font-medium">No tour targets yet</p>
            <p className="text-sm text-gray-400 mb-4">
              Add your first target and it will show on the affiliate Target
              page.
            </p>
            <div>
              <Button color="primary" onPress={openCreate}>
                Add tour target
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {(targets ?? []).map((t) => (
          <Card
            key={t._id}
            className={`bg-bgSecondary border ${
              t.isActive ? "border-primary/40" : "border-white/5 opacity-80"
            }`}
          >
            <CardBody className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <TourImage value={t.image} alt={t.destination} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{t.destination}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <Chip size="sm" variant="flat" color={difficultyColor[t.difficulty]}>
                      {t.difficulty}
                    </Chip>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={t.isActive ? "success" : "default"}
                    >
                      {t.isActive ? "Active" : "Inactive"}
                    </Chip>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-400 line-clamp-2">{t.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-primary" />
                  Nrs. {t.targetAmount.toLocaleString()}
                </span>
                <span>{t.duration} days</span>
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5" />
                  {t.accommodation}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                  {t.rating}/5
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <Switch
                  size="sm"
                  isSelected={t.isActive}
                  onValueChange={(v) => setActive({ id: t._id, isActive: v })}
                >
                  <span className="text-xs">Active</span>
                </Switch>
                <div className="flex gap-1">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label="Edit"
                    onPress={() => openEdit(t)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <ConfirmationModal
                    title="Delete tour target"
                    message="Delete this tour target? This only works if no user has progress on it."
                    onConfirm={() => remove(t._id)}
                    trigger={
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    }
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeForm}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                {editing ? "Edit tour target" : "Add tour target"}
              </ModalHeader>
              <ModalBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Destination"
                    labelPlacement="outside"
                    placeholder="e.g. Pokhara"
                    isRequired
                    value={form.destination}
                    onChange={(e) => set("destination", e.target.value)}
                  />
                  <Input
                    label="Accommodation"
                    labelPlacement="outside"
                    placeholder="e.g. 4-Star Resort"
                    isRequired
                    value={form.accommodation}
                    onChange={(e) => set("accommodation", e.target.value)}
                  />
                </div>

                <Textarea
                  label="Description"
                  labelPlacement="outside"
                  placeholder="What the tour includes"
                  isRequired
                  minRows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    type="number"
                    min={1}
                    label="Target amount (Nrs.)"
                    labelPlacement="outside"
                    placeholder="200000"
                    isRequired
                    value={form.targetAmount}
                    onChange={(e) => set("targetAmount", e.target.value)}
                  />
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    label="Duration (days)"
                    labelPlacement="outside"
                    description="Time users get to reach it"
                    isRequired
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                  />
                  <Select
                    label="Difficulty"
                    labelPlacement="outside"
                    disallowEmptySelection
                    selectedKeys={[form.difficulty]}
                    onChange={(e) =>
                      e.target.value &&
                      set("difficulty", e.target.value as FormState["difficulty"])
                    }
                  >
                    {DIFFICULTIES.map((d) => (
                      <SelectItem key={d}>{d}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    label="Rating (0-5)"
                    labelPlacement="outside"
                    value={form.rating}
                    onChange={(e) => set("rating", e.target.value)}
                  />
                </div>

                {/* Image */}
                <div className="space-y-2">
                  <p className="text-sm">Image</p>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      pickImage(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    {previewValue && <TourImage value={previewValue} alt="Preview" />}
                    <Button
                      variant="flat"
                      startContent={<ImagePlus className="w-4 h-4" />}
                      onPress={() => imageInputRef.current?.click()}
                    >
                      {form.imageData ? "Change photo" : "Upload photo"}
                    </Button>
                    {form.imageData && (
                      <Button
                        size="sm"
                        variant="light"
                        startContent={<X className="w-4 h-4" />}
                        onPress={() => set("imageData", "")}
                      >
                        Remove new photo
                      </Button>
                    )}
                  </div>
                  <Input
                    size="sm"
                    placeholder="...or paste an image link, or an emoji like 🏔️"
                    isDisabled={!!form.imageData}
                    value={form.imageData ? "" : form.imageText}
                    onChange={(e) => set("imageText", e.target.value)}
                  />
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-sm">Features</p>
                  <div className="flex gap-2">
                    <Input
                      size="sm"
                      placeholder="e.g. Lake boating (press Enter to add)"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                    />
                    <Button isIconOnly size="sm" variant="flat" onPress={addFeature}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.features.map((f, i) => (
                      <Chip
                        key={`${f}-${i}`}
                        variant="flat"
                        color="primary"
                        onClose={() =>
                          set(
                            "features",
                            form.features.filter((_, idx) => idx !== i)
                          )
                        }
                      >
                        {f}
                      </Chip>
                    ))}
                  </div>
                </div>

                {!editing && (
                  <Switch
                    isSelected={form.isActive}
                    onValueChange={(v) => set("isActive", v)}
                  >
                    Make this the active target
                  </Switch>
                )}
                {!editing && form.isActive && (
                  <p className="text-xs text-gray-400">
                    Users earn towards one tour at a time, so any target that is
                    active now will be switched off.
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={closeForm}>
                  Cancel
                </Button>
                <Button color="primary" isLoading={isSaving} onPress={handleSave}>
                  {editing ? "Save changes" : "Create target"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

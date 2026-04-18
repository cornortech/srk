"use client"

import { useState } from "react"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Textarea,
    Select,
    SelectItem,
    Badge,
} from "@heroui/react"
import {
    ArrowLeft,
    Plus,
    Upload,
    Save,
    Trash2,
    Edit,
    MapPin,
    Target,
    Calendar,
    Star,
    X,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

interface TourTarget {
    id: string
    destination: string
    description: string
    targetAmount: number
    duration: string
    accommodation: string
    difficulty: "Easy" | "Medium" | "Hard"
    rating: number
    image: string
    features: string[]
    isActive?: boolean
}

const existingTours: TourTarget[] = [
    {
        id: "pokhara",
        destination: "Pokhara Adventure",
        description: "Beautiful lakeside city with stunning mountain views",
        targetAmount: 300000,
        duration: "3 Days, 2 Nights",
        accommodation: "4-Star Hotel",
        difficulty: "Easy",
        rating: 4.8,
        image: "🏔️",
        features: [
            "Lake Boating",
            "Mountain Views",
            "Adventure Sports",
            "Cultural Sites",
        ],
        isActive: false,
    },
    {
        id: "everest",
        destination: "Everest Base Camp",
        description: "Ultimate trekking experience to the world's highest peak",
        targetAmount: 750000,
        duration: "14 Days, 13 Nights",
        accommodation: "Tea Houses",
        difficulty: "Hard",
        rating: 4.9,
        image: "🏔️",
        features: ["High Altitude Trek", "Sherpa Culture", "Stunning Views", "Adventure"],
        isActive: true,
    },
]

export default function AdminTourTargetsPage() {
    const navigate = useNavigate()
    const [tours, setTours] = useState<TourTarget[]>(existingTours)
    const [isCreating, setIsCreating] = useState(false)
    const [editingTour, setEditingTour] = useState<TourTarget | null>(null)
    const [newFeature, setNewFeature] = useState("")

    const [formData, setFormData] = useState<Partial<TourTarget>>({
        destination: "",
        description: "",
        targetAmount: 0,
        duration: "",
        accommodation: "",
        difficulty: "Easy",
        rating: 0,
        image: "",
        features: [],
    })

    const handleInputChange = (field: keyof TourTarget, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const addFeature = () => {
        if (newFeature.trim() && formData.features) {
            setFormData((prev) => ({
                ...prev,
                features: [...(prev.features || []), newFeature.trim()],
            }))
            setNewFeature("")
        }
    }

    const removeFeature = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features?.filter((_, i) => i !== index) || [],
        }))
    }

    const handleSave = () => {
        if (!formData.destination || !formData.description || !formData.targetAmount) {
            alert("Please fill in all required fields")
            return
        }

        const tourData: TourTarget = {
            id: editingTour?.id || `tour-${Date.now()}`,
            destination: formData.destination!,
            description: formData.description!,
            targetAmount: formData.targetAmount!,
            duration: formData.duration!,
            accommodation: formData.accommodation!,
            difficulty: formData.difficulty!,
            rating: formData.rating!,
            image: formData.image!,
            features: formData.features!,
        }

        if (editingTour) {
            setTours((prev) =>
                prev.map((tour) => (tour.id === editingTour.id ? tourData : tour)),
            )
        } else {
            setTours((prev) => [...prev, tourData])
        }

        resetForm()
        alert(`Tour ${editingTour ? "updated" : "created"} successfully!`)
    }

    const handleEdit = (tour: TourTarget) => {
        setEditingTour(tour)
        setFormData(tour)
        setIsCreating(true)
    }

    const handleDelete = (tourId: string) => {
        if (confirm("Are you sure you want to delete this tour?")) {
            setTours((prev) => prev.filter((tour) => tour.id !== tourId))
        }
    }

    const resetForm = () => {
        setFormData({
            destination: "",
            description: "",
            targetAmount: 0,
            duration: "",
            accommodation: "",
            difficulty: "Easy",
            rating: 0,
            image: "",
            features: [],
        })
        setEditingTour(null)
        setIsCreating(false)
        setNewFeature("")
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "success"
            case "Medium":
                return "warning"
            case "Hard":
                return "danger"
            default:
                return "default"
        }
    }
    const isImageUrl = (str: string) => {
        try {
            const url = new URL(str);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return false;
        }
    }
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button isIconOnly variant="light" onClick={() => navigate(-1)}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Tour Target Management</h1>
                                <p className="text-sm text-muted-foreground">
                                    Create and manage tour destinations
                                </p>
                            </div>
                        </div>
                        <Button color="primary" onClick={() => setIsCreating(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Tour
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Create/Edit Form */}
                {isCreating && (
                    <Card className="mb-8">
                        <CardHeader className="flex flex-col gap-1">
                            <h2 className="flex items-center gap-2 text-lg font-semibold">
                                <Upload className="h-5 w-5" />
                                {editingTour ? "Edit Tour Target" : "Create New Tour Target"}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {editingTour
                                    ? "Update tour information"
                                    : "Add a new tour destination for users to target"}
                            </p>
                        </CardHeader>
                        <CardBody className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <Input
                                        label="Destination Name *"
                                        value={formData.destination}
                                        onChange={(e) => handleInputChange("destination", e.target.value)}
                                        placeholder="e.g., Pokhara Adventure"
                                    />

                                    <Textarea
                                        label="Description *"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        placeholder="Brief description of the tour"
                                        minRows={3}
                                    />

                                    <Input
                                        type="number"
                                        label="Target Amount (₹) *"
                                        value={formData.targetAmount?.toString() || ""}
                                        onChange={(e) =>
                                            handleInputChange("targetAmount", Number.parseInt(e.target.value) || 0)
                                        }
                                        placeholder="300000"
                                    />

                                    <Input
                                        label="Emoji/Icon"
                                        value={formData.image}
                                        onChange={(e) => handleInputChange("image", e.target.value)}
                                        placeholder="🏔️"
                                    />
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <Input
                                        label="Duration"
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange("duration", e.target.value)}
                                        placeholder="3 Days, 2 Nights"
                                    />

                                    <Input
                                        label="Accommodation"
                                        value={formData.accommodation}
                                        onChange={(e) => handleInputChange("accommodation", e.target.value)}
                                        placeholder="4-Star Hotel"
                                    />

                                    <Select
                                        label="Difficulty Level"
                                        selectedKeys={[formData.difficulty || "Easy"]}
                                        onChange={(e) => handleInputChange("difficulty", e.target.value)}
                                    >
                                        <SelectItem key="Easy">Easy</SelectItem>
                                        <SelectItem key="Medium">Medium</SelectItem>
                                        <SelectItem key="Hard">Hard</SelectItem>
                                    </Select>

                                    <Input
                                        type="number"
                                        label="Rating (1-5)"
                                        min={1}
                                        max={5}
                                        step={0.1}
                                        value={formData.rating?.toString() || ""}
                                        onChange={(e) =>
                                            handleInputChange("rating", Number.parseFloat(e.target.value) || 0)
                                        }
                                        placeholder="4.8"
                                    />
                                </div>
                            </div>

                            {/* Features Section */}
                            <div>
                                <label className="text-sm font-medium">Tour Features</label>
                                <div className="mt-2 space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            placeholder="Add a feature (e.g., Lake Boating)"
                                            onKeyDown={(e) => e.key === "Enter" && addFeature()}
                                        />
                                        <Button onClick={addFeature} variant="bordered" isIconOnly>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.features?.map((feature, index) => (
                                            <Badge key={index} color="primary" variant="flat" className="flex items-center gap-1">
                                                {feature}
                                                <X
                                                    className="h-3 w-3 cursor-pointer hover:text-danger"
                                                    onClick={() => removeFeature(index)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button color="primary" onClick={handleSave}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {editingTour ? "Update Tour" : "Create Tour"}
                                </Button>
                                <Button variant="bordered" onClick={resetForm}>
                                    Cancel
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                )}

                {/* Existing Tours List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">
                        Existing Tours ({tours.length})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tours.map((tour) => (
                            <Card key={tour.id} className={`hover:shadow-lg transition-all ${!tour.isActive ? 'opacity-75' : ''}`}>
                                <CardHeader className="pb-2 flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        {isImageUrl(tour.image) ? (
                                            <img
                                                src={tour.image}
                                                alt={tour.destination}
                                                className=\"w-12 h-12 rounded-lg object-cover\"
                                            />
                                        ) : (
                                            <span className=\"text-2xl\">{tour.image}</span>
                                        )}
                                        <div>
                                            <h3 className="font-semibold">{tour.destination}</h3>
                                            <div className=\"flex gap-2 mt-1\">
                                                <Badge color={getDifficultyColor(tour.difficulty)}>{tour.difficulty}</Badge>
                                                <Badge color={tour.isActive ? \"success\" : \"warning\"}>
                                                    {tour.isActive ? \"Active\" : \"Inactive\"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onClick={() => handleEdit(tour)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onClick={() => handleDelete(tour.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-danger" />
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardBody className="space-y-3">
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {tour.description}
                                    </p>

                                    <div className="space-y-2 text-xs">
                                        <div className="flex items-center gap-2">
                                            <Target className="h-3 w-3 text-primary" />
                                            <span className="font-medium text-primary">
                                                ₹{tour.targetAmount.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-muted-foreground">{tour.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-muted-foreground">{tour.accommodation}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Star className="h-3 w-3 text-yellow-500" />
                                            <span className="text-muted-foreground">{tour.rating}/5.0</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {tour.features.slice(0, 3).map((feature, index) => (
                                            <Badge key={index} variant="faded" color="default" className="text-xs">
                                                {feature}
                                            </Badge>
                                        ))}
                                        {tour.features.length > 3 && (
                                            <Badge variant="faded" color="default" className="text-xs">
                                                +{tour.features.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {tours.length === 0 && (
                        <div className="text-center py-12">
                            <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                No tours created yet
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Create your first tour target to get started
                            </p>
                            <Button color="primary" onClick={() => setIsCreating(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create First Tour
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

"use client"

import {
    Card,
    CardBody,
    CardHeader,
    Badge,
    Progress,
} from "@heroui/react"
import {
    MapPin,
    Target,
    Star,
    Clock,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { tourApi } from "../../lib/api/tour/tour.api"
import { TTourTarget } from "../../lib/types/entities"
import useAuthStore from "../../store/useAuth"


export default function TourTargetsPage() {


    const { userDetails } = useAuthStore();

    const { data: tours } = useQuery<TTourTarget[]>({
        queryKey: ["tourTargets"],
        queryFn: async () => {
            return tourApi.getTourTargets()
        },
        enabled: !!userDetails?._id,
    })

    if (tours) {
        console.log('Tours loaded:', tours[0]?.createdAt, tours[0]?.duration);
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

    const calculateRemainingDays = (createdAt: string, duration: number) => {
        try {
            if (!createdAt || duration <= 0) return 0;
            const created = new Date(createdAt);
            if (isNaN(created.getTime())) return 0; // Invalid date
            const deadline = new Date(created.getTime() + duration * 24 * 60 * 60 * 1000);
            const now = new Date();
            const remaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return Math.max(remaining, 0); // Return 0 if deadline has passed
        } catch (error) {
            console.error('Error calculating remaining days:', error, { createdAt, duration });
            return 0;
        }
    }

    if (!tours) {
        return <div>Loading...</div>
    }

    function calculateTargetProgress(currentAmount: number, targetAmount: number) {
        if (targetAmount === 0) return 0;
        return +Math.min((currentAmount / targetAmount) * 100, 100).toFixed(2)
    }


    return (
        <div className="min-h-screen w-full bg-background">
            {/* Header */}

            <div className="container mx-auto px-4 py-8 w-full">
                {/* Create/Edit Form */}


                {/* Existing Tours List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">
                        Targets -  ({tours.filter(tour => tour.isActive).length})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tours.filter(tour => tour.isActive).map((tour) => (
                            <Card key={tour._id} className={`hover:shadow-lg transition-all ${!tour.isActive ? 'opacity-75' : ''}`}>
                                <CardHeader className="pb-2 flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        {isImageUrl(tour.image) ? (
                                            <img
                                                src={getUniversityAssetUrl(tour.image)}
                                                alt={tour.destination}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl">{tour.image}</span>
                                        )}
                                        <div>
                                            <h3 className="font-semibold">{tour.destination}</h3>
                                            <Badge color={getDifficultyColor(tour.difficulty)}>{tour.difficulty}</Badge>
                                        </div>
                                    </div>
                                    <Badge color={tour.isActive ? "success" : "warning"}>
                                        {tour.isActive ? "Active" : "Inactive"}
                                    </Badge>
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
                                        {/* <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-muted-foreground">{tour.duration}</span>
                                        </div> */}
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3 text-orange-500" />
                                            <span className="text-muted-foreground">{calculateRemainingDays(tour.createdAt, tour.duration)} days remaining</span>
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
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-foreground">Progress</span>
                                            <span className="text-sm font-bold text-primary">{calculateTargetProgress(tour.collectedAmount, tour.targetAmount)}%</span>
                                        </div>
                                        <Progress value={calculateTargetProgress(tour.collectedAmount, tour.targetAmount)} className="h-2" />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Earned - Nrs.{tour.collectedAmount}</span>
                                            <span>Nrs.{tour.targetAmount.toLocaleString()}</span>
                                        </div>
                                        {/* {remainingAmount > 0 && ( */}
                                        <p className="text-xs text-muted-foreground"> Nrs. {tour.targetAmount - tour.collectedAmount} remaining</p>
                                        {/* )} */}
                                    </div>


                                    <div className="flex flex-wrap gap-1">
                                        {tour.features.slice(0, 3).map((feature, index) => (
                                            <div className="text-xs text-muted-foreground border px-2 py-1 rounded-full border-gray-700" key={index}>
                                                {feature}
                                            </div>
                                        ))}
                                        {tour.features.length > 3 && (
                                            <div className="text-xs text-muted-foreground">
                                                +{tour.features.length - 3}
                                            </div>
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

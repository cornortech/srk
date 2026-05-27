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
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { tourApi } from "../../lib/api/tour/tour.api"
import { TTourTarget } from "../../lib/types/entities"
import useAuthStore from "../../store/useAuth"
import { TEarningDetails } from "../../lib/types"
import { getEarningDetailsofUserApi } from "../../lib/apiClient"


export default function TourTargetsPage() {


    const { userDetails } = useAuthStore();

    const { data: earningsData } = useQuery<TEarningDetails | null>({
        queryKey: ["earnings"],
        queryFn: async () => {
            const userId = userDetails?._id;
            if (!userId) return;
            return getEarningDetailsofUserApi(userId);
        },
        enabled: !!userDetails?._id,
    });


    const { data: tours } = useQuery<TTourTarget[]>({
        queryKey: ["tourTargets"],
        queryFn: async () => {
            return tourApi.getTourTargets()
        }
    })



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
                        Targets -  ({tours.length})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tours.map((tour) => (
                            <Card key={tour._id} className="hover:shadow-lg transition-all">
                                <CardHeader className="pb-2 flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{tour.image}</span>
                                        <div>
                                            <h3 className="font-semibold">{tour.destination}</h3>
                                            <Badge color={getDifficultyColor(tour.difficulty)}>{tour.difficulty}</Badge>
                                        </div>
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
                                        {/* <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-muted-foreground">{tour.duration}</span>
                                        </div> */}
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
                                            <span className="text-sm font-bold text-primary">{calculateTargetProgress(earningsData?.tourBalance || 0, tour.targetAmount)}%</span>
                                        </div>
                                        <Progress value={calculateTargetProgress(earningsData?.tourBalance || 0, tour.targetAmount)} className="h-2" />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Accumulated - Nrs.{earningsData?.tourBalance}</span>
                                            <span>Nrs.{tour.targetAmount.toLocaleString()}</span>
                                        </div>
                                        {/* {remainingAmount > 0 && ( */}
                                        <p className="text-xs text-muted-foreground"> Nrs. {tour.targetAmount - (earningsData?.tourBalance || 0)} still needed</p>
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

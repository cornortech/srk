"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardBody } from "@nextui-org/card"
import { Button } from "@nextui-org/button"
import { User, CreditCard, MapPin, Users, FileText, Building } from "lucide-react"
import { Avatar } from "@nextui-org/avatar"
import { Spinner } from "@nextui-org/spinner"
import useAuthStore from "../../store/useAuth"

export default function BankUserPreviewPage() {
const [registrationData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+977-9841234567",
    dateOfBirth: "1990-01-15",
    gender: "Male",
    fatherName: "Ram Doe",
    motherName: "Sita Doe",
    maritalStatus: "Single",
    permanentStreet: "123 Main St",
    permanentCity: "Kathmandu",
    permanentState: "Bagmati",
    permanentZip: "44600",
    permanentCountry: "Nepal",
    sameAsPermanent: true,
    idType: "Citizenship",
    idNumber: "123456789",
    idIssueDate: "2020-01-01",
    idExpiryDate: "2030-01-01",
    issuingAuthority: "Government of Nepal",
    emergencyContact: "+977-9847654321",
    spouseName: "",
    currentStreet: "",
    currentCity: "",
    currentState: "",
    currentZip: "",
    currentCountry: "",
    profileImage: "", // URL or base64 string
    idDocument: true,
    addressProof: true,
    incomeProof: false,
    additionalDocs: false
})
    const [error, setError] = useState("")
    const { userDetails } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleConfirm = async () => {
        if (!userDetails?._id) return

        setIsLoading(true)
        setError("")

        try {
            const success = true
            if (success) {
                sessionStorage.removeItem("registration_data")
                navigate("/bank/onboarding/setup-pin");
            } else {
                setError("Registration failed. Email might already be in use.")
            }
        } catch (err) {
            setError("Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = () => {
        navigate("/register")
    }

    if (!registrationData) {
        return (
            <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 py-8">
                <div className="text-center flex flex-col items-center gap-4">
                    <Spinner color="warning" size="lg" />
                    <p className="text-white">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-black px-4 py-6 sm:py-8">
            <div className="max-w-4xl mx-auto">
                <Card className="bg-[#1a1a1a] border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 rounded-2xl">
                    <CardHeader className="flex flex-col items-center text-center gap-2 sm:gap-3 pt-4 sm:pt-6 pb-4 sm:pb-6">
                        <div 
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-xl mb-2 sm:mb-3" 
                            style={{background: 'linear-gradient(125deg, #e1ba73, #b68938)'}}
                        >
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold" style={{color: '#b68938'}}>Review Your Details</h1>
                        <p className="text-gray-400 text-sm sm:text-base max-w-sm">Please review all your information before creating your account</p>
                    </CardHeader>

                    <CardBody className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-5 sm:space-y-6">
                        {error && (
                            <div className="bg-red-950/30 border border-red-800/50 text-red-400 p-3 sm:p-4 rounded-xl text-sm sm:text-base backdrop-blur-sm flex items-start gap-3">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="leading-relaxed">{error}</span>
                            </div>
                        )}

                        {/* Profile Image */}
                        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                            <Avatar
                                src={registrationData.profileImage || ""}
                                icon={!registrationData.profileImage && <User className="w-12 h-12 text-gray-500" />}
                                className="w-20 h-20 sm:w-24 sm:h-24 text-large border-2" 
                                style={{borderColor: '#b68938'}}
                            />
                        </div>

                        <div 
                            className="h-px w-full" 
                            style={{
                                background: 'linear-gradient(90deg, transparent, #b68938, transparent)', 
                                opacity: 0.3
                            }}
                        ></div>

                        <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                            {/* Personal Information */}
                            <Card className="bg-[#2a2520] border border-[#b68938]/40 rounded-xl">
                                <CardHeader className="pb-3 sm:pb-4">
                                    <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-semibold" style={{color: '#b68938'}}>
                                        <User className="w-5 h-5" /> Personal Information
                                    </div>
                                </CardHeader>
                                <CardBody className="space-y-3 sm:space-y-4 pt-0">
                                    {[
                                        { label: "Full Name", value: registrationData.fullName },
                                        { label: "Email", value: registrationData.email },
                                        { label: "Phone Number", value: registrationData.phoneNumber },
                                        { label: "Date of Birth", value: registrationData.dateOfBirth || "Not provided" },
                                        { label: "Gender", value: registrationData.gender || "Not provided" }
                                    ].map((item, idx) => (
                                        <div key={idx}>
                                            <p className="text-xs sm:text-sm text-gray-400">{item.label}</p>
                                            <p className="text-white font-medium text-sm sm:text-base">{item.value}</p>
                                        </div>
                                    ))}
                                </CardBody>
                            </Card>

                            {/* Family Details */}
                            <Card className="bg-[#2a2520] border border-[#b68938]/40 rounded-xl">
                                <CardHeader className="pb-3 sm:pb-4">
                                    <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-semibold" style={{color: '#b68938'}}>
                                        <Users className="w-5 h-5" /> Family Details
                                    </div>
                                </CardHeader>
                                <CardBody className="space-y-3 sm:space-y-4 pt-0">
                                    {[
                                        { label: "Father's Name", value: registrationData.fatherName || "Not provided" },
                                        { label: "Mother's Name", value: registrationData.motherName || "Not provided" },
                                        { label: "Marital Status", value: registrationData.maritalStatus || "Not provided" },
                                        ...(registrationData.spouseName
                                            ? [{ label: "Spouse's Name", value: registrationData.spouseName }]
                                            : []),
                                        { label: "Emergency Contact", value: registrationData.emergencyContact || "Not provided" }
                                    ].map((item, idx) => (
                                        <div key={idx}>
                                            <p className="text-xs sm:text-sm text-gray-400">{item.label}</p>
                                            <p className="text-white font-medium text-sm sm:text-base">{item.value}</p>
                                        </div>
                                    ))}
                                </CardBody>
                            </Card>

                            {/* Permanent Address */}
                            <Card className="bg-[#2a2520] border border-[#b68938]/40 rounded-xl">
                                <CardHeader className="pb-3 sm:pb-4">
                                    <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-semibold" style={{color: '#b68938'}}>
                                        <MapPin className="w-5 h-5" /> Permanent Address
                                    </div>
                                </CardHeader>
                                <CardBody className="space-y-3 sm:space-y-4 pt-0">
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-400">Street Address</p>
                                        <p className="text-white font-medium text-sm sm:text-base">{registrationData.permanentStreet || "Not provided"}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-400">City</p>
                                            <p className="text-white font-medium text-sm sm:text-base">{registrationData.permanentCity || "Not provided"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-400">State</p>
                                            <p className="text-white font-medium text-sm sm:text-base">{registrationData.permanentState || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-400">ZIP Code</p>
                                            <p className="text-white font-medium text-sm sm:text-base">{registrationData.permanentZip || "Not provided"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-400">Country</p>
                                            <p className="text-white font-medium text-sm sm:text-base">{registrationData.permanentCountry || "Not provided"}</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Current Address */}
                            <Card className="bg-[#2a2520] border border-[#b68938]/40 rounded-xl">
                                <CardHeader className="pb-3 sm:pb-4">
                                    <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-semibold" style={{color: '#b68938'}}>
                                        <Building className="w-5 h-5" /> Current Address
                                    </div>
                                </CardHeader>
                                <CardBody className="space-y-3 sm:space-y-4 pt-0">
                                    {registrationData.sameAsPermanent ? (
                                        <p className="text-gray-400 italic text-sm sm:text-base">Same as permanent address</p>
                                    ) : (
                                        <>
                                            <div>
                                                <p className="text-xs sm:text-sm text-gray-400">Street Address</p>
                                                <p className="text-white font-medium text-sm sm:text-base">{registrationData.currentStreet || "Not provided"}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-400">City</p>
                                                    <p className="text-white font-medium text-sm sm:text-base">{registrationData.currentCity || "Not provided"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-400">State</p>
                                                    <p className="text-white font-medium text-sm sm:text-base">{registrationData.currentState || "Not provided"}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-400">ZIP Code</p>
                                                    <p className="text-white font-medium text-sm sm:text-base">{registrationData.currentZip || "Not provided"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-400">Country</p>
                                                    <p className="text-white font-medium text-sm sm:text-base">{registrationData.currentCountry || "Not provided"}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardBody>
                            </Card>

                            {/* Identification Details */}
                            <Card className="bg-[#2a2520] border border-[#b68938]/40 rounded-xl">
                                <CardHeader className="pb-3 sm:pb-4">
                                    <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-semibold" style={{color: '#b68938'}}>
                                        <FileText className="w-5 h-5" /> Identification Details
                                    </div>
                                </CardHeader>
                                <CardBody className="space-y-3 sm:space-y-4 pt-0">
                                    {[
                                        { label: "ID Type", value: registrationData.idType || "Not provided" },
                                        { label: "ID Number", value: registrationData.idNumber || "Not provided" },
                                        { label: "Issue Date", value: registrationData.idIssueDate || "Not provided" },
                                        { label: "Expiry Date", value: registrationData.idExpiryDate || "Not provided" },
                                        { label: "Issuing Authority", value: registrationData.issuingAuthority || "Not provided" }
                                    ].map((item, idx) => (
                                        <div key={idx}>
                                            <p className="text-xs sm:text-sm text-gray-400">{item.label}</p>
                                            <p className="text-white font-medium text-sm sm:text-base">{item.value}</p>
                                        </div>
                                    ))}
                                </CardBody>
                            </Card>

                            {/* Documents */}
                            <Card className="bg-[#2a2520] border border-[#b68938]/40 rounded-xl">
                                <CardHeader className="pb-3 sm:pb-4">
                                    <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-semibold" style={{color: '#b68938'}}>
                                        <FileText className="w-5 h-5" /> Documents
                                    </div>
                                </CardHeader>
                                <CardBody className="space-y-3 sm:space-y-4 pt-0">
                                    {[
                                        { label: "ID Document", value: registrationData.idDocument ? "✓ Uploaded" : "Not uploaded" },
                                        { label: "Address Proof", value: registrationData.addressProof ? "✓ Uploaded" : "Not uploaded" },
                                        { label: "Income Proof", value: registrationData.incomeProof ? "✓ Uploaded" : "Not uploaded" },
                                        { label: "Additional Documents", value: registrationData.additionalDocs ? "✓ Uploaded" : "Not uploaded" }
                                    ].map((item, idx) => (
                                        <div key={idx}>
                                            <p className="text-xs sm:text-sm text-gray-400">{item.label}</p>
                                            <p className="text-white font-medium text-sm sm:text-base">{item.value}</p>
                                        </div>
                                    ))}
                                </CardBody>
                            </Card>
                        </div>

                        {/* Bank Information */}
                        <Card className="bg-[#2a2520] border border-[#b68938]/40 rounded-xl">
                            <CardHeader className="pb-3 sm:pb-4">
                                <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-semibold" style={{color: '#b68938'}}>
                                    <CreditCard className="w-5 h-5" /> Bank Information
                                </div>
                            </CardHeader>
                            <CardBody className="pt-0">
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-400">Bank</p>
                                    <p className="text-white font-medium text-sm sm:text-base">SRK Bank</p>
                                </div>
                            </CardBody>
                        </Card>

                        <div 
                            className="h-px w-full" 
                            style={{
                                background: 'linear-gradient(90deg, transparent, #b68938, transparent)', 
                                opacity: 0.3
                            }}
                        ></div>

                        <div className="space-y-3 pt-2">
                            <Button
                                onPress={handleConfirm}
                                className="w-full h-11 sm:h-12 text-sm sm:text-base text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                style={{background: 'linear-gradient(125deg, #e1ba73, #b68938)'}}
                                isDisabled={isLoading}
                            >
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>
                            <Button
                                onPress={handleEdit}
                                variant="bordered"
                                className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
                                style={{borderColor: '#b68938', color: '#b68938'}}
                            >
                                Edit Details
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}
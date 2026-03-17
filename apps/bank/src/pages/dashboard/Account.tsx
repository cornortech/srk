import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Card, Avatar, CardHeader, CardBody } from "@nextui-org/react";
import { Mail, Phone, CreditCard } from "lucide-react";

export default function MyBankAccountPage() {
    const navigate = useNavigate();

    // Mocked user data instead of useAuth API
    const [user] = useState({
        fullName: "John Doe",
        profileImage: "",
        accountNumber: "1234567890",
        email: "john@example.com",
        phoneNumber: "+1 555-123-4567",
        balance: 1200.5,
    });

    const handleLogout = () => {
        alert("You have been logged out.");
        navigate("/login");
    };

    return (
        <div style={{ background: "#131212", minHeight: "100vh", padding: "1rem" }}>
            <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
                    <Button
                        onClick={() => navigate("/dashboard")}
                    />
                    <h1 style={{ color: "white", marginLeft: "0.5rem" }}>My Account</h1>
                </div>

                {/* Profile Card */}
                <Card >
                    <CardHeader style={{ display: "block" }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
                            <Avatar
                                src={user.profileImage || "/placeholder.svg"}
                                color="warning"
                            />
                            <div style={{ marginLeft: "1rem" }}>
                                <h4 style={{ color: "white", margin: 0 }}>{user.fullName}</h4>
                                <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>SRK Bank Customer</p>
                                <p style={{ color: "#b68938", fontFamily: "monospace", margin: 0 }}>
                                    {user.accountNumber}
                                </p>
                            </div>
                        </div>

                        <div style={{ background: "#2a2a2a", borderRadius: "8px", padding: "0.75rem", marginBottom: "0.75rem" }}>
                            <Mail size={18} color="#b68938" style={{ marginRight: "0.5rem" }} />
                            <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Email</p>
                            <p style={{ color: "white", margin: 0 }}>{user.email}</p>
                        </div>

                        <div style={{ background: "#2a2a2a", borderRadius: "8px", padding: "0.75rem", marginBottom: "0.75rem" }}>
                            <Phone size={18} color="#b68938" style={{ marginRight: "0.5rem" }} />
                            <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Phone</p>
                            <p style={{ color: "white", margin: 0 }}>{user.phoneNumber}</p>
                        </div>

                        <div style={{ background: "#2a2a2a", borderRadius: "8px", padding: "0.75rem" }}>
                            <CreditCard size={18} color="#b68938" style={{ marginRight: "0.5rem" }} />
                            <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Account Balance</p>
                            <p style={{ color: "white", fontWeight: "bold", fontSize: "20px", margin: 0 }}>
                                ${user.balance.toLocaleString()}
                            </p>
                        </div>
                    </CardHeader>
                </Card>

                {/* Account Settings */}
                <Card >
                    <CardHeader>
                        <p style={{ color: "white", fontWeight: "bold", margin: 0 }}>Account Settings</p>
                    </CardHeader>
                    <CardBody>
                        <Button
                            onClick={() => alert("Edit profile feature placeholder")}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            onClick={() => alert("Settings feature placeholder")}
                        >
                            Account Settings
                        </Button>
                        <Link to="/statement" style={{ textDecoration: "none" }}>
                            <Button
                            >
                                View Statement
                            </Button>
                        </Link>
                    </CardBody>
                </Card>

                {/* Logout Button */}
                <Button
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </div>
        </div>
    );
}

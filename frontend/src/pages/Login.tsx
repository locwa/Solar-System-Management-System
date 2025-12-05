import {useNavigate} from "react-router-dom"; // Changed to react-router-dom
import {useState, useEffect} from "react"; // Removed useContext
import { useAuth } from "../context/AuthContext.tsx"; // Import useAuth
import React from "react"; // Explicitly import React for React.FormEvent

export function Login() {
    const navigate = useNavigate();
    const { login, loading, user } = useAuth(); // Use useAuth hook

    const [currentSlide, setCurrentSlide] = useState(0);
    const [username, setUsername] = useState(""); // Changed email to username
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // New loading state for login form

    useEffect(() => {
      if (!loading && user) {
        navigate("/", { replace: true }); // Redirect to dashboard if already logged in
      }
    }, [user, loading, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Username: username, Password: password }), // Changed Email to Username
            });

            if (response.ok) {
                const userData = await response.json();
                login(userData.user); // Use the login function from AuthContext
                navigate("/", { replace: true });
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Login failed");
            }
        } catch (err) {
            setError("Network error or server unavailable");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const carouselItems = [
        {
            title: "Olympus Mons",
            description: "Olympus Mons is a large shield volcano on Mars. It is over 21.9km 13.6mi; 72,000ft high as measured by the Mars Orbiter Laser Altimeter.",
            image: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Olympus_Mons_-_ESA_Mars_Express_-_Flickr_-_Andrea_Luck.png"
        },
        {
            title: "Great Red Spot",
            description: "The Great Red Spot is a persistent high-pressure region in the atmosphere of Jupiter",
            image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Jupiter_-_Great_Red_Spot_-_PJ7-60_61_62_-_Balanced_%2849803032983%29.png",
        },
        {
            title: "Mount Everest",
            description: "Mount Everest is Earth's highest mountain above sea level. ",
            image: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Mount_Everest_as_seen_from_Drukair2_PLW_edit_Cropped.jpg",
        },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Carousel */}
            <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-gray-900">
                {/* Carousel Images */}
                {carouselItems.map((item, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br`}></div>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
                            <div className="max-w-2xl">
                                <h2 className="text-5xl font-bold mb-4 animate-fade-in">
                                    {item.title}
                                </h2>
                                <p className="text-xl text-gray-100 mb-8 animate-fade-in">
                                    {item.description}
                                </p>

                            </div>
                        </div>
                    </div>
                ))}

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="47" viewBox="0 0 46 47" fill="none">
                        <path d="M14.9979 25.4583L25.7312 36.425L23 39.1667L7.66667 23.5L23 7.83334L25.7312 10.575L14.9979 21.5417H38.3333V25.4583H14.9979Z" fill="#FEF7FF"/>
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
                        <path d="M31.6761 25.4583L20.7094 36.425L23.5 39.1667L39.1667 23.5L23.5 7.83334L20.7094 10.575L31.6761 21.5417H7.83335V25.4583H31.6761Z" fill="#FEF7FF"/>
                    </svg>
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {carouselItems.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                index === currentSlide
                                    ? "bg-white w-8"
                                    : "bg-white/50 hover:bg-white/75"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-[#1d1d1d]">
                <div className="w-full max-w-md">


                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
                            <p className="text-sm text-gray-500 mt-1">Enter your credentials to continue</p>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className="mb-5">
                                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Enter your username"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : "Sign In"}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-6">
                        <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                        </svg>
                        Your information is secure and confidential
                    </p>
                </div>
            </div>
        </div>
    );
}

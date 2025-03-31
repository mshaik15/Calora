import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const [username, setUsername] = useState("");
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [food, setFood] = useState("");
    const [servingSize, setServingSize] = useState("");
    const [foodList, setFoodList] = useState([]);
    const [totalNutrition, setTotalNutrition] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugars: 0
    });
    const [foodLogs, setFoodLogs] = useState([]);
    const [foodLogsLoading, setFoodLogsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedInUser = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                console.log("Access Token:", token);

                if (token) {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    };
                    
                    try {
                        const response = await axios.get("http://127.0.0.1:8000/api/user/", config);
                        console.log("User Response:", response.data);
                        setLoggedIn(true);
                        setUsername(response.data.username);
                    } catch (userError) {
                        console.error("User fetch error:", userError);
                        setLoggedIn(false);
                        setUsername("");
                        navigate("/login");
                    }
                } else {
                    setLoggedIn(false);
                    setUsername("");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Login check error:", error);
                setError(error.message);
                setLoggedIn(false);
                setUsername("");
            } finally {
                setIsLoading(false);
            }
        };

        checkLoggedInUser();
    }, [navigate]);

    const fetchNutritionData = async () => {
        if (!food || !servingSize) {
            alert("Please enter both food and serving size!");
            return;
        }

        const apiUrl = "https://api.edamam.com/api/nutrition-data";
        const params = {
            app_id: "Your API ID",
            app_key: "Your API Key",
            ingr: `${servingSize} ${food}`,
        };

        try {
            const response = await axios.get(apiUrl, { params });
            console.log("Nutrition Data:", response.data);

            const newFood = {
                name: `${servingSize} ${food}`,
                calories: response.data.calories || 0,
                protein: response.data.totalNutrients?.PROCNT?.quantity || 0,
                carbs: response.data.totalNutrients?.CHOCDF?.quantity || 0,
                fat: response.data.totalNutrients?.FAT?.quantity || 0,
                sugars: response.data.totalNutrients?.SUGAR?.quantity || 0,
            };

            setFoodList([...foodList, newFood]);

            setTotalNutrition((prev) => ({
                calories: (prev.calories || 0) + newFood.calories,
                protein: (prev.protein || 0) + newFood.protein,
                carbs: (prev.carbs || 0) + newFood.carbs,
                fat: (prev.fat || 0) + newFood.fat,
                sugars: (prev.sugars || 0) + newFood.sugars,
            }));

            setFood("");
            setServingSize("");
        } catch (error) {
            console.error("Error fetching nutrition data:", error);
            alert("Failed to fetch nutrition data");
        }
    };

    //Work in progress coming soon
    const fetchFoodLogs = async () => {
        try {
            setFoodLogsLoading(true);
            const token = localStorage.getItem("accessToken");
            
            const response = await axios.get("http://127.0.0.1:8000/api/food-logs/", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setFoodLogs(response.data);


            if (response.data.length > 0) {
                const mostRecentLog = response.data[0];
                
                setFoodList(mostRecentLog.food_items);
                

                const totals = mostRecentLog.food_items.reduce((acc, item) => {
                    return {
                        calories: acc.calories + item.calories,
                        protein: acc.protein + item.protein,
                        carbs: acc.carbs + item.carbs,
                        fat: acc.fat + item.fat,
                        sugars: acc.sugars + (item.sugars || 0)
                    };
                }, { calories: 0, protein: 0, carbs: 0, fat: 0, sugars: 0 });
                
                setTotalNutrition(totals);
            }
        } catch (error) {
            console.error("Failed to fetch food logs:", error);
            alert("Failed to load food logs");
        } finally {
            setFoodLogsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
        
            if (foodList.length > 0) {
                const token = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
            
                await axios.post(
                    "http://127.0.0.1:8000/api/save-food-log/",
                    { food_items: foodList },
                    config
                );
            
                console.log("Food log saved successfully!");
            }
        

            const refreshToken = localStorage.getItem("refreshToken");
            const accessToken = localStorage.getItem("accessToken");

            if (refreshToken && accessToken) {

                await axios.post(
                    "http://127.0.0.1:8000/api/logout/",
                    { refresh: refreshToken },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }
                );

                // Clear local storage
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            
                // Update state
                setLoggedIn(false);
                setUsername("");
                setFoodList([]);
                setTotalNutrition({ calories: 0, protein: 0, carbs: 0, fat: 0, sugars: 0 });
            
                setTimeout(() => {
                    navigate("/login");
                }, 300);

                console.log("Successful Logout!")
            }
        } catch (error) {
            console.log("Failed operation:", error);

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setLoggedIn(false);

            setTimeout(() => {
                navigate("/login");
            }, 300);
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (isLoggingOut) {
        return <div>Logging out...</div>;
    }

    const caloriePercentage = (totalNutrition.calories / 2000) * 100; //Use 2000 as a estimate for now

    return (
        <div className="main">
            <div className="container">
                {isLoggedIn ? (
                    <>
                        {/* Header */}
                        <div className="header">
                            {/* Logo */}
                            <h1 className="logo">CALORA</h1>
                            
                            {/* Header Buttons */}
                            <div className="header-buttons">
                                <button className="header-button" onClick={() => navigate("/history")}>
                                    <span className="button-text">View History</span>
                                </button>

                                <button className="header-button" onClick={handleLogout}>
                                    <span className="button-text">Log Out</span>
                                </button>
                            </div>
                        </div>

                        {/* Welcome Message */}
                        <h1 className="welcome-message">Welcome {username}</h1>

                        {/* Main Content - Three Cards */}
                        <div className="cards-container">
                            {/* Add Item Card */}
                            <div className="card add-item-card">
                                <div className="card-content">
                                    <h2 className="card-title">Item Name</h2>
                                    <input 
                                        className="input" 
                                        type="text"
                                        value={food}
                                        onChange={(e) => setFood(e.target.value)}
                                        placeholder="Enter item name"
                                    />

                                    <h2 className="card-title">Serving Size</h2>
                                    <input 
                                        className="input" 
                                        type="text"
                                        value={servingSize}
                                        onChange={(e) => setServingSize(e.target.value)}
                                        placeholder="Enter serving size"
                                    />

                                    <button className="add-button" onClick={fetchNutritionData}>
                                        <span className="button-text">Add</span>
                                    </button>
                                </div>
                            </div>

                            {/* Nutritional Facts Card */}
                            {foodList.length > 0 && (
                                <div className="card nutrition-card">
                                    <div className="nutrition-content">
                                        <h2 className="nutrition-title">Nutritional Facts</h2>

                                        <p className="servings">
                                            Servings: {foodList.length} {foodList.length > 1 ? 'Items' : 'Item'}
                                        </p>

                                        <div className="separator-large"></div>

                                        <div className="calories">Calories {totalNutrition.calories.toFixed(0)}</div>

                                        <div className="separator-medium"></div>

                                        <div className="daily-value">%Daily Value (DV)</div>

                                        <div className="separator-small"></div>

                                        <div className="nutrient-row">
                                            <span>Total Fat {totalNutrition.fat.toFixed(1)}g</span>
                                            <span>{((totalNutrition.fat / 78) * 100).toFixed(0)}%</span>
                                        </div>

                                        <div className="separator-small"></div>

                                        <div className="nutrient-row">
                                            <span>Total Carbohydrate {totalNutrition.carbs.toFixed(1)}g</span>
                                            <span>{((totalNutrition.carbs / 275) * 100).toFixed(0)}%</span>
                                        </div>

                                        <div className="separator-small"></div>

                                        <div className="sub-nutrient">
                                            Sugars {totalNutrition.sugars.toFixed(1)}g
                                        </div>

                                        <div className="separator-small"></div>

                                        <div className="nutrient-row">
                                            <span>Protein {totalNutrition.protein.toFixed(1)}g</span>
                                            <span>{((totalNutrition.protein / 50) * 100).toFixed(0)}%</span>
                                        </div>

                                        <div className="separator-large"></div>

                                        <div className="disclaimer">
                                            The % Daily Value (DV) tells you how much of a nutrient has been
                                            consumed to a daily diet. 2,000 calories a day is used for
                                            general nutrition
                                            <br />
                                            <br />
                                            NOT MEDICAL ADVICE CONSULT A DOCTOR!!!!!!
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Chart Card */}
                            {foodList.length > 0 && (
                                <div className="card chart-card">
                                    <div className="chart-content">
                                        <div className="chart-container">
                                            <svg viewBox="0 0 36 36" className="circular-chart">
                                                <path
                                                    className="circle-bg"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                                <path
                                                    className="circle"
                                                    strokeDasharray={`${Math.min(caloriePercentage, 100)}, 100`}
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                                <text x="18" y="20.35" className="percentage">
                                                    {caloriePercentage.toFixed(0)}%
                                                </text>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="login-prompt">
                        <h2>Please Login</h2>
                        <button className="login-button" onClick={() => navigate("/login")}>
                            Go to Login Page
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
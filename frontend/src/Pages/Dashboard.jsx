import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";
import "../styles/dashboard.css";
function Dashboard() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTrips(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDeleteTrip = async (tripId) => {
    const confirmDelete = window.confirm("Delete this trip?");

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/trips/${tripId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTrips(trips.filter((trip) => trip._id !== tripId));
    } catch (error) {
      console.log(error);

      alert("Failed to delete trip");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>🌍 Travel Planner AI</h1>
          <p>Plan, manage and customize your trips</p>
        </div>

        <div className="header-actions">
          <button
            className="create-btn"
            onClick={() => navigate("/create-trip")}
          >
            + Create Trip
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {trips.length === 0 ? (
          <div className="empty-state">
            <h2>No Trips Yet</h2>
            <p>Create your first AI-powered travel itinerary.</p>
          </div>
        ) : (
          <div className="trip-grid">
            {trips.map((trip) => (
              <div key={trip._id} className="trip-card">
                <h2>{trip.destination}</h2>

                <div className="trip-info">
                  <span>📅 {trip.durationDays} Days</span>

                  <span>💰 {trip.budgetTier}</span>
                </div>

                <div className="trip-actions">
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/trip/${trip._id}`)}
                  >
                    View Trip
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTrip(trip._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

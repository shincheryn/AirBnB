import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMySpots, deleteSpot } from "../../store/spots";
import ConfirmationModal from "./ConfirmationModal";
import "./ManageSpots.css";

function ManageSpots() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedSpot, setSelectedSpot] = useState(null);

  //Spots
  let spots = useSelector((state) => state?.spots?.mySpots);
  if (spots) spots = Object.values(spots);

  //Reviews
  const reviews = useSelector((state) =>
    Object.values(state.reviews).filter(
      (review) => review.spotId === parseInt(id)
    )
  );
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.stars, 0) / totalReviews
      : 0;

  useEffect(() => {
    dispatch(fetchMySpots());
  }, [dispatch]);

  const handleUpdateSpot = (spotId) => {
    history.push(`/spots/${spotId}/update`);
  };

  const handleDeleteSpot = (spotId) => {
    setSelectedSpot(spotId);
  };

  const handleConfirmationModalAction = (confirmed) => {
    if (confirmed && selectedSpot) {
      dispatch(deleteSpot(selectedSpot))
        .then(() => {
          window.location.reload(); // Refresh the page
        })
        .catch((error) => {
          console.error("Spot deletion failed:", error);
        });
    }
    setSelectedSpot(null);
  };

  // Check if the user has any spots
  if (!spots || spots.length === 0) {
    return (
      <div>
        <h2 className="heading">Manage Your Spots</h2>
        <Link to="/spots/new" className="create-spot-link">
          Create a New Spot
        </Link>
        <p>No spots found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="heading">Manage Your Spots</h2>
      <Link to="/spots/new" className="create-spot-link">
        Create a New Spot
      </Link>
      <div className="spot-list">
        {spots.map((spot) => (
          <div key={spot?.id} className="spot-list">
            <Link to={`/spots/${spot?.id}`} className="spot">
              <div className="spot-thumbnail">
                <img src={spot?.thumbnail} alt="Spot Thumbnail" />
              </div>

              <div className="spot-details">
                <div className="spot-callout-price">${spot?.price} / night</div>
                {totalReviews === 0 ? (
                  <div>
                    <div className="spot-callout-rating">
                      <i className="fa-solid fa-star"></i> NEW
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="spot-callout-rating">
                      <i className="fa-solid fa-star"></i> Rating:{" "}
                      {averageRating.toFixed(2)}
                    </div>
                    <div className="spot-callout-reviews">{totalReviews}</div>
                  </div>
                )}

              </div>
            </Link>
            <div className="spot-buttons">
                  <button
                    className="update-button"
                    onClick={() => handleUpdateSpot(spot?.id)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteSpot(spot?.id)}
                  >
                    Delete
                  </button>
                </div>
            </div>

        ))}
      </div>

      {selectedSpot && (
        <ConfirmationModal
          title="Confirm Delete"
          message="Are you sure you want to delete this spot?"
          onAction={handleConfirmationModalAction}
        />
      )}
    </div>
  );
}

export default ManageSpots;

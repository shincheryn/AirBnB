import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import './spots.css';

function Spots() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.all.Spots);
  //due to initialState, but this will have to change eventually
  const history = useHistory();

  useEffect(() => {
    dispatch(spotActions.fetchSpots());
  }, [dispatch]);

  useEffect(() => {
    const redirectToRoot = () => {
      history.push('/');
    };
    redirectToRoot();
  }, [history]);

  return (
    <div>
      <div className="spot-list">
        {spots.map((spot) => (
          <div key={spot.id} className="spot">
            <div className="spot-image" style={{ backgroundImage: `url(${spot.image})` }}></div>
            <div className="spot-details">
              <div className="spot-location">{`${spot.city}, ${spot.state}`}</div>
              <div className="spot-rating">
                <img src="./star-icon.png" alt="star" className="star-icon" />
                {spot.rating}
              </div>
              <div className="spot-price">${spot.price} per night</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Spots;

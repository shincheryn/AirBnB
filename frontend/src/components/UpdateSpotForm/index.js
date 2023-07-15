import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetail, updateSpot } from '../../store/spots';
import CreateSpotForm from '../CreateSpotForm';

function SpotUpdate() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots[id]);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getSpotDetail(id)).catch((err) => {
      console.error(err);
      setError('Failed to fetch spot details');
    });
  }, [dispatch, id]);

  const handleSubmit = (formData) => {
    dispatch(updateSpot(id, formData))
      .then(() => {
        history.push(`/spots/${id}/update`);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to update spot');
      });
  };

  if (!spot) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Update your Spot</h1>
      {error && <div>Error: {error}</div>}
      <CreateSpotForm
        initialValues={{
          country: spot.country,
          streetAddress: spot.address,
          city: spot.city,
          state: spot.state,
          description: spot.description,
          title: spot.name,
          price: spot.price,
          previewImage: spot.previewImage,
          imageUrls: spot.imageUrls,
        }}
        onSubmit={handleSubmit}
        submitButtonText="Update your Spot"
      />
    </div>
  );
}

export default SpotUpdate;

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getSpotDetail(id))
      .then(() => setIsLoading(false))
      .catch((err) => console.error(err));
  }, [dispatch, id]);

  const handleSubmit = (formData) => {
    dispatch(updateSpot(id, formData))
      .then(() => {
        history.push(`/spots/${id}`);
      })
      .catch((err) => console.error(err));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Update your Spot</h1>
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

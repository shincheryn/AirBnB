import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { updateSpot, getSpotDetail } from '../../store/spots';
import './UpdateSpotForm.css';

function UpdateSpotForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const spot = useSelector((state) => state.spots[id]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    country: '',
    streetAddress: '',
    city: '',
    state: '',
    description: '',
    title: '',
    price: '',
    previewImage: '',
  });

  useEffect(() => {
    dispatch(getSpotDetail(id))
      .then((data) => {
        setIsLoading(false);
        setFormData({
          country: spot?.country,
          streetAddress: spot?.address,
          city: spot?.city,
          state: spot?.state,
          description: spot?.description,
          title: spot?.name,
          price: spot?.price,
          previewImage: spot?.previewImage,
        });
      })
      .catch((err) => console.error(err));
  }, [dispatch, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSpot(id, formData))
      .then(() => {
        history.push(`/spots/${id}`);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="create-spot-form">
      <h1>Update Your Spot</h1>
      <form onSubmit={handleSubmit}>
        <section>
          <h2>Where's your place located?</h2>
          <p>Guests will only get your exact address once they book a reservation.</p>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
            />
          </div>
          <div className="form-group">
            <label htmlFor="streetAddress">Street Address</label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              placeholder="Street Address"
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>
        </section>
        <section>
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amenities like fast wifi or parking,
            and what you love about the neighborhood.
          </p>
          <div className="form-group">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please write at least 30 characters"
            ></textarea>
          </div>
        </section>
        <section>
          <h2>Create a title for your spot</h2>
          <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
          <div className="form-group">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Name of your spot"
            />
          </div>
        </section>
        <section>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <div className="form-group">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price per night (USD)"
            />
          </div>
        </section>
        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <div className="form-group">
            <input
              type="text"
              name="previewImage"
              value={formData.previewImage}
              onChange={handleChange}
              placeholder="Preview Image URL"
            />
          </div>
        </section>
        <button type="submit">Update Your Spot</button>
      </form>
    </div>
  );
}

export default UpdateSpotForm;

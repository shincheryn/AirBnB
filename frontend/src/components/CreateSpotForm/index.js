import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createSpot } from '../../store/spots';
import './CreateSpotForm.css';

function CreateSpotForm() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [country, setCountry] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState({});
  const [previewImage, setPreviewImage] = useState('');
  const [imageUrls, setImageUrls] = useState(['', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSpot = async (e) => {
    e.preventDefault();

    // Validation
    const errors = {};
    if (!country) {
      errors.country = 'Country is required';
    }
    if (!streetAddress) {
      errors.streetAddress = 'Street address is required';
    }
    if (!city) {
      errors.city = 'City is required';
    }
    if (!state) {
      errors.state = 'State is required';
    }
    if (!description || description.length < 30) {
      errors.description = 'Description needs 30 or more characters';
    }
    if (!title) {
      errors.title = 'Title is required';
    }
    if (isNaN(Number(price))) {
      errors.price = 'Price is required';
    }
    if (!previewImage) {
      errors.previewImage = 'Preview Image URL is required';
    }
    if (!imageUrls) {
      errors.imageUrls = 'Image URL must end in .png, .jpg, or .jpeg';
    }
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      const spotData = {
        country,
        address: streetAddress,
        city,
        state,
        description,
        name: title,
        price,
        previewImage,
        imageUrls,
      };

      try {
        const spot = await dispatch(createSpot(spotData));
        history.push(`/spots/${spot.id}`);
      } catch (error) {
        console.log('Spot creation failed:', error);
      }

      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-spot-form">
      <h1>Create a New Spot</h1>
      <form onSubmit={handleCreateSpot}>
        <section>
          <h2>Where's your place located?</h2>
          <p>Guests will only get your exact address once they book a reservation.</p>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
            />
            {errors.country && <p className="error">{errors.country}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="streetAddress">Street Address</label>
            <input
              type="text"
              id="streetAddress"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Street Address"
            />
            {errors.streetAddress && <p className="error">{errors.streetAddress}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
            {errors.city && <p className="error">{errors.city}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
            />
            {errors.state && <p className="error">{errors.state}</p>}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please write at least 30 characters"
            ></textarea>
            {errors.description && <p className="error">{errors.description}</p>}
          </div>
        </section>
        <section>
          <h2>Create a title for your spot</h2>
          <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
          <div className="form-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name of your spot"
            />
            {errors.title && <p className="error">{errors.title}</p>}
          </div>
        </section>
        <section>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <div className="form-group">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price per night (USD)"
            />
            {errors.price && <p className="error">{errors.price}</p>}
          </div>
        </section>
        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <div className="form-group">
            <input
              type="text"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              placeholder="Preview Image URL"
            />
            {errors.previewImage && <p className="error">{errors.previewImage}</p>}
          </div>
          {imageUrls.map((imageUrl, index) => (
            <div className="form-group" key={index}>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => {
                  const newImageUrls = [...imageUrls];
                  newImageUrls[index] = e.target.value;
                  setImageUrls(newImageUrls);
                }}
                placeholder="Image URL"
              />
            </div>
          ))}
        </section>
        <button type="submit" disabled={isSubmitting}>
          Create Spot
        </button>
      </form>
    </div>
  );
}

export default CreateSpotForm;

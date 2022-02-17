import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from "react-bootstrap";

import Auth from "../utils/auth";
import { searchGoogleRestaurants } from "../utils/API";
import { saveRestaurantIds, getSavedRestaurantIds } from "../utils/localStorage";

import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../utils/mutations";
const SearchRestaurants = () => {
  // create state for holding returned google api data
  const [searchedRestaurants, setSearchedRestaurants] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved restaurantId values
  const [savedRestaurantIds, setSavedRestaurantIds] = useState(getSavedRestaurantIds());

  const [saveRestaurant, { error }] = useMutation(SAVE_BOOK);
  // set up useEffect hook to save `savedRestaurantIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveRestaurantIds(savedRestaurantIds);
  });

  // create method to search for restaurants and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleRestaurants(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const restaurantData = items.map((restaurant) => ({
        restaurantId: restaurant.id,
        authors: restaurant.volumeInfo.authors || ["No author to display"],
        title: restaurant.volumeInfo.title,
        description: restaurant.volumeInfo.description,
        image: restaurant.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedRestaurants(restaurantData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a restaurant to our database
  const handleSaveRestaurant = async (restaurantId) => {
    // find the restaurant in `searchedRestaurants` state by the matching id
    const restaurantToSave = searchedRestaurants.find((restaurant) => restaurant.restaurantId === restaurantId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveRestaurant({ variables: { input: restaurantToSave } });

      // if restaurant successfully saves to user's account, save restaurant id to state
      setSavedRestaurantIds([...savedRestaurantIds, restaurantToSave.restaurantId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Search for Restaurants!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a restaurant"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedRestaurants.length
            ? `Viewing ${searchedRestaurants.length} results:`
            : "Search for a restaurant to begin"}
        </h2>
        <CardColumns>
          {searchedRestaurants.map((restaurant) => {
            return (
              <Card key={restaurant.restaurantId} border="dark">
                {restaurant.image ? (
                  <Card.Img
                    src={restaurant.image}
                    alt={`The cover for ${restaurant.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{restaurant.title}</Card.Title>
                  <p className="small">Authors: {restaurant.authors}</p>
                  <Card.Text>{restaurant.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedRestaurantIds?.some(
                        (savedRestaurantId) => savedRestaurantId === restaurant.restaurantId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveRestaurant(restaurant.restaurantId)}
                    >
                      {savedRestaurantIds?.some(
                        (savedRestaurantId) => savedRestaurantId === restaurant.restaurantId
                      )
                        ? "This restaurant has already been saved!"
                        : "Save this Restaurant!"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
        {error&&<div>Failed to search for restaurant</div>}
      </Container>
    </>
  );
};

export default SearchRestaurants;

// MoviesList.js
import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

export default function MoviesList() {
    const [movies, setMovies] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetch('https://movieappapi-bor4.onrender.com/movies/getMovies')
            .then(res => res.json())
            .then(data => setMovies(data.movies))
            .catch(err => console.error('Error fetching movies:', err));
    }, []);

    return (
        <Container>
            <Row>
                {movies.map(movie => (
                    <Col md={4} key={movie._id} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{movie.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Directed by {movie.director}</Card.Subtitle>
                                <Card.Text>{movie.description}</Card.Text>
                                {user && (
                                    <>
                                        <Link to={`/getMovieById/${movie._id}`} className="btn btn-primary">
                                            Details
                                        </Link>
                                        <Link to={`/getMovieComments/${movie._id}`} className="btn btn-secondary ml-2">
                                            Comments
                                        </Link>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

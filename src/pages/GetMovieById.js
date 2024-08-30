// MovieDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:4000/movies/getMovie/${id}`)
            .then(res => res.json())
            .then(data => setMovie(data))
            .catch(err => console.error('Error fetching movie details:', err));
    }, [id]);

    return (
        <Container>
            {movie ? (
                <Card>
                    <Card.Body>
                        <Card.Title>{movie.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Directed by {movie.director}</Card.Subtitle>
                        <Card.Text>Year: {movie.year}</Card.Text>
                        <Card.Text>{movie.description}</Card.Text>
                        <Card.Text>Genre: {movie.genre}</Card.Text>
                    </Card.Body>
                </Card>
            ) : (
                <p>Loading movie details...</p>
            )}
        </Container>
    );
}

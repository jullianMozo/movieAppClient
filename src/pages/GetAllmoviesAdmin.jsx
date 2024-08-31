import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function MoviesList() {
    const [movies, setMovies] = useState([]);
    const { user } = useContext(UserContext);

    // State for managing the modal
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Manage form state locally in the component
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');

    useEffect(() => {
        fetch('https://movieappapi-mozo.onrender.com/movies/getMovies')
            .then(res => res.json())
            .then(data => setMovies(data.movies))
            .catch(err => console.error('Error fetching movies:', err));
    }, []);

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');

        fetch(`https://movieappapi-mozo.onrender.com/movies/deleteMovie/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    Swal.fire({
                        title: 'Deleted',
                        icon: 'success',
                        text: data.message
                    });
                    setMovies(movies.filter(movie => movie._id !== id));
                } else {
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: data.error || 'Failed to delete movie.'
                    });
                }
            })
            .catch(err => {
                console.error('Error deleting movie:', err);
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Failed to delete movie.'
                });
            });
    };

    const handleUpdate = (id) => {
        const token = localStorage.getItem('token');

        fetch(`https://movieappapi-mozo.onrender.com/movies/updateMovie/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, year, director, description, genre })
        })
            .then(res => res.json())
            .then(data => {
                if (data.movie) {
                    Swal.fire({
                        title: 'Success',
                        icon: 'success',
                        text: 'Movie updated successfully.'
                    });
                    // Update the movie list or refetch movies here
                    setMovies(movies.map(movie => (movie._id === id ? data.movie : movie)));
                    handleCloseModal();
                } else {
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: data.error || 'Failed to update movie.'
                    });
                }
            })
            .catch(err => {
                console.error('Error updating movie:', err);
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Failed to update movie.'
                });
            });
    };

    const handleShowModal = (movie) => {
        setSelectedMovie(movie);
        setTitle(movie.title);
        setYear(movie.year);
        setDirector(movie.director);
        setDescription(movie.description);
        setGenre(movie.genre);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMovie(null);
        setTitle('');
        setYear('');
        setDirector('');
        setDescription('');
        setGenre('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedMovie) {
            handleUpdate(selectedMovie._id);
        }
    };

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
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(movie._id)}
                                            className="me-2"
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleShowModal(movie)}
                                        >
                                            Update
                                        </Button>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Modal for editing movie details */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formYear">
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDirector">
                            <Form.Label>Director</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter director"
                                value={director}
                                onChange={(e) => setDirector(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formGenre">
                            <Form.Label>Genre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter genre"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

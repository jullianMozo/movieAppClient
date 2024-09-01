import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function AddMovie() {
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [year, setYear] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();

        // Retrieve token from localStorage
        const token = localStorage.getItem('token'); // Make sure to use 'access' based on your provided data
        console.log(token, 'addMovietoken');

        // Ensure token exists
        if (!token) {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'You must be logged in to add a movie.'
            });
            return;
        }

        // Fetch API to create a new movie
        fetch('https://movieappapi-bor4.onrender.com/movies/addMovie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                title, 
                director,
                year: parseInt(year),  // Ensure year is sent as a number
                description,
                genre,
                comments: [] // Include user ID in comments
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data, 'here1');
            if (data._id) {
                Swal.fire({
                    title: 'Movie Added',
                    icon: 'success',
                    text: 'Your movie has been added successfully.'
                });
                setTitle('');
                setDirector('');
                setYear('');
                setDescription('');
                setGenre('');
                
            } else {
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: data.error || 'An error occurred while adding the movie.'
                });
            }
        })
        .catch(err => {
            console.error('Error adding movie:', err);
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Failed to add movie.'
            });
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Add Movie</h2>
            <Form.Group controlId="title">
                <Form.Label>Movie Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Movie name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="MovieDirector">
                <Form.Label>Director</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Director"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="movieYear">
                <Form.Label>Year</Form.Label>
                <Form.Control
                    type="number"  // Change to number for year input
                    placeholder="Enter Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="movieDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Movie Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="movieGenre">
                <Form.Label>Genre</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Movie Genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required
                />
            </Form.Group>
           

            <Button variant="primary" type="submit">
                Add Movie
            </Button>
        </Form>
    );
}

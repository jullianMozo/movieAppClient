import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function MovieComments() {
    const { id } = useParams(); // Get the movie ID from the URL parameters
    const [comments, setComments] = useState([]); // State to store fetched comments
    const [newComment, setNewComment] = useState(''); // State to handle new comment input
    const { user } = useContext(UserContext); // Context to get current user information

    // Effect hook to fetch comments from the server when component mounts or movie ID changes
    useEffect(() => {
        fetch(`https://movie-app-client-psi.vercel.app/movies/getcomments/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Send JWT token for authentication
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch comments'); // Handle HTTP errors
                }
                return res.json();
            })
            .then(data => {
                console.log('Parsed data:', data);
                setComments(data); // Directly set comments as the returned array
            })
            .catch(err => console.error('Error fetching comments:', err));
    }, [id]); // Dependency array, will re-run the effect if `id` changes

    // Function to handle new comment submission
    const handleAddComment = (e) => {
        e.preventDefault();

        fetch(`https://movie-app-client-psi.vercel.app/movies/addComment/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Send JWT token for authentication
            },
            body: JSON.stringify({ comment: newComment }) // Send new comment as request body
        })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                Swal.fire({
                    title: 'Comment Added',
                    icon: 'success',
                    text: 'Your comment has been added successfully.'
                });
                // Update the comments state by adding the new comment to the list
                setComments([...comments, { user: user._id, comment: newComment, movieId: id }]);
                setNewComment(''); // Clear the input field after successful submission
            } else {
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: data.message || 'An error occurred while adding the comment.'
                });
            }
        })
        .catch(err => {
            console.error('Error adding comment:', err);
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Failed to add comment.'
            });
        });
    };

    return (
        <Container>
            <h2>Comments</h2>
            <ListGroup>
                {/* Render comments from the state */}
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <ListGroup.Item key={index}>{comment.comment}</ListGroup.Item>
                    ))
                ) : (
                    <p>No comments available.</p>
                )}
            </ListGroup>
            
            {/* Show form to add a new comment if user is logged in */}
            {user && (
                <Form onSubmit={handleAddComment} className="mt-4">
                    <Form.Group controlId="newComment">
                        <Form.Label>Add a Comment</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit Comment
                    </Button>
                </Form>
            )}
        </Container>
    );
}

import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {

    return (
        <>
            <Row>
                <Col className="p-4 text-center">
                    <h1>Welcome To our Movie Tube App</h1>
                    <p>Create, Update, Delete and View Favorite Movies</p>
                    <Link className="btn btn-primary" to={'/getAllMovies'}>Explore Movies</Link>
                </Col>
            </Row>
        </>
    )
}
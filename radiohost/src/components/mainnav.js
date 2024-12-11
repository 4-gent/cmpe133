import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/mainnav.css'

export default function MainNav() {
    return(
        <div className='main-nav'>
            <Navbar collapseOnSelect expand='lg'>
                <Container fluid>
                    <Navbar.Toggle className='toggler' aria-controls='responsive-navbar-nav' />
                    <Navbar.Collapse id='responsive-navbar-nav'>
                        <Nav className='ms-auto'>
                            <Nav.Link href='/login'>Sign In</Nav.Link>
                            <Nav.Link href='/register'>Create an account</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}
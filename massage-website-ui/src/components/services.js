import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const servicesData = [
    {
      id: 1,
      image: require("../assets/img/services-1.jpg"),
      title: 'Half Body Massage',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis, vel! Accusantium hic fugiat laudantiu earum consequuntur, unde nam et mollitia eaque incidunt sed.'
    },
    {
      id: 2,
      image: require("../assets/img/services-1.jpg"),
      title: 'Hot Stone Massage',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis, vel! Accusantium hic fugiat laudantiu earum consequuntur, unde nam et mollitia eaque incidunt sed.'
    },
    {
      id: 3,
      image: require("../assets/img/services-1.jpg"),
      title: 'Gua Sha Massage',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis, vel! Accusantium hic fugiat laudantiu earum consequuntur, unde nam et mollitia eaque incidunt sed.'
    },
    {
      id: 4,
      image: require("../assets/img/services-1.jpg"),
      title: 'Full Body Massage',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis, vel! Accusantium hic fugiat laudantiu earum consequuntur, unde nam et mollitia eaque incidunt sed.'
    }
  ]

function servicesComponent(){
    return(
        <section id="services" className="block services-block">
            <Container fluid>
                <div className="title-holder">
                    <h2> Our Massage Services </h2>
                </div>
            
                <Row>
                    {
                        servicesData.map( services => {
                            return(
                                <Col>
                                <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={services.image} />
                                <Card.Body>
                                    <Card.Title>{services.title}</Card.Title>
                                    <Card.Text>
                                    {services.description}
                                    </Card.Text>
                                    <Button variant="primary">Go somewhere</Button>
                                </Card.Body>
                                </Card>
                                </Col>
                            );
                        })
                    }
                </Row>
            </Container>
        </section>
    )
}

export default servicesComponent;
import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const servicesData = [
    {
      id: 6,
      image: require("../assets/img/services-1.jpg"),
      title: 'Swedish Massage',
      description: 'A gentle and relaxing full-body massage that uses long strokes, kneading, and circular movements to improve circulation and promote overall relaxation.'      
    },
    {
      id: 7,
      image: require("../assets/img/services-1.jpg"),
      title: 'Deep Tissue Massage',
      description: 'Targets deeper layers of muscles and connective tissue to release chronic tension. This type of massage is often recommended for individuals with muscle injuries or chronic pain.'
    },
    {
      id: 8,
      image: require("../assets/img/services-1.jpg"),
      title: 'Sports Massage',
      description: 'Geared towards athletes, this massage focuses on preventing and treating sports-related injuries. It may involve stretching, compression, and other techniques to enhance athletic performance and aid in recovery.'
    },
    {
      id: 9,
      image: require("../assets/img/services-1.jpg"),
      title: 'Chair Massage',
      description: 'A shorter, seated massage typically performed in a specially designed chair. This type of massage is convenient for individuals who may not have the time for a full-length session.'
    },
    {
      id: 10,
      image: require("../assets/img/services-1.jpg"),
      title: 'Cupping massage',
      description: 'a therapeutic method combining cups with massage techniques, is designed to benefit patients by promoting relaxation, relieving muscle tension, and addressing specific concerns. It create suction on the skin, aiding in increased blood circulation and the release of muscle tension'
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
                                    <Button variant="primary" href={"/booking/" + services.id}>Book Now</Button>
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
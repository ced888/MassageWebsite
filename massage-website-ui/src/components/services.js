import React, {useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ServicesComponent(){
  const [massageServices, setServices] = useState([]);
  useEffect(() => {
    async function fetchData(){
      
        const res = await fetch(`/massagetype/`);
        res
        .json()
        .then(res => setServices(res))
        .catch(err => console.log("Error", err));
        
        return res;
    }
    fetchData();
    //Need to get image url to replace services
    console.log(massageServices);
  },[]);


    return(
        <section id="services" className="block services-block">
            <Container fluid>
                <div className="title-holder">
                    <h2> Our Massage Services </h2>
                </div>
            
                <Row>
                    { 
                      massageServices.map(services=> {
                            return(
                                <Col key={services.MassageTypeID}>
                                <Card style={{ width: '18rem' }} key={services.MassageTypeID}>
                                <Card.Img variant="top" src={require("../assets/img/services-1.jpg")} />
                                <Card.Body>
                                    <Card.Title>{services.MassageType}</Card.Title>
                                    <Card.Text>
                                    {services.MassageDescription}
                                    </Card.Text>
                                    <Button variant="primary" href={"/booking/" + services.MassageType}>Book Now</Button>
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

export default ServicesComponent;
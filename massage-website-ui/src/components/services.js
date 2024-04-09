import React, {useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//import Button from 'react-bootstrap/Button';
//import Card from 'react-bootstrap/Card';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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
                                <Card sx={{ width: '25rem', margin:'1rem'}} key={services.MassageTypeID}>
                                <CardMedia
                                    sx={{ height: 180 }}
                                    image={require(`../assets/img/services/services-${services.MassageTypeID}.jpg`)}
                                    title="green iguana"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                    {services.MassageType}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                    {services.MassageDescription}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{justifyContent:"right", padding:'10px'}}>
                                    <Button variant="contained" href={"/booking/" + services.MassageType +"/"+ services.MassageTypeID}>Book Now</Button>
                                </CardActions>
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
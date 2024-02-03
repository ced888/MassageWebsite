import React from "react";
import Carousel from 'react-bootstrap/Carousel';


var heroData = [
    {
      id: 1,
      image: require('../assets/img/hero-1.jpg'),
      title: 'Hot Stone Massage',
      //description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab suscipit dicta nulla. Consequuntur obcaecati officiis, labore doloribus non tempore impedit consequatur ab dolor. Explicabo quam repellendus vero omnis, nisi odio!',
      link: 'https://www.google.com'
    },
    {
      id: 2,
      image: require('../assets/img/hero-2.jpg'),
      title: 'Half-body Massage',
      //description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab suscipit dicta nulla. Consequuntur obcaecati officiis, labore doloribus non tempore impedit consequatur ab dolor. Explicabo quam repellendus vero omnis, nisi odio!',
      link: 'https://www.google.com'
    },
    {
      id: 3,
      image: require('../assets/img/hero-3.jpg'),
      title: 'Gua Sha Massage',
      //description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab suscipit dicta nulla. Consequuntur obcaecati officiis, labore doloribus non tempore impedit consequatur ab dolor. Explicabo quam repellendus vero omnis, nisi odio!',
      link: 'https://www.google.com'
    }
  ]
  
  function AppHero() {
    return (
      <section id="home" className="hero-block">
         <Carousel>
            {
              heroData.map(hero => {
                return (
                  <Carousel.Item key={hero.id}>
                    <img
                      className="d-block w-100"
                      src={hero.image}
                      alt={"slide " + hero.id}
                    />
                    <Carousel.Caption>
                      <h2>{hero.title}</h2>
                      {/* <p>{hero.description}</p> */}
                      {/* <a className="btn btn-primary" href={hero.link}>Learn More <i className="fas fa-chevron-right"></i></a> */}
                    </Carousel.Caption>             
                  </Carousel.Item>
                );
              })
            }
        </Carousel>
      </section>
    );
  }
  
  export default AppHero;

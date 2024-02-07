import React from 'react';
import './footer.css';
import ig from '../assets/img/instagram_logo.png';
import fb from '../assets/img/facebook_logo.png';
import reddit from '../assets/img/reddit_logo.png';


const footer=()=>{
    return (
        <div className="footer">
            <div className="sb__footer section__padding">
                <div className="sb__footer-links">
                    <div className="sb__footer-links_div">
                        <h3>afterthought massage</h3>
                        <a href="/about">
                            <p>About</p>
                        </a>
                        <a href="/services">
                            <p>Services</p>
                        </a>
                        <a href="/contact">
                            <p>Contact</p>
                        </a>
                    </div>
                    <div className="sb__footer-links_div">
                        <h4>Location:</h4>
                        <a href="/location">
                            <p>xxx Avenue xxx street</p>
                        </a>
                        <h4>Email:</h4>
                        <a href="/email">
                            <p>xxxxxxxxxxxxxx@gmail.com</p>
                        </a>
                        <h4>Telephone:</h4>
                        <a href="/phone">
                            <p>xxx-xxx-xxxx</p>
                        </a>
                    </div>
                    <div className="sb__footer-links_div">
                        <h4>Hours Open:</h4>
                        <p>Mon - Fri</p>
                        <p>9:00am - 8:00pm</p>
                        <p>Sat - Sun</p>
                        <p>11:00am - 6:00pm</p>
                    </div>
                    <div className="sb__footer-links_div">
                        <h4>Social Media:</h4>
                        <a href="/facebook">
                            <p>Facebook <img src={fb} alt=""/></p>
                        </a>
                        <a href="/reddit">
                            <p>Reddit <img src={reddit} alt=""/></p>
                        </a>
                        <a href="/instagram">
                            <p>Instagram <img src={ig} alt=""/></p>
                        </a>
                    </div>
                </div>
            <hr></hr>
            </div> 
        </div>
    )

}

export default footer
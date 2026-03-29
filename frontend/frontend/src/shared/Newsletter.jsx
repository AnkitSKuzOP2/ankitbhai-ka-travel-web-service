import React, { useState } from 'react';
import './Newsletter.css';

import { Container, Row, Col } from 'reactstrap';
import maleTourist from '../assets/images/male-tourist.png';
import { BASE_URL } from '../utils/config';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubscribe = async () => {
        if (!email) return setStatus("Please enter your email");

        try {
            const res = await fetch(`${BASE_URL}/subscribers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const result = await res.json();
            
            setStatus(result.message);
            if (res.ok) {
                setEmail('');
            }
        } catch (error) {
            setStatus("Failed to connect to server");
        }
    };
    return (
        <section className="newsletter">
            <Container>
                <Row>
                    <Col lg="6">
                        <div className="newsletter__content">
                            <h2>Subscribe now to get useful traveling information.</h2>

                            <div className="newsletter__input">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button className="btn newsletter__btn" onClick={handleSubscribe}>Subscribe</button>
                            </div>
                            {status && <p className="mt-3 font-weight-bold" style={{color: "#198754", padding: "10px", backgroundColor: "#fff", borderRadius: "8px"}}>{status}</p>}
                            <p className={status ? "mt-2" : ""}>
                                Stay updated with the latest travel deals, destination guides,
                                and insider tips. We send only the best content — no spam, ever.
                            </p>
                        </div>
                    </Col>
                    <Col lg="6">
                        <div className="newsletter__img">
                            <img src={maleTourist} alt="Tourist" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Newsletter;
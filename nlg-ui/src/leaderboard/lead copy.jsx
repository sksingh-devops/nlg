import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { ProfileOutlined } from '@ant-design/icons';
import { BiShare } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";
const data = [
    {
        id: 1,
        name: 'Player 1',
        image: 'image_url_1',
        rank: 'Rank 1',
        tournament: 'Tournament 1',
        score: 100,
    },
    {
        id: 2,
        name: 'Player 2',
        image: 'image_url_2',
        rank: 'Rank 2',
        tournament: 'Tournament 2',
        score: 90,
    },
    {
        id: 3,
        name: 'Player 3',
        image: 'image_url_3',
        rank: 'Rank 3',
        tournament: 'Tournament 3',
        score: 80,
    },
];

const Lead = (props) => {
    const navigate = useNavigate();
    return (
        <div className="container">
            <Row gutter={16} justify="center" style={{ backgroundColor: '#424141' }}>
                <Col xs={12} sm={12} md={12} lg={6} xl={6} style={{ textAlign: 'center', color: 'white' }}>
                    <div>
                        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>78</p>
                        <p style={{ fontSize: '14px', fontWeight: 'bold' }}>TOTAL PLAYERS</p>
                        <p style={{ fontSize: '12px', fontWeight: 'lighter', whiteSpace: 'normal' }}>Record of all the players with graduating year and performance</p>
                    </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={6} style={{ textAlign: 'center', color: 'white' }}>
                    <div>
                        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>5</p>
                        <p style={{ fontSize: '14px', fontWeight: 'bold' }}>TOTAL TOURNAMENTS</p>
                        <p style={{ fontSize: '12px', fontWeight: 'lighter', whiteSpace: 'normal' }}>No. of tournaments played by each player including average score</p>
                    </div>
                </Col>
            </Row>
            <div className="row">
                <div className="col-md-12">
                    {data.map((item) => (
                        <Row gutter={16} key={item.id}>
                            <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                                <Card
                                    onClick={() => navigate(`/aprofile/${test.email}`)}
                                    title={item.name}
                                    actions={[
                                        <div key="select" onClick={() => navigate(`/aprofile/${test.email}`)} style={{ textAlign: 'center' }}>
                                            <ProfileOutlined style={{ fontSize: 24, color: 'green' }} />
                                            <div>View</div>
                                        </div>,
                                        <div key="share" onClick={() => navigate(`/aprofile/${test.email}`)} style={{ textAlign: 'center' }}>
                                            <BiShare style={{ fontSize: 24, color: 'orange' }} />
                                            <div>Share</div>
                                        </div>,
                                    ]}
                                >
                                    <img src={item.image} alt={item.name} />
                                    <p style={{ fontWeight: 'bold' }}>Rank: {item.rank}</p>
                                    <p style={{ fontWeight: 'bold' }}>Tournament: {item.tournament}</p>
                                    <p style={{ fontWeight: 'bold' }}>Overall Score: {item.score}</p>
                                </Card>
                            </Col>
                        </Row>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Lead;

// actions={[
//     <div key="select" onClick={() => navigate(`/aprofile/${test.email}`)} style={{ textAlign: 'center' }}>
//         <ProfileOutlined style={{ fontSize: 24, color: 'green' }} />
//         <div>View</div>
//     </div>,
//     <div key="share" onClick={() => navigate(`/aprofile/${test.email}`)} style={{ textAlign: 'center' }}>
//         <BiShare style={{ fontSize: 24, color: 'orange' }} />
//         <div>Share</div>
//     </div>,
// ]}
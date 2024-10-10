import PropTypes from 'prop-types';
import { Card, Typography, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Title, Text } = Typography;

const DashboardCard = ({ icon, color, title, description, path, tags }) => {
  const navigate = useNavigate();
  const isExternalLink = path && path.startsWith('http');
  const isApplication = path === null;
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isExternalLink) {
      window.open(path, '_blank');
    } else if (!isApplication) {
      navigate(path);
    }
  };

  return (
    <Card
      hoverable={!isApplication}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        height: '300px',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: isHovered ? '0 14px 28px rgba(0, 0, 0, 0.25)' : '0 10px 20px rgba(0, 0, 0, 0.1)',
        border: 'none',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        transform: isHovered && !isApplication ? 'translateY(-5px)' : 'none',
        cursor: isApplication ? 'default' : 'pointer',
      }}
      styles={{
        body: {
          padding: 0,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      <div style={{
        background: color,
        padding: '30px 20px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.05)' : 'none',
      }}>
        <div style={{
          fontSize: '3rem',
          color: '#fff',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-5px)' : 'none',
        }}>{icon}</div>
      </div>
      <div style={{
        padding: '20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <Title level={3} style={{
            color: '#000',
            margin: '0 0 10px 0',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'translateY(-2px)' : 'none',
          }}>
            {title}
          </Title>
          <Text style={{
            fontSize: '14px',
            color: '#666',
            transition: 'all 0.3s ease',
            opacity: isHovered ? 1 : 0.8,
          }}>{description}</Text>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '15px' }}>
          {tags && tags.map((tag, index) => (
            <Tag key={index} color={tag.color} style={{
              padding: '5px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'none',
            }}>
              {tag.icon} {tag.text}
            </Tag>
          ))}
        </div>
      </div>
    </Card>
  );
};

DashboardCard.propTypes = {
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  path: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string,
    icon: PropTypes.node,
    text: PropTypes.string
  }))
};

export default DashboardCard;
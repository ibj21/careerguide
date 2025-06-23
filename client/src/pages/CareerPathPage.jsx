import './CareerPathPage.css';
import React from 'react';
import { useParams } from 'react-router-dom';
import careerRecommendations from '../data/careerData';

const CareerPathPage = () => {
  const { career } = useParams();
  const decodedCareer = decodeURIComponent(career || '');
  const data = careerRecommendations[decodedCareer];

  if (!data) {
    return <p>No recommendations found for career: {decodedCareer}</p>;
  }

  return (
    <div className="career-container">
      <h1>{decodedCareer}</h1>
      <p>{data.description}</p>

      <h3>Recommended Roles:</h3>
      <ul>
        {data.roles.map((role, index) => (
          <li key={index}>{role}</li>
        ))}
      </ul>

      <h3>Resources:</h3>
      <ul>
        {data.resources.map((resource, index) => (
          <li key={index}>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              {resource.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CareerPathPage;

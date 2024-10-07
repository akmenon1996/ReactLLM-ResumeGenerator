import React, { useState } from 'react';

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface EducationFormProps {
  onSubmit: (education: Education) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ onSubmit }) => {
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const education: Education = { degree, institution, year };
    onSubmit(education);
    setDegree('');
    setInstitution('');
    setYear('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Education</h3>
      <input
        type="text"
        value={degree}
        onChange={(e) => setDegree(e.target.value)}
        placeholder="Degree"
        required
      />
      <input
        type="text"
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
        placeholder="Institution"
        required
      />
      <input
        type="text"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year"
        required
      />
      <button type="submit">Add Education</button>
    </form>
  );
};

export default EducationForm;

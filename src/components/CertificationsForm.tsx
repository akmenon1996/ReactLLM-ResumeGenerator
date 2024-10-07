import React, { useState } from 'react';

interface Certification {
  name: string;
  issued_by: string;
  year: string;
}

interface CertificationsFormProps {
  onSubmit: (certifications: Certification[]) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [issuedBy, setIssuedBy] = useState('');
  const [year, setYear] = useState('');
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const addCertification = () => {
    if (name && issuedBy && year) {
      setCertifications([...certifications, { name, issued_by: issuedBy, year }]);
      setName('');
      setIssuedBy('');
      setYear('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(certifications);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Certifications</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Certification Name"
        required
      />
      <input
        type="text"
        value={issuedBy}
        onChange={(e) => setIssuedBy(e.target.value)}
        placeholder="Issued By"
        required
      />
      <input
        type="text"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year"
        required
      />
      <button type="button" onClick={addCertification}>Add Certification</button>
      <ul>
        {certifications.map((cert, index) => (
          <li key={index}>{cert.name} - {cert.issued_by} ({cert.year})</li>
        ))}
      </ul>
      <button type="submit">Submit Certifications</button>
    </form>
  );
};

export default CertificationsForm;

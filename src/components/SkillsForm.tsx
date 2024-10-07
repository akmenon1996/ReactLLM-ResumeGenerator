import React, { useState } from 'react';

interface Skill {
  name: string;
}

interface SkillsFormProps {
  onSubmit: (skills: Skill[]) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ onSubmit }) => {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    if (skillInput) {
      setSkills([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(skills.map((name) => ({ name })));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Skills</h3>
      <input
        type="text"
        value={skillInput}
        onChange={(e) => setSkillInput(e.target.value)}
        placeholder="Skill"
      />
      <button type="button" onClick={addSkill}>Add Skill</button>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
      <button type="submit">Submit Skills</button>
    </form>
  );
};

export default SkillsForm;

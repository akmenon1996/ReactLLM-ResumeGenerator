import React, { useState } from 'react';

interface Project {
  title: string;
  description: string;
}

interface ProjectsFormProps {
  onSubmit: (projects: Project[]) => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);

  const addProject = () => {
    if (title && description) {
      setProjects([...projects, { title, description }]);
      setTitle('');
      setDescription('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(projects);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Projects</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Project Description"
        required
      />
      <button type="button" onClick={addProject}>Add Project</button>
      <ul>
        {projects.map((project, index) => (
          <li key={index}>{project.title}: {project.description}</li>
        ))}
      </ul>
      <button type="submit">Submit Projects</button>
    </form>
  );
};

export default ProjectsForm;

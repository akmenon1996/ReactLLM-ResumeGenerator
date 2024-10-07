import React, { useState } from 'react';

interface Paper {
  title: string;
  url: string;
}

interface PapersFormProps {
  onSubmit: (papers: Paper[]) => void;
}

const PapersForm: React.FC<PapersFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [papers, setPapers] = useState<Paper[]>([]);

  const addPaper = () => {
    if (title && url) {
      setPapers([...papers, { title, url }]);
      setTitle('');
      setUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(papers);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Papers</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Paper Title"
        required
      />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paper URL"
        required
      />
      <button type="button" onClick={addPaper}>Add Paper</button>
      <ul>
        {papers.map((paper, index) => (
          <li key={index}>{paper.title}: <a href={paper.url}>{paper.url}</a></li>
        ))}
      </ul>
      <button type="submit">Submit Papers</button>
    </form>
  );
};

export default PapersForm;

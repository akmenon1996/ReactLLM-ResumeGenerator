import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf'; // Import pdfjs from react-pdf
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Set the workerSrc to the path in node_modules
pdfjs.GlobalWorkerOptions.workerSrc = `/node_modules/pdfjs-dist/build/pdf.worker.min.js`;

const mockResumes = [
  {
    id: 'resume_1',
    company: 'Amazon',
    jobTitle: 'Software Engineer',
    createdAt: '2024-09-01 10:30:00',
    downloadLink: '/resumes/resume_1.pdf',
  },
  {
    id: 'resume_2',
    company: 'Google',
    jobTitle: 'Data Scientist',
    createdAt: '2024-08-15 14:15:00',
    downloadLink: '/resumes/resume_2.pdf',
  },
];

const ViewResumes: React.FC = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    setResumes(mockResumes);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleClose = () => {
    setSelectedResume(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        View Created Resumes
      </Typography>
      <Box sx={{ mt: 4 }}>
        {resumes.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Company</strong></TableCell>
                  <TableCell><strong>Job Title</strong></TableCell>
                  <TableCell><strong>Created At</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resumes.map((resume) => (
                  <TableRow key={resume.id}>
                    <TableCell>{resume.company}</TableCell>
                    <TableCell>{resume.jobTitle}</TableCell>
                    <TableCell>{resume.createdAt}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{ mr: 2 }}
                        href={resume.downloadLink}
                        target="_blank"
                        rel="noopener"
                      >
                        Download
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedResume(resume.downloadLink)}
                      >
                        Preview
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No resumes found.</Typography>
        )}
      </Box>

      {/* PDF Preview Dialog */}
      <Dialog
        open={Boolean(selectedResume)}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Preview Resume</DialogTitle>
        <DialogContent dividers>
          {selectedResume && (
            <Document
              file={selectedResume}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewResumes;

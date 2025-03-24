import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Chip 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ChapterList = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        JLPT N1 Chapters
      </Typography>
      <Grid container spacing={3}>
        {[...Array(14)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { transform: 'scale(1.02)' },
                transition: 'transform 0.2s'
              }}
              onClick={() => navigate(`/chapter/${index + 1}`)}
            >
              <CardContent>
                <Typography variant="h6">
                  Chapter {index + 1}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  5 Lessons
                </Typography>
                {index < 3 ? (
                  <Chip label="Free" color="success" size="small" />
                ) : (
                  <Chip label="Premium" color="primary" size="small" />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ChapterList; 
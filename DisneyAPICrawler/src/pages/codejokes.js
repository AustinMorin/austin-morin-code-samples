import * as React from 'react';
import Box from '@mui/material/Box';

export default function codejokes() {
  return (
  <div>
    <Box
        component="img"
        sx={{
          height: 500,
          width: 500,
		  border: 5,
        }}
        src="https://i.pinimg.com/originals/f4/76/77/f476772ae7b93639a802622dcfe14848.jpg"
	  />
	  <Box
        component="img"
        sx={{
          height: 500,
          width: 500,
		  border: 5,
        }}
        src="https://i.pinimg.com/564x/3e/ec/f9/3eecf90cb3bd52ce17baf1eb993dc411.jpg"
      />
	  </div>
  );
}

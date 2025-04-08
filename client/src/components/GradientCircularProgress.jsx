import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function GradientCircularProgress(props) {
  return (
    <React.Fragment>
      {/* SVG is only for defining the gradient, so it doesn't need visible space */}
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      {/* Pass props to CircularProgress to control size, etc. */}
      <CircularProgress {...props} sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
    </React.Fragment>
  );
}

export default GradientCircularProgress;
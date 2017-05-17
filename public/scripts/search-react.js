import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import CircularProgress   from 'material-ui/CircularProgress';
import {amber500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: amber500,
  },
});

const CircularProgressLoader = () => (
  <div>
    <MuiThemeProvider muiTheme={muiTheme}>
      <CircularProgress size={80} thickness={5} mode='indeterminate' />
    </MuiThemeProvider>
  </div>
);

ReactDOM.render(
    <CircularProgressLoader />, document.getElementById('loader')
);

import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import AutoComplete   from 'material-ui/AutoComplete';
import {amber500} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: amber500,
  },
});

// Data Source -----------------------------------------------------------------

let dataSource = [];


//TODO: OnUpdateInput query server for similar text and change data source to response
$.ajax({
    url: '/all',
    type: 'GET',
    processData: false,
    contentType: false,
    success: function(data) {
      data.forEach( (object) => {
        let dataObject = {
          text: `${object.Title}`,
          value: (
            <MenuItem
              id="react-item"
              primaryText={object.Title}
            />
          ),
        };
        dataSource.push(dataObject);
      });
    }
  });

const AutoCompleteDataSource = () => (
  <div>
    <MuiThemeProvider muiTheme={muiTheme}>
      <AutoComplete
        hintText="Search for articles..."
        // #nofilter
        filter={AutoComplete.noFilter}
        dataSource={dataSource}
        fullWidth={true}
        style ={{width: '100%'}}
      />
    </MuiThemeProvider>
  </div>
);

ReactDOM.render(
    <AutoCompleteDataSource />, document.getElementById('app')
);

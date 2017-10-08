import React, { PropTypes } from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import DocsHelper from 'util/DocsHelper';
import Routes from 'routing/Routes';

const HelpMenu = React.createClass({
  propTypes: {
    active: PropTypes.bool.isRequired,
  },
  render() {
    return (
      <NavDropdown title="帮助" id="help-menu-dropdown" active={this.props.active}>
        <MenuItem href="#" target="blank">
          <i className="fa fa-external-link" /> 联系 xxxx
        </MenuItem>
      </NavDropdown>
    );
  },
});

export default HelpMenu;

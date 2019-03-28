import { MenuItem } from '@material-ui/core'
import React from 'react'

class Option extends React.Component {
    handleClick = event => {
      this.props.selectOption(this.props.data, event);
    };
  
    render() {
      const { children, isFocused, isSelected, onFocus } = this.props;
      return (
        <MenuItem
          onFocus={onFocus}
          selected={isFocused}
          onClick={this.handleClick}
          component="div"
          style={{
            fontWeight: isSelected ? 500 : 400
          }}
        >
          {children}
        </MenuItem>
      );
    }
  }
export default Option;
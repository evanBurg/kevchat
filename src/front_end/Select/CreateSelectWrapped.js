import Select from 'react-select/lib/Creatable'
import Option from "./Option";
import React from 'react'

const style = {
  control: () => ({
    display: "flex",
    alignItems: "center",
    border: 0,
    height: "auto",
    background: "transparent",
    "&:hover": {
      boxShadow: "none"
    }
  }),
  menu: () => ({
    backgroundColor: "white",
    boxShadow: "1px 2px 6px #888888", // should be changed as material-ui
    position: "absolute",
    left: 0,
    top: `calc(100% + 1px)`,
    width: "100%",
    zIndex: 2,
  }),
  menuList: () => ({
    overflowY: "auto"
  })
};

export default function SelectWrapped(props) {
  const { classes, ...other } = props;

  return (
    <Select
      components={{
        Option: Option
      }}
      styles={style}
      isClearable={true}
      {...other}
    />
  );
}
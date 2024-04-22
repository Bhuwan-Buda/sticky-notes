import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { supabase } from "../Utils/supabase";

const Note = ({ note, index, setNotes, setOpen, setEdit, setSpecificNote }) => {
  const { id, title, description, color, created_at } = note;

  const handleDelete = async () => {
    try {
      await supabase.from("sticky-notes").delete().eq("id", id);
      const { data } = await supabase.from("sticky-notes").select();
      if (data?.length > 0) {
        setNotes(data);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    let elements = document.querySelectorAll(".invert-color");
    function getInvertedColor(color) {
      let rgb = color.match(/\d+/g);
      let invertedRgb = rgb.map(function (component) {
        return 255 - parseInt(component, 10);
      });
      let invertedColor = "rgb(" + invertedRgb.join(",") + ")";
      return invertedColor;
    }
    elements.forEach(function (element) {
      let parentBackgroundColor = window.getComputedStyle(
        element.parentElement
      ).backgroundColor;

      let invertedColor = getInvertedColor(parentBackgroundColor);
      element.style.color = invertedColor;
    });
  }, [note]);

  return (
    <Card
      sx={{
        minWidth: 275,
        minHeight: 200,
        backgroundColor: `${color}`,
        padding: "10px",
        position: "relative",
      }}
      raised
    >
      <Typography
        variant="h5"
        component="h5"
        className="invert-color"
        sx={{ fontFamily: "Poppins", fontWeight: "500" }}
      >
        {index + 1}. {title}
      </Typography>
      <hr />
      <Typography
        variant="body2"
        className="invert-color"
        sx={{ fontFamily: "Montserrat", fontWeight: "400" }}
      >
        {description?.length > 100
          ? description.substring(0, 100) + "..."
          : description}
      </Typography>
      <hr />
      <Typography
        variant="body2"
        className="invert-color"
        sx={{ fontFamily: "Montserrat", fontWeight: "400", fontSize: "12px" }}
      >
        Created At: {created_at?.substring(0, 10)}&nbsp;
        {created_at?.substring(11, 19)}
      </Typography>
      <CardActions
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "96%",
          justifyContent: "flex-end",
        }}
      >
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            setEdit(true);
            setSpecificNote(note);
            setOpen(true);
          }}
        >
          <EditIcon />
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={handleDelete}
        >
          <DeleteIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

export default Note;

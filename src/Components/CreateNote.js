import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { ColorPicker, useColor } from "react-color-palette";
import { Grid, IconButton, Typography } from "@mui/material";
import { supabase } from "../Utils/supabase";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateNote = ({
  open,
  setOpen,
  setNotes,
  edit,
  setEdit,
  specificNote,
  setSpecificNote,
}) => {
  const [noteForm, setNoteForm] = useState({
    title: "",
    description: "",
  });
  const [noteColor, setNoteColor] = useColor(
    edit ? specificNote?.color : "#83a6a6"
  );
  const handleChange = (e) => {
    setNoteForm({
      ...noteForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (noteForm?.title === "") {
      alert("Please enter title.");
    } else if (noteForm?.description === "") {
      alert("Please enter description.");
    } else {
      if (!edit) {
        try {
          await supabase.from("sticky-notes").insert({
            title: noteForm?.title,
            description: noteForm?.description,
            color: noteColor?.hex,
          });
          const { data } = await supabase.from("sticky-notes").select();
          if (data?.length > 0) {
            setNotes(data);
          } else {
            setNotes([]);
          }
          setNoteForm({
            title: "",
            description: "",
          });
          setSpecificNote(null);
          setOpen(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await supabase
            .from("sticky-notes")
            .update({
              title: noteForm?.title,
              description: noteForm?.description,
              color: noteColor?.hex,
            })
            .eq("id", specificNote?.id);
          const { data } = await supabase.from("sticky-notes").select();
          if (data?.length > 0) {
            setNotes(data);
          } else {
            setNotes([]);
          }
          setEdit(false);
          setNoteForm({
            title: "",
            description: "",
          });
          setSpecificNote(null);
          setOpen(false);
        } catch (error) {
          console.log(error, "error");
        }
      }
    }
  };

  const handleClose = () => {
    setNoteForm({
      title: "",
      description: "",
    });
    setEdit(false);
    setSpecificNote(null);
    setOpen(false);
  };

  useEffect(() => {
    if (edit && specificNote !== null) {
      setNoteForm({
        title: specificNote?.title,
        description: specificNote?.description,
      });
    }
  }, [edit, specificNote]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {edit ? "Update Note" : "Create Note"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                sx={{ width: "100%" }}
                required
                id="outlined-required"
                label="Title"
                name="title"
                placeholder="Title"
                value={noteForm?.title}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{ width: "100%" }}
                required
                id="outlined-required"
                label="Description"
                name="description"
                placeholder="Description"
                value={noteForm?.description}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                component="p"
                style={{ color: `${noteColor?.hex}` }}
              >
                Choose card color
              </Typography>
              <ColorPicker
                height={200}
                hideInput={["rgb", "hsv", "hex"]}
                color={noteColor}
                onChange={setNoteColor}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained">
            {edit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default CreateNote;

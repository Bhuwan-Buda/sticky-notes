import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Header from "./Header";
import Note from "./Note";
import { supabase } from "../Utils/supabase";
import CreateNote from "./CreateNote";
import { Typography } from "@mui/material";
import useDebounce from "../Utils/useDebounce";

const StickyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(false);
  const [specificNote, setSpecificNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const getNotes = async (search) => {
    const capitalizedSearch = search.charAt(0).toUpperCase() + search.slice(1);
    try {
      setLoading(true);
      const { data } = await supabase
        .from("sticky-notes")
        .select()
        .like("title", `%${capitalizedSearch}%`);
      setLoading(false);
      if (data?.length > 0) {
        setNotes(data);
      } else {
        setNotes([]);
      }
    } catch (error) {
      setLoading(false);
      console.log(error, "error");
    }
  };

  useEffect(() => {
    getNotes(search);
  }, [debouncedSearch]);

  return (
    <>
      <Header search={search} setSearch={setSearch} />
      <Container maxWidth="xl" sx={{ padding: "20px", marginTop: "60px" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "calc(100vh - 200px)",
            }}
          >
            <CircularProgress size={100} thickness={2.6} />
          </Box>
        ) : (
          <>
            {notes?.length > 0 ? (
              <Grid container spacing={2}>
                {notes?.map((note, i) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={note?.id}>
                      <Note
                        note={note}
                        index={i}
                        setNotes={setNotes}
                        setOpen={setOpen}
                        setEdit={setEdit}
                        setSpecificNote={setSpecificNote}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography variant="h5" component="h5" textAlign={"center"}>
                No Data Found!
              </Typography>
            )}
          </>
        )}
      </Container>
      <Fab
        color="primary"
        aria-label="add"
        size="large"
        className="fab-icon"
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>
      {open && (
        <CreateNote
          open={open}
          setOpen={setOpen}
          setNotes={setNotes}
          edit={edit}
          setEdit={setEdit}
          specificNote={specificNote}
          setSpecificNote={setSpecificNote}
        />
      )}
    </>
  );
};

export default StickyNotes;

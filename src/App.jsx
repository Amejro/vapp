import "./App.css";
import Stack from "@mui/joy/Stack";
import CreatePond from "./components/Createpond";
import { Box } from "@mantine/core";
import { db } from "./util/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useRef } from "react";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { Link } from "react-router-dom";
import Grid from "@mui/joy/Grid";

function App() {
  const inputRef = useRef();
  const buttonRef = useRef();
  const ponds = useLiveQuery(() => db.ponds.toArray());

  const inputStyle = {
    borderRadius: "5px",
    width: "300px",
    height: "30px",
    boder: "solide",
    paddingLeft: "10px",
  };

  // function HandleButton(pond) {
  //   const name = inputRef.current.value;

  //   if (name === pond.name) {
  //     inputRef.current.style.borderColor = " ";
  //   } else {
  //     console.log("please enter a valid name..");
  //   }
  // }

  // async function HandleDelete(pond) {
  //   const name = inputRef.current.value.trim();

  //   if (name === pond.name) {
  //     db.transaction(
  //       "rw",
  //       db.ponds,
  //       db.badges,
  //       db.water_qualities,
  //       db.stocking_densities,
  //       db.feedings,
  //       db.sortings,
  //       async () => {
  //         db.badges
  //           .where("fkey")
  //           .equals(pond.id)
  //           .each(
  //             (badge) => (
  //               db.water_qualities
  //                 .where("fkey")
  //                 .equals(badge.id)
  //                 .each((res) => db.water_qualities.delete(res.id)),
  //               db.stocking_densities
  //                 .where("fkey")
  //                 .equals(badge.id)
  //                 .each((res) => db.stocking_densities.delete(res.id)),
  //               db.feedings
  //                 .where("fkey")
  //                 .equals(badge.id)
  //                 .each((res) => db.feedings.delete(res.id)),
  //               db.sortings
  //                 .where("fkey")
  //                 .equals(badge.id)
  //                 .each((res) => db.sortings.delete(res.id))
  //             )
  //           )
  //           .then(() => {
  //             db.badges
  //               .where("fkey")
  //               .equals(pond.id)
  //               .each((badge) => db.badges.delete(badge.id));
  //           })
  //           .then(() => {
  //             db.ponds.delete(pond.id);
  //           });
  //       }
  //     )
  //       .then(() => {
  //         //
  //         // Transaction Complete
  //         //

  //         console.log("Transaction committed");
  //       })
  //       .catch((err) => {
  //         //
  //         // Transaction Failed
  //         //

  //         console.error(err.stack);
  //       });
  //     modals.closeAll();
  //   } else {
  //     inputRef.current.style.borderColor = "red";
  //     console.log("please enter a valid name..");
  //   }
  // }

  return (
    <div style={{ height: "100vh" }}>
      <Stack direction="column" justifyContent="center">
        <Box
          sx={{
            height: "20vh",
            backgroundColor: "#f0f7ff",
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <Box sx={{ paddingRight: 30 }}>
            <CreatePond />
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "#ffffff",
            overflowY: "scroll",
            height: "80vh",
          }}
        >
          {/* ................. */}
          <Grid
            container
            spacing="auto"
            sx={{
              flexGrow: 1,
              maxWidth: "900px",
              mx: "auto",
            }}
          >
            {ponds?.map((pond) => (
              <Grid xs={3} id={pond.id} key={pond.id}>
                <Box
                  component="ul"
                  sx={{
                    position: "relative",
                    display: "flex",
                    gap: 2,
                    p: 0,
                    m: 0,
                  }}
                >
                  <Link
                    // href={`Workspace/${pond.name}`}
                    to={`newSpace/${pond.name}`}
                    style={{ width: "fit-content", display: "block" }}
                    // to={`Workspace/${pond.name}`}
                  >
                    <Card
                      onClick={() => {
                        console.log("clicking..");
                      }}
                      component="li"
                      sx={{
                        display: "flex",
                        flexGrow: 1,
                        width: 150,
                        height: 150,
                      }}
                    >
                      <CardCover>
                        <div style={{ backgroundColor: "#096bde" }} />
                      </CardCover>
                      <CardContent>
                        <Typography level="h6" fontWeight="lg" textColor="#fff">
                          {pond.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                  {/* <div
                    onClick={() => {
                      modals.open({
                        title: "Delete pond",
                        centered: true,
                        children: (
                          <>
                            <div className="pb-2 text-sm">
                              <p className="">
                                Are you sure you want to delete{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {pond.name}
                                </span>
                                . Enter the name{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {pond.name}
                                </span>{" "}
                                to confirm
                              </p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <input
                                ref={inputRef}
                                type="text"
                                onChange={() => {
                                  HandleButton(pond);
                                }}
                                placeholder={`Enter ${pond.name} here`}
                                style={inputStyle}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "20px",
                                justifyContent: "center",
                                paddingTop: "10px",
                              }}
                            >
                              <Button
                                aria-label="Cancel"
                                variant="outlined"
                                color="neutral"
                                size="sm"
                                onClick={() => {
                                  modals.closeAll();
                                }}
                              >
                                Cancel
                              </Button>

                              <Button
                                ref={buttonRef}
                                size="sm"
                                onClick={() => {
                                  HandleDelete(pond);
                                }}
                              >
                                <span>Delete</span>
                              </Button>
                            </div>
                          </>
                        ),
                      });
                    }}
                    style={{
                      position: "absolute",
                      display: "flex",
                      paddingTop: 10,

                      top: 0,
                      right: 5,
                      zIndex: 100,
                      width: 20,
                    }}
                  >
                    <DeleteIcon />
                  </div> */}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

function ParkingLayout() {
  const [clickedSpot, setClickedSpot] = useState(null); // Track only one clicked spot

    // Load the clicked spot from localStorage when the component mounts
    useEffect(() => {
      const savedSpot = localStorage.getItem("clickedSpot");
      if (savedSpot) {
        setClickedSpot(savedSpot);
      }
    }, []);
    useEffect(() => {
      if (clickedSpot !== null) {
        localStorage.setItem("clickedSpot", clickedSpot);
      }
    }, [clickedSpot]);

  const handleSpotClick = (spotId) => {
    // Toggle the spot: if it's already clicked, unclick it; if not, set it as the clicked spot
    setClickedSpot((prev) => (prev === spotId ? null : spotId));
  };

  const getSpotColor = (spotId) => {
    // available na motor
    if (spotId.startsWith("Motor")) {
      return spotId === clickedSpot ? "red" : "#64B5F6"; // Red if selected, blue if not
    }

    // sa mga available sakyanan
    if (spotId.startsWith("Car")) {
      return spotId === clickedSpot ? "red" : "#81C784"; // Red if selected, green if not
    }

    // mao ni and assign color na available sa visitors
    if (spotId.startsWith("V")) {
      return spotId === clickedSpot ? "red" : "#FFEB3B"; // Red if selected, yellow if not
    }

    // Default: spot color (non-clicked spots)
    return spotId === clickedSpot ? "red" : "#81D4FA"; // Red if selected, blue if not
  };

  return (
    <Box sx={{ position: "relative", p: 2 }}>
      {/* Main Gate */}
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>
        Gate
      </Typography>

      <Grid
        container
        spacing={1}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        {/* Far Left Column - Hallway, Angled Car Spots 1-5, Tree */}
        <Grid item xs={3}>
          <Box
            sx={{
              p: 1,
              textAlign: "center",
              height: "610px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          ></Box>

          <Box sx={{ position: "absolute", top: "6.8%", left: "9%" }}>
            <Box
              sx={{
                borderLeft: "2px solid black",
                borderBottom: "2px solid black",
                borderRight: "2px solid black",
                height: "550px",
                width: "230px",
                bgcolor: "#e9e9e9",
              }}
            ></Box>
            <Box sx={{ position: "absolute", top: "45%", transform: "rotate(90deg)" }}>
              <Typography sx={{ letterSpacing: "2px", fontSize: "20px" }}>
                HALLWAY
              </Typography>
            </Box>
          </Box>

          {/* Left Column - Car Spots 8-20 */}
          <Grid item xs={2}>
            {[8, 9, 10, 11, 12].map((spot) => (
              <Box
                key={spot}
                onClick={() => handleSpotClick(`Car Spot ${spot}`)}
                sx={{
                  width: "130px",
                  fontSize: "12px",
                  bgcolor: getSpotColor(`Car Spot ${spot}`),
                  p: 1,
                  mb: 1,
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                Car Spot {spot}
              </Box>
            ))}
            {[13, 14, 15, 16, 17, 18, 19, 20].map((spot) => (
              <Box
                key={spot}
                onClick={() => handleSpotClick(`Car Spot ${spot}`)}
                sx={{
                  width: "130px",
                  fontSize: "12px",
                  bgcolor: getSpotColor(`Car Spot ${spot}`),
                  p: 1,
                  mb: 1,
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                Car Spot {spot}
              </Box>
            ))}
          </Grid>
        </Grid>

        <Box item sx={{ position: "relative", width: "450px" }}>
          <Box
            sx={{
              position: "absolute",
              transform: "rotate(90deg)",
              top: 250,
              right: 200,
              height: 50,
              textAlign: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6">DALAN</Typography>
          </Box>

          {/* Angled Car Spots 1-5 */}
          <Box sx={{ position: "relative", mb: 5, transform: "skewY(-20deg)" }}>
            {[1, 2, 3, 4, 5].map((spot, index) => (
              <Box
                key={spot}
                onClick={() => handleSpotClick(`Car Spot ${spot}`)}
                sx={{
                  bgcolor: getSpotColor(`Car Spot ${spot}`),
                  p: 1,
                  textAlign: "center",
                  width: "100px",
                  height: "70px",
                  zIndex: 5 - index,
                  border: "1px solid black",
                  cursor: "pointer",
                }}
              >
                Car Spot {spot}
              </Box>
            ))}
          </Box>

          {/* Tree */}
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/2220/2220091.png"
            sx={{
              mt: 7,
              p: 2,
              width: "100px",
              height: "100px",
            }}
          ></Box>

          {/* Center Column - Dalan, Quadrangle, Pick-Up, Visitor Spots, Stage */}
          <Box
            item
            sx={{
              position: "absolute",
              bottom: "0",
              ml: "-50px",
              width: "100%",
              mb: "-70px",
            }}
          >
            <Box
              sx={{
                bgcolor: "grey",
                height: 575,
                pt: 25,
                textAlign: "center",
                mb: 1,
              }}
            >
              <Typography variant="h6" sx={{ transform: "rotate(90deg)" }}>
                QUADRANGLE
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: "#81D4FA",
                height: 40,
                width: 90,
                fontSize: 12,
                position: "absolute",
                top: "30%",
                right: 0,
                textAlign: "center",
                mb: 1,
                transform: "rotate(90deg)",
              }}
            >
              <Typography variant="h6">Pick-Up</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 1,
                position: "absolute",
                bottom: "100px",
                right: "20%",
              }}
            >
              {[4, 3, 2, 1].map((spot) => (
                <Box
                  key={spot}
                  onClick={() => handleSpotClick(`V${spot}`)}
                  sx={{
                    bgcolor: getSpotColor(`V${spot}`),
                    width: 60,
                    p: 1,
                    textAlign: "center",
                    mx: 0.5,
                    cursor: "pointer",
                  }}
                >
                  V{spot}
                </Box>
              ))}
            </Box>
            <Typography align="center">Visitors Parking Spot</Typography>

            <Box
              sx={{
                bgcolor: "grey.300",
                height: 40,
                textAlign: "center",
                mt: 1,
              }}
            >
              <Typography variant="h6">STAGE</Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Column - Dalan, Building, Motor Spots 1-38, Car Spots 6-7, Tree */}
        <Grid item xs={3}>
          {/* Motor Spot Rows */}
          <Grid container spacing={0.5}>
            <Grid item xs={6}>
              {[14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26].map(
                (spot) => (
                  <Box
                    key={spot}
                    onClick={() => handleSpotClick(`Motor Spot ${spot}`)}
                                        sx={{
                      fontSize: "5px",
                      bgcolor: getSpotColor(`Motor Spot ${spot}`),
                      p: 1,
                      textAlign: "center",
                      mb: 0.5,
                      cursor: "pointer",
                    }}
                  >
                    Motor Spot {spot}
                  </Box>
                )
              )}
            </Grid>
            <Grid item xs={6}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((spot) => (
                <Box
                  key={spot}
                  onClick={() => handleSpotClick(`Motor Spot ${spot}`)}
                  sx={{
                    fontSize: "5px",
                    bgcolor: getSpotColor(`Motor Spot ${spot}`),
                    p: 1,
                    textAlign: "center",
                    mb: 0.5,
                    cursor: "pointer",
                  }}
                >
                  Motor Spot {spot}
                </Box>
              ))}
            </Grid>
          </Grid>

          {/* Tree and Car Spots 6-7 */}
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/2220/2220091.png"
            sx={{
              justifySelf: "center",
              height: "60px",
              width: "70px",
            }}
          ></Box>

          {[6, 7].map((spot) => (
            <Box
              key={spot}
              onClick={() => handleSpotClick(`Car Spot ${spot}`)}
              sx={{
                bgcolor: getSpotColor(`Car Spot ${spot}`),
                p: 1,
                fontSize: "9px",
                mb: 1,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Car Spot {spot}
            </Box>
          ))}

          <Box
            sx={{
              position: "absolute",
              top: "6.5%",
              left: "40%",
              borderLeft: "1px solid black",
              borderBottom: "1px solid black",
              borderRight: "1px solid black",
              height: "550px",
              width: "70px",
              bgcolor: "#e9e9e9",
            }}
          ></Box>

          {/* Motor far right pathway */}
          <Box sx={{ position: "absolute", top: "6.5%", left: "65%" }}>
            <Box
              sx={{
                borderBottom: "1px solid black",
                borderRight: "1px solid black",
                height: "550px",
                width: "70px",
                bgcolor: "#e9e9e9",
              }}
            ></Box>
            <Box
              sx={{
                borderTop: "1px solid black",
                position: "absolute",
                bottom: 0,
                left: "69px",
                height: "70px",
                width: "240px",
                bgcolor: "#e9e9e9",
              }}
            >
              <Box sx={{ mt: "20px", height: 50, textAlign: "center", mb: 1 }}>
                <Typography variant="h6">DALAN</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: "20px", height: 50, textAlign: "center", mb: 1 }}>
            <Typography variant="h6">DALAN</Typography>
          </Box>

          {/* Additional Motor Spots (27-38) */}
          <Box
            spacing={0.5}
            sx={{
              justifySelf: "end",
              width: "130px",
              position: "relative",
              mt: "40px",
            }}
          >
            {[27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38].map((spot) => (
              <Grid item xs={12} key={spot}>
                <Box
                  onClick={() => handleSpotClick(`Motor Spot ${spot}`)}
                  sx={{
                    fontSize: "12px",
                    bgcolor: getSpotColor(`Motor Spot ${spot}`),
                    p: 1,
                    textAlign: "center",
                    mb: 0.5,
                    cursor: "pointer",
                  }}
                >
                  Motor Spot {spot}
                </Box>
              </Grid>
            ))}

            <Box
              sx={{
                position: "absolute",
                left: "-310px",
                top: "40%",
                transform: "rotate(90deg)",
                width: "500px",
                height: "100px",
                bgcolor: "grey",
                pt: "20px",
                textAlign: "center",
                mb: 1,
              }}
            >
              <Typography variant="h6">BUILDING</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

const itemData = [
  {
    img: "https://cdn-icons-png.flaticon.com/512/2220/2220091.png",
    title: "Tree",
  },
];

export default ParkingLayout;


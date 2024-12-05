import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { db } from "../../lib/firebase";
import {
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useUser } from "../../context/UserContext";

import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";

function ParkingLayout() {
  const { userId } = useParams(); // Get userId from URL params

  const [occupiedSpots, setOccupiedSpots] = useState(new Set());
  const [hasActiveQR, setHasActiveQR] = useState(false);

  const user = getAuth().currentUser;

  // Check if the user is authenticated
  useEffect(() => {
    if (user) {
      const fetchQRStatus = async () => {
        try {
          const userDoc = await getDoc(doc(db, "qrScans", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setHasActiveQR(data.active);  // Assume 'active' is a boolean field in Firestore
          } else {
            console.warn("No QR scan data found for this user.");
            setHasActiveQR(false);
          }
        } catch (error) {
          console.error("Error fetching QR scan status:", error);
        }
      };

      fetchQRStatus();
    }
  }, [user]);

  // useEffect(() => {
  //   const fetchOccupiedSpots = async () => {
  //     try {
  //       const response = await fetch("/api/getOccupiedSpots"); // Replace with your API endpoint
  //       const data = await response.json();
  //       setOccupiedSpots(new Set(data.map((spot) => spot.spotId)));
  //     } catch (error) {
  //       console.error("Error fetching occupied spots:", error);
  //     }
  //   };

  //   fetchOccupiedSpots();
  // }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "parking"), (snapshot) => {
      const occupied = new Set();
      snapshot.forEach((doc) => {
        if (doc.data().occupied) {
          occupied.add(doc.id);
        }
      });
      setOccupiedSpots(occupied);
    });

    return () => unsubscribe();
  }, []);

  const handleSpotClick = async (spotId) => {
    if (occupiedSpots.has(spotId)) {
      alert("Error: Spot Occupied. Please choose a different spot.");
      return;
    }
  
    if (!hasActiveQR) {
      alert("Access denied: You need an active QR scan to reserve a spot.");
      return;
    }
  
    // Fetch the plate number from the 'permit' collection using userId
    if (user) {
      try {
        console.log(user.uid);
        const permitDoc = await getDoc(doc(db, "permits", user.uid));  // 'permit' is your collection name

        const parkingQuery = query(collection(db, "parking"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(parkingQuery);
  
        if (!querySnapshot.empty) {
          // User already has a reserved spot
          alert("Access denied: You already have a reserved parking spot.");
          return;
        }

        if (permitDoc.exists()) {
          const permitData = permitDoc.data();
          const plateNumber = permitData.plateNumber; // Assuming 'plateNumber' is the field you want

          // Now update the 'parking' document with the spotId
          await setDoc(doc(db, "parking", spotId), {
            spotId: spotId,
            userId: user.uid,
            occupied: true,
            timestamp: new Date(),
          });
  
          // Update the 'qrScans' document with plate number and parking spot ID
          await updateDocument(user.uid, plateNumber, spotId);
  
          setOccupiedSpots((prev) => new Set(prev).add(spotId));
        } else {
          console.warn("Permit document not found for the user.");
          alert("Error: No permit found. Please ensure your permit is registered.");
        }
      } catch (error) {
        console.error("Error fetching permit data or updating Firestore:", error);
      }
    }
  };

  

  const updateDocument = async (userId, plateNumber, spotId) => {
    try {
      const userRef = doc(db, 'qrScans', userId);
  
      // If you want to add new fields (like plate number and parking spot ID) to an existing document
      await updateDoc(userRef, {
        plateNumber: plateNumber,  // Add the plate number field
        spotId: spotId,  // Add the parking spot ID field
        updatedAt: new Date(),  // Optional: Timestamp when the data was updated
      });
  
      console.log('Document updated successfully!');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const getSpotColor = (spotId) => {
    if (occupiedSpots.has(spotId)) {
      return "red";
    }
    if (spotId.startsWith("Motor")) {
      return "#64B5F6";
    } else if (spotId.startsWith("Car")) {
      return "#81C784";
    } else if (spotId.startsWith("V")) {
      return "#FFEB3B";
    }
    return "#81D4FA";
  };

  return (
    <Box sx={{ position: "relative", p: 2 }}>
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>
        Gate
      </Typography>

      <Grid
        container
        spacing={1}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
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
          >
            <Typography
              sx={{
                letterSpacing: "2px",
                fontSize: 40,
                transform: "rotate(90deg)",
              }}
            >
              HALLWAY
            </Typography>
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
              left: 100,
              height: 50,
              textAlign: "center",
              mb: 1,
            }}
          >
            <Typography sx={{ fontSize: 30 }} variant="h6">
              DALAN
            </Typography>
          </Box>

          <Box>
            <Box
              component="img"
              src="https://cdn.creazilla.com/cliparts/7830767/arrow-clipart-lg.png"
              sx={{
                height: "40px",
                width: "150px",
                position: "absolute",
                left: "30%",
                top: "10%",
                opacity: ".8",
                rotate: "90deg",
              }}
            ></Box>
            <Box
              component="img"
              src="https://cdn.creazilla.com/cliparts/7830767/arrow-clipart-lg.png"
              sx={{
                height: "40px",
                width: "150px",
                position: "absolute",
                left: "30%",
                top: "30%",
                opacity: ".8",
                rotate: "90deg",
              }}
            ></Box>
            <Box
              component="img"
              src="https://cdn.creazilla.com/cliparts/7830767/arrow-clipart-lg.png"
              sx={{
                height: "40px",
                width: "150px",
                position: "absolute",
                left: "-60%",
                top: "10%",
                opacity: ".8",
                rotate: "90deg",
              }}
            ></Box>
            <Box
              component="img"
              src="https://cdn.creazilla.com/cliparts/7830767/arrow-clipart-lg.png"
              sx={{
                height: "40px",
                width: "150px",
                position: "absolute",
                left: "-60%",
                top: "30%",
                opacity: ".8",
                rotate: "90deg",
              }}
            ></Box>
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
              mt: "20px",
              height: 50,
              textAlign: "center",
              mb: 1,
              position: "relative",
            }}
          >
            <Box
              component="img"
              src="https://cdn.creazilla.com/cliparts/7830767/arrow-clipart-lg.png"
              sx={{
                height: "40px",
                position: "absolute",
                left: "-20px",
                opacity: ".8",
              }}
            ></Box>
            <Box
              component="img"
              src="https://cdn.creazilla.com/cliparts/7830767/arrow-clipart-lg.png"
              sx={{
                height: "40px",
                position: "absolute",
                left: -200,
                opacity: ".8",
              }}
            ></Box>
            <Box
              component="img"
              src="https://cdn.creazilla.com/cliparts/7830767/arrow-clipart-lg.png"
              sx={{
                height: "40px",
                position: "absolute",
                left: -420,
                opacity: ".8",
              }}
            ></Box>
            <Box
              component="img"
              src="https://cdn.creazilla.com/cliparts/7830767/arrow-clipart-lg.png"
              sx={{
                height: "40px",
                position: "absolute",
                left: -600,
                opacity: ".8",
              }}
            ></Box>
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

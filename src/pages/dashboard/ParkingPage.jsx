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
  addDoc,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useUser } from "../../context/UserContext";
import { Snackbar, Alert } from "@mui/material"; // Import MUI components

import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";

function ParkingLayout() {
  const { id } = useParams(); // Get userId from URL params
  const [userRole, setUserRole] = useState(null);
  const [isVisitorSpot, setIsVisitorSpot] = useState(false);

  const [occupiedSpots, setOccupiedSpots] = useState(new Set());
  const [hasActiveQR, setHasActiveQR] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // Snackbar severity: 'success', 'info', 'warning', 'error'

  const user = getAuth().currentUser;

  // Function to show snackbar
  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Snackbar close handler
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Check if the user is authenticated
  useEffect(() => {
    if (user) {
      const fetchQRStatus = async () => {
        try {
          const userDoc = await getDoc(doc(db, "qrScans", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setHasActiveQR(data.active); // Assume 'active' is a boolean field in Firestore
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

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid)); // Assuming roles are stored in 'users' collection
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserRole(data.role); // 'role' field in the Firestore document (either 'security' or 'user')
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  // useEffect(() => {
  //   const checkVisitorSpot = async () => {
  //     try {
  //       const visitorDoc = await getDoc(doc(db, "visitors", id));
  //       if (visitorDoc.exists()) {
  //         setIsVisitorSpot(true); // The spot is associated with a visitor
  //       } else {
  //         setIsVisitorSpot(false); // Not linked to a visitor
  //       }
  //     } catch (error) {
  //       console.error("Error fetching visitor data:", error.message);
  //     }
  //   };

  //   checkVisitorSpot();
  // }, [id]);

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
  
  const isRoleAllowedForSpot = (spotId, userRole) => {
    if (spotId.startsWith("Vip") && !["president", "security"].includes(userRole.toLowerCase())) {
      return { allowed: false, message: "Access denied: Only VIP personnel can access." };
    }
    if (spotId.startsWith("V") && !spotId.startsWith("Vip") && userRole.toLowerCase() !== "security") {
      return { allowed: false, message: "Access denied: Only Security personnel can access." };
    }
    return { allowed: true };
  };

  const handleSpotClick = async (spotId) => {

    const roleCheck = isRoleAllowedForSpot(spotId, userRole);
    if (!roleCheck.allowed) {
      showSnackbar(roleCheck.message);
      return;
    }

    if (user && userRole.toLowerCase() === "president") {
      try {
        // Check if the user already has a reserved spot and whether it's active
        const parkingQuery = query(
          collection(db, "parking"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(parkingQuery);

        if (!querySnapshot.empty) {
          // Check if the user already has a reserved spot, but check if it's not active
          const userParkingData = querySnapshot.docs[0].data();
          if (userParkingData.occupied === true) {
            showSnackbar(
              "Access denied: You already have an active parking spot."
            );
            return;
          }
        }

        // Fetch user details for logging (if needed)
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userName = userDoc.exists()
          ? userDoc.data().firstName + " " + userDoc.data().lastName
          : "Unknown"; // Get user name
        const phoneNumber = userDoc.exists()
          ? userDoc.data().contactNumber
          : "Unknown"; // Get user contact

        // Reserve the parking spot
        await setDoc(doc(db, "parking", spotId), {
          spotId: spotId,
          userId: user.uid,
          occupied: true,
          timestamp: new Date(),
        });

        // Check if there's already a log for this spotId and userId
        const viewlogQuery = query(
          collection(db, "viewlogs"),
          where("spotId", "==", spotId),
          where("userId", "==", user.uid)
        );
        const viewlogSnapshot = await getDocs(viewlogQuery);

        let docId = `${spotId}_${user.uid}`;
        if (!viewlogSnapshot.empty) {
          const existingLogDoc = viewlogSnapshot.docs[0];
          const existingLogData = existingLogDoc.data();

          if (existingLogData.freed === true) {
            docId = `${spotId}_${user.uid}_${new Date().getTime()}`;
          } else {
            // Otherwise, update the existing log
            await updateDoc(doc(db, "viewlogs", existingLogDoc.id), {
              freed: false,
              reserved: true,
              timestamp: new Date(),
            });
            showSnackbar("Parking spot reserved successfully.");
            return;
          }
        }

        // Add log to viewlogs collection with unique docId if reserved
        await setDoc(doc(db, "viewlogs", docId), {
          userId: user.uid,
          name: userName || "Unknown", // Get user's display name or fallback
          spotId: spotId,
          phoneNumber: phoneNumber,
          designation: "President",
          freed: false,
          reserved: true,
          timestamp: new Date(),
        });

        // Update local state
        setOccupiedSpots((prev) => new Set(prev).add(spotId));

        showSnackbar("Parking spot reserved successfully.");
      } catch (error) {
        console.error("Error updating Firestore:", error);
        showSnackbar("Error reserving parking spot. Please try again.");
      }
    }

    if (occupiedSpots.has(spotId) && userRole.toLowerCase() === "security") {
      try {
        // Fetch the current parking data
        const parkingDoc = await getDoc(doc(db, "parking", spotId));
        const spotData = parkingDoc.data();

        if (spotData && spotData.userId) {
          // Fetch the user's role from the 'users' collection
          const usersDoc = await getDoc(doc(db, "users", spotData.userId));
          let isPresident = false;

          if (usersDoc.exists()) {
            const userData = usersDoc.data();
            isPresident = userData.role && userData.role.toLowerCase() === "president";
          }

          await updateDoc(doc(db, "parking", spotId), {
            occupied: false,
          });

          // Prepare log details (common for both cases)
          const permitDoc = await getDoc(doc(db, "permits", user.uid));
          const userDoc = await getDoc(doc(db, "qrScans", spotData.userId));
          const userName = userDoc.exists() ? userDoc.data().name : "Unknown";
          const plateNo = permitDoc.exists() ? permitDoc.data().plateNo : "Unknown";
          const email = userDoc.exists() ? userDoc.data().email : "Unknown";

          const viewlogQuery = query(
            collection(db, "viewlogs"),
            where("spotId", "==", spotId),
            where("userId", "==", spotData.userId)
          );
          const viewlogSnapshot = await getDocs(viewlogQuery);

          let docId = `${spotId}_${spotData.userId}`;
          if (!viewlogSnapshot.empty) {
            const existingLogDoc = viewlogSnapshot.docs[0];
            const existingLogData = existingLogDoc.data();

            if (!existingLogData.freed) {
              // Update existing log
              await updateDoc(doc(db, "viewlogs", existingLogDoc.id), {
                freed: true,
                reserved: false,
                timesOut: new Date(),
              });
              showSnackbar("Spot marked as available.");
              return;
            }
            // Generate a new unique ID if freed is already true
            docId = `${spotId}_${spotData.userId}_${new Date().getTime()}`;
          }

          // Add log to 'viewlogs' collection
          await setDoc(doc(db, "viewlogs", docId), {
            userId: spotData.userId,
            name: userName,
            email: email,
            spotId: spotId,
            plateNumber: plateNo,
            freed: true,
            reserved: false,
            timesOut: new Date(),
          });

          // Skip QR update if the user is a president
          if (!isPresident) {
            // Update 'qrScans' only if the user is not a president
            await updateDoc(doc(db, "qrScans", spotData.userId), {
              active: false,
              timeOut: new Date(),
            });
          }

          // Update local state to reflect changes
          setOccupiedSpots((prev) => {
            const newSet = new Set(prev);
            newSet.delete(spotId);
            return newSet;
          });

          showSnackbar("Spot marked as available.");
        } else {
          showSnackbar("No user data found for this spot.");
        }
      } catch (error) {
        console.error("Error updating parking spot:", error);
        showSnackbar("Error updating the parking spot. Please try again.");
      }
    } else {
      showSnackbar("This spot is already available.");
    }


    if (userRole && userRole.toLowerCase() === "security") {
      if (
        spotId.startsWith("V") &&
        !spotId.startsWith("Vip") &&
        !occupiedSpots.has(spotId)
      ) {
        const path = window.location.pathname;

        const pathParts = path.split("/");

        const spotIdFromUrl = pathParts[pathParts.length - 1];

        console.log(spotIdFromUrl); // Logs the visitor ID, e.g., 'sa7kVx1wIPn6JHpLHxyq'

        if (!spotIdFromUrl) {
          showSnackbar("No visitor ID provided. Reservation cannot proceed.");
          return;
        }

        try {
          // Check if spotId exists in the 'visitor' collection
          const visitorDocRef = doc(db, "visitors", spotIdFromUrl);
          const visitorDoc = await getDoc(visitorDocRef);

          if (!visitorDoc.exists()) {
            showSnackbar("Visitor not found. Unable to proceed.");
            return;
          }

          // Retrieve visitor data (name and plate number)
          const visitorData = visitorDoc.data();

          const visitorfirstName = visitorData.firstName || "Unknown"; // Fallback to "Unknown"
          const visitorNumber = visitorData.phoneNumber || "Unknown"; // Fallback to "Unknown"
          const visitorlastName = visitorData.lastName || "Unknown"; // Fallback to "Unknown"
          const visitorName = visitorfirstName + " " + visitorlastName;
          const visitorPlateNumber = visitorData.plateNumber || "Unknown"; // Fallback to "Unknown"

          // Reserve the visitor spot (same logic as before)
          await setDoc(doc(db, "parking", spotId), {
            spotId: spotId,
            userId: spotIdFromUrl, // Security personnel ID
            occupied: true,
            timestamp: new Date(),
          });

          await setDoc(doc(db, "viewlogs", `${spotId}_${spotIdFromUrl}`), {
            userId: spotIdFromUrl,
            phoneNumber: visitorNumber,
            name: visitorName, // Name from the visitor document
            plateNumber: visitorPlateNumber, // Plate number from the visitor document
            spotId: spotId,
            designation: "Visitor",
            reserved: true,
            freed: false,
            timestamp: new Date(),
          });

          // Update local state
          setOccupiedSpots((prev) => new Set(prev).add(spotId));
          showSnackbar("Visitor spot reserved successfully.");
        } catch (error) {
          console.error("Error reserving visitor spot:", error);
          showSnackbar("Error reserving the visitor spot. Please try again.");
        }
      }

      if (occupiedSpots.has(spotId)) {
        try {
          // Fetch the current parking data before making changes
          const parkingDoc = await getDoc(doc(db, "parking", spotId));
          const spotData = parkingDoc.data();

          if (spotData && spotData.userId) {
            // Mark the spot as available
            await updateDoc(doc(db, "parking", spotId), {
              occupied: false,
            });

            // Update the 'qrScans' document with a 'timeOut' timestamp
            await updateDoc(doc(db, "qrScans", spotData.userId), {
              active: false,
              timeOut: new Date(), // Log the time the spot was freed
            });

            // Add data to the 'viewlogs' collection
            const permitDoc = await getDoc(doc(db, "permits", user.uid));
            const userDoc = await getDoc(doc(db, "qrScans", spotData.userId));
            const userName = userDoc.exists() ? userDoc.data().name : "Unknown"; // Get user name
            const plateNo = permitDoc.exists()
              ? permitDoc.data().plateNo
              : "Unknown"; // Get plate number
            const email = userDoc.exists() ? userDoc.data().email : "Unknown"; // Get user name

            // Check if there's already a log for this spotId and userId
            const viewlogQuery = query(
              collection(db, "viewlogs"),
              where("spotId", "==", spotId),
              where("userId", "==", spotData.userId)
            );
            const viewlogSnapshot = await getDocs(viewlogQuery);

            let docId = `${spotId}_${spotData.userId}`; // Default document ID based on spotId and userId
            if (!viewlogSnapshot.empty) {
              // If a viewlog exists, update the existing log
              const existingLogDoc = viewlogSnapshot.docs[0];
              const existingLogData = existingLogDoc.data();

              if (existingLogData.freed === true) {
                // If the existing log has freed as true, generate a new unique ID for the new log
                docId = `${spotId}_${spotData.userId}_${new Date().getTime()}`;
              } else {
                // Otherwise, update the existing log
                await updateDoc(doc(db, "viewlogs", existingLogDoc.id), {
                  freed: true,
                  reserved: false,
                  timesOut: new Date(),
                });
                showSnackbar("Spot marked as available.");
                return;
              }
            }

            // Add log to viewlogs collection with unique docId if freed is true
            await setDoc(doc(db, "viewlogs", docId), {
              userId: spotData.userId,
              name: userName,
              email: email,
              spotId: spotId,
              plateNumber: plateNo,
              freed: true,
              reserved: false,
              timesOut: new Date(),
            });

            // Update local state to reflect changes
            setOccupiedSpots((prev) => {
              const newSet = new Set(prev);
              newSet.delete(spotId);
              return newSet;
            });

            showSnackbar("Spot marked as available.");
          } else {
            console.warn("No user associated with this spot.");
            showSnackbar("No user data found for this spot.");
          }
        } catch (error) {
          console.error("Error updating parking spot:", error);
          showSnackbar("Error updating the parking spot. Please try again.");
        }
      } else {
        showSnackbar("This spot is already available.");
      }
      return; // End function for security role
    }

    // Logic for regular users
    if (!hasActiveQR && userRole.toLowerCase() === "user") {
      showSnackbar("Access denied: You need an active QR scan to click spot.");
      return;
    }

    if (user && userRole.toLowerCase() === "user") {
      try {
        if(occupiedSpots.has(spotId)){
          showSnackbar("Error: Only security can access this spot.")
          return;
        }
        // Check if the user already has a reserved spot and whether it's active
        const parkingQuery = query(
          collection(db, "parking"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(parkingQuery);

        if (!querySnapshot.empty) {
          // Check if the user already has a reserved spot, but check if it's not active
          const userParkingData = querySnapshot.docs[0].data();
          if (userParkingData.occupied === true) {
            showSnackbar(
              "Access denied: You already have an active parking spot."
            );
            return;
          }
        }

        // Permit validation
        const permitDoc = await getDoc(doc(db, "permits", user.uid));
        if (permitDoc.exists()) {
          const permitData = permitDoc.data();
          const plateNumber = permitData.plateNo;
          const designation = permitData.designation;

          const userDoc = await getDoc(doc(db, "qrScans", user.uid));
          const userName = userDoc.exists() ? userDoc.data().name : "Unknown"; // Get user name
          const phoneNumber = userDoc.exists()
            ? userDoc.data().contactNumber
            : "Unknown"; // Get user name

          // Reserve the parking spot
          await setDoc(doc(db, "parking", spotId), {
            spotId: spotId,
            userId: user.uid,
            occupied: true,
            timestamp: new Date(),
          });

          // Update 'qrScans' with the new data
          await updateDocument(user.uid, plateNumber, spotId);

          // Check if there's already a log for this spotId and userId
          const viewlogQuery = query(
            collection(db, "viewlogs"),
            where("spotId", "==", spotId),
            where("userId", "==", user.uid)
          );
          const viewlogSnapshot = await getDocs(viewlogQuery);

          let docId = `${spotId}_${user.uid}`;
          if (!viewlogSnapshot.empty) {
            const existingLogDoc = viewlogSnapshot.docs[0];
            const existingLogData = existingLogDoc.data();

            if (existingLogData.freed === true) {
              docId = `${spotId}_${user.uid}_${new Date().getTime()}`;
            } else {
              // Otherwise, update the existing log
              await updateDoc(doc(db, "viewlogs", existingLogDoc.id), {
                freed: false,
                reserved: true,
                timestamp: new Date(),
              });
              showSnackbar("Parking spot reserved successfully.");
              return;
            }
          }

          // Add log to viewlogs collection with unique docId if reserved
          await setDoc(doc(db, "viewlogs", docId), {
            userId: user.uid,
            name: userName || "Unknown", // Get user's display name or fallback
            spotId: spotId,
            plateNumber: plateNumber,
            phoneNumber: phoneNumber,
            designation: designation,
            freed: false,
            reserved: true,
            timestamp: new Date(),
          });

          // Update local state
          setOccupiedSpots((prev) => new Set(prev).add(spotId));

          showSnackbar("Parking spot reserved successfully.");
        } else {
          showSnackbar(
            "Error: No permit found. Please ensure your permit is registered."
          );
        }
      } catch (error) {
        console.error(
          "Error fetching permit data or updating Firestore:",
          error
        );
      }
    }
  };

  const updateDocument = async (userId, plateNumber, spotId) => {
    try {
      const userRef = doc(db, "qrScans", userId);

      await updateDoc(userRef, {
        plateNumber: plateNumber, // Add the plate number field
        spotId: spotId, // Add the parking spot ID field
        updatedAt: new Date(), // Optional: Timestamp when the data was updated
      });

      console.log("Document updated successfully!");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const getSpotColor = (spotId) => {
    if (occupiedSpots.has(spotId)) {
      if (spotId.startsWith("Vip")) {
        return "#9C89B8";
      } else {
        return "red";
      }
    }
    if (spotId.startsWith("Motor")) {
      return "#64B5F6";
    } else if (spotId.startsWith("Car")) {
      return "#81C784";
    } else if (spotId.startsWith("Vip")) {
      return "#F0A6CA";
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

          <Grid item xs={2}>
            {[8, 9, 10, 11, 12].map((spot) => (
              <Box
                key={spot}
                onClick={() => handleSpotClick(`Presedent Spot ${spot}`)}
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
                onClick={() => handleSpotClick(`Vip Spot ${spot}`)}
                sx={{
                  width: "130px",
                  fontSize: "12px",
                  bgcolor: getSpotColor(`Vip Spot ${spot}`),
                  p: 1,
                  mb: 1,
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                VIP Spot {spot}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Time before snackbar auto-closes (in ms)
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
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

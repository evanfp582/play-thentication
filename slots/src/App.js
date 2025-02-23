import logo from './logo.svg';
import './App.css';
import { Grid, Button, Box } from '@mui/material';
import bar from "./images/bar.PNG"
import seven from "./images/7.PNG"
import bell from "./images/bell.PNG"
import cherry from "./images/cherry.PNG"
import lemon from "./images/lemon.PNG"
import orange from "./images/orange.PNG"
import win_sound from "./music/win.wav"
import spin_sound from "./music/spin.wav"
import { useState, useEffect } from 'react';


const im_dict = {
  seven: seven,
  bar: bar,
  bell: bell,
  cherry: cherry,
  lemon: lemon,
  orange: orange,
};
 

function App() {

  const [gridImages, setGridImages] = useState([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
    // State to track the audio elements to avoid re-playing or re-pausing them multiple times
    // const [spinAudio, setSpinAudio] = useState(null);
    // const [winnerAudio, setWinnerAudio] = useState(null);



  useEffect(() => {
    setGridImages([...Array(9)].map(() => getRandomImage()));
  }, []);

  useEffect(() => {
    let intervalId;

    if (isSpinning) {
      
      intervalId = setInterval(() => {
        regenerateImages(); // Regenerate images every 100ms (adjustable interval)
      }, 1);

      // Play the spin sound when spinning starts
      
    } else {
      clearInterval(intervalId); // Clear the interval when stopping the spin

      // Check if the middle row has the same images
     
    }

    // Cleanup the interval on component unmount or state change
    return () => clearInterval(intervalId);
  }, [isSpinning, gridImages]);  // Re-run this effect whenever isSpinning or gridImages changes

  const getRandomImage = () => {
    return getRandomDictionaryEntry().value
  }

  const regenerateImages = () => {
    setGridImages([...Array(9)].map(() => getRandomImage())); // Set new random images
  };

  const getRandomDictionaryEntry = () => {
    // Get all keys of the dictionary
    const keys = Object.keys(im_dict);

    // Randomly pick an index from the keys array
    const randomIndex = Math.floor(Math.random() * keys.length);

    // Get the key using the random index and return the corresponding value
    const randomKey = keys[randomIndex];
    return { key: randomKey, value: im_dict[randomKey] };
  }

  const handleButtonClick = () => {
    if (isSpinning) {
      // If currently spinning, stop the spin and regenerate the images
      setIsSpinning(false);
      const middleRow = [gridImages[3], gridImages[4], gridImages[5]];

      if (middleRow.every(img => img === middleRow[0])) {
        // If the images in the middle row are the same, show the "Winner!" popup
        setShowWinnerPopup(true);

        // Play the winner sound when a winner is found
        const winnerAudio = new Audio(win_sound);
        winnerAudio.play();
      }
      regenerateImages();
    } else {
      // If not spinning, start the spin (just update the state)
      setIsSpinning(true);
      const spinAudio = new Audio(spin_sound);
      spinAudio.play();
      regenerateImages();
    }
  };

  const closePopup = () => {
    setShowWinnerPopup(false); // Close the popup
    // if (winnerAudio) winnerAudio.pause();
  };

  return (
    <div className="App">
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* 3x3 Grid */}
        <Grid container spacing={0} sx={{ flexGrow: 1 }}>
          {/* Loop to create 9 grid items */}
          {[...Array(9)].map((_, index) => (
            <Grid item xs={4} key={index} sx={{ padding: 0 }}>
              <Box
                sx={{
                  height: '100%', // Ensure Box takes full height of the grid cell
                  backgroundColor: index >= 3 && index < 6 ? 'red' : 'transparent', // Red background for center row
                  display: 'flex',
                  border: '1px solid black',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 0,
                  boxShadow: 0,
                  overflow: 'hidden', // Ensure image fits properly within the box
                }}
              >
                {/* Placeholder text or content */}
                <img src={gridImages[index]} alt={""} style={{ 
                  // width: '100%',  // Stretch image to fill the width
                  // height: '100%', // Stretch image to fill the height
                  objectFit: 'cover', // Ensure the image covers the box without distorting
                }}/>
                {/* <img src={bar} alt={""} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}

              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Large Spin Button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleButtonClick}
          sx={{
            marginBottom: 2,
            backgroundColor: 'gold',
            fontSize: 50,
            fontWeight: 'bold',
            padding: '10px 20px',
          }}
        >
          {isSpinning ? 'Stop' : 'Spin!'} {/* Button text changes based on isSpinning state */}
        </Button>
    </Box>
    {/* Winner Popup */}
    {showWinnerPopup && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: 3,
            textAlign: 'center',
          }}
        >
          <h2>Winner!</h2>
          <Button variant="contained" color="secondary" onClick={closePopup}>
            Close
          </Button>
        </Box>
      )}
    </div>
  );
}

export default App;

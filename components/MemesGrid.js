import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Draggable from 'react-draggable';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import domtoimage from 'dom-to-image';
import Button from '@material-ui/core/Button';
import { saveAs } from 'file-saver';


const useStyles = makeStyles(theme => ({
  root: {
    marginTop: "1rem",
    marginLeft: "1rem",
    marginRight: 0,
  },
  paper: {
    height: "6rem",
    width: "6rem",
  },
  control: {
    padding: theme.spacing(2),
    marginLeft: "1rem",
    width: "91%"
  },
  image: {
    height: "6rem",
    width: "6rem",
  },
  chosen: {
    width: "38rem",
    marginLeft: 0,
  },
  memeText: {
    padding: theme.spacing(3, 2),
    width: "95%"
  },
  textEdit: {
    marginTop: "2rem"
  },
  addTextIcon: {
    marginLeft: 0
  },
  editGrid: {
    width: "38rem",
    position: "relative"
  },
  dragText: {
    position: "absolute",
    overflowWrap: "normal",
    whiteSpace: "pre",
    maxWidth: "80%",
  }
}));

export default function MemesGrid(props) {
  const [gridOrder, setGridOrder] = React.useState(1);
  const [chosenMeme, setChosenMeme] = React.useState(0);
  const [textArray, setTextArray] = React.useState(["ADD TEXT"]);
  const [numberOfText, setNumberOfText] = React.useState(1);
  const classes = useStyles();

  const handleChange = event => {
    setGridOrder(Number(event.target.value));
  }

  const handleTextChange = event => {
    let newTextArray = [...textArray];
    newTextArray[event.target.id] = event.target.value.toUpperCase();
    setTextArray(newTextArray);
  }

  const addText = event => {
    let newTextArray = [...textArray];
    newTextArray.push("ADD TEXT");
    setTextArray(newTextArray);
    setNumberOfText(numberOfText + 1);
  }

  const handleClick = event => {
    setChosenMeme(Number(event.currentTarget.id));
  }

  const doneAndDownload = () => {
    domtoimage.toBlob(document.getElementById('outputImage'))
      .then(function (blob) {
        saveAs(blob, 'my-node.png');
      });
  }

  return (
    <div>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={6}>
          <Grid container spacing={4}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => (
              <Grid onClick={handleClick} key={value + (gridOrder - 1) * 10} id={value + (gridOrder - 1) * 10} item>
                <Paper className={classes.paper}>
                  <img
                    src={props.items[value + (gridOrder - 1) * 10].url}
                    alt="" className={classes.image}
                  />
                </Paper>
              </Grid>
            ))}
            <Paper className={classes.control}>
              <Grid container>
                <Grid item>
                  <FormLabel>Most Popular Memes</FormLabel>
                  <RadioGroup
                    name="gridOrder"
                    aria-label="Next"
                    value={gridOrder.toString()}
                    onChange={handleChange}
                    row
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                      <FormControlLabel
                        key={value}
                        value={value.toString()}
                        control={<Radio />}
                        label={value.toString()}
                      />
                    ))}
                  </RadioGroup>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid container className={classes.textEdit}>
            <Paper className={classes.memeText}>
              <Typography variant="h5" component="h3">
                Add Text
              </Typography>
              {textArray.map((value, index) => (
                <div>
                  <TextField
                    key={index}
                    id={index}
                    label={"Text" + (index + 1)}
                    className={classes.textField}
                    onChange={handleTextChange}
                    margin="normal"
                    placeholder={value}
                    defaultValue="ADD TEXT"
                    fullWidth
                    multiline
                  />
                </div>
              ))}
              <div className={classes.addTextIcon}>
                <IconButton onClick={addText} fontSize="large" color="primary" className={classes.addTextButton} aria-label="add text">
                  <NoteAddIcon />
                </IconButton>
              </div>
              <div onClick={doneAndDownload}>
                <Button variant="contained" color="primary"> Done & Download</Button>
              </div>
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Paper id="outputImage" className={classes.editGrid}>
            {textArray.map((value, index) => (
              <Draggable
                defaultPosition={{ x: 280, y: 0 }}
                key={index}
                bounds="parent"
              >
                <h1
                  align="center"
                  className={classes.dragText}
                  style={{ color: "white", fontSize: "2rem", zIndex: index + 1 }}
                >{value + " "}</h1>
              </Draggable>
            ))}
            <img
              src={props.items[chosenMeme].url}
              alt="" className={classes.chosen}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

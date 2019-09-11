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
import DraggableCore from 'react-draggable';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import domtoimage from 'dom-to-image';
import Button from '@material-ui/core/Button';
import { saveAs } from 'file-saver';
import Slider from '@material-ui/core/Slider';
import { CompactPicker } from 'react-color';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import Popover from '@material-ui/core/Popover';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import GetAppIcon from '@material-ui/icons/GetApp';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

const shortid = require('shortid');

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
    padding: theme.spacing(1, 1),
    width: "95%"
  },
  textEdit: {
    marginTop: "2rem"
  },
  textField: {
    width: "60%",
    marginBottom: 0
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
    marginBlockEnd: 0,
    marginBlockStart: 0
  },
  fontSliderBox: {
    display: "inline-block",
    marginLeft: "1rem"
  },
  fontColorBox: {
    display: "inline-block",
    marginLeft: "1rem",
  },
  deleteIcon: {
    display: "inline-block",
    marginLeft: "1rem",
    marginRight: "none",
  },
  previewImage: {
    margin: "0.5rem",
    marginBottom: 0
  },
  downloadButton: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "0.5rem"
  }
}));

export default function MemesGrid(props) {
  const [gridOrder, setGridOrder] = React.useState(1);
  const [chosenMeme, setChosenMeme] = React.useState(0);
  const [textArray, setTextArray] = React.useState(["ADD TEXT"]);
  const [numberOfText, setNumberOfText] = React.useState(1);
  const [font, setFont] = React.useState([40]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [fontColor, setFontColor] = React.useState(["#ffffff"]);
  const [popoverIndex, setPopoverIndex] = React.useState(0);
  const [delta, setDelta] = React.useState([{ x: 280, y: 0 }]);
  const [ouputUrl, setOuputUrl] = React.useState("");
  const classes = useStyles();

  const handleChange = event => {
    setGridOrder(Number(event.target.value));
  }

  const handleFontsizeChange = (event, newValue) => {
    let newFontArray = [...font];
    newFontArray[event.target.id] = newValue;
    setFont(newFontArray);
  };

  const handleTextChange = event => {
    let newTextArray = [...textArray];
    newTextArray[event.target.id] = event.target.value;
    setTextArray(newTextArray);
  }

  const addText = event => {
    let newTextArray = [...textArray];
    newTextArray.push("ADD TEXT");
    setTextArray(newTextArray);
    setNumberOfText(numberOfText + 1);
    let newFontArray = [...font];
    newFontArray.push(40);
    setFont(newFontArray);
    let newFontColor = [...fontColor];
    newFontColor.push("#ffffff");
    setFontColor(newFontColor);
    let newDelta = [...delta];
    newDelta.push({ x: 280, y: 0 });
    setDelta(newDelta);
  }

  const handleClick = event => {
    setChosenMeme(Number(event.currentTarget.id));
  }

  const openColorPicker = event => {
    setAnchorEl(event.currentTarget);
    setPopoverIndex(Number(event.currentTarget.id));
  }

  const deleteText = event => {
    let newTextArray = [...textArray];
    newTextArray.splice(event.currentTarget.id, 1);
    setTextArray(newTextArray);
    let newFontArray = [...font];
    newFontArray.splice(event.currentTarget.id, 1);
    setFont(newFontArray);
    let newFontColor = [...fontColor];
    newFontColor.splice(event.currentTarget.id, 1);
    setFontColor(newFontColor);
    let newDelta = [...delta];
    newDelta.splice(event.currentTarget.id, 1);
    setDelta(newDelta);
  }

  const handleColorChange = (color, event) => {
    let newFontColor = [...fontColor];
    newFontColor[popoverIndex] = color.hex;
    console.log(newFontColor);
    setFontColor(newFontColor);
  }

  const saveDeltas = (index, event, ui) => {
    let newDelta = [...delta];
    newDelta[index] = { x: ui.lastX, y: ui.lastY };
    setDelta(newDelta);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleClose2 = () => {
    setAnchorEl2(null);
  }
  const open = Boolean(anchorEl);

  const previewProcess = event => {
    domtoimage.toBlob(document.getElementById('outputImage'))
      .then(blob => {
        setOuputUrl(URL.createObjectURL(blob));
      });
  }

  const preview = event => {
    setAnchorEl2(event.currentTarget);
  }
  const openPreview = Boolean(anchorEl2);

  const doneAndDownload = () => {
    let link = document.createElement('a');
    link.download = 'my-meme.png';
    link.href = ouputUrl;
    link.click();
  }

  return (
    <div>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={6}>
          <Grid container spacing={4}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => (
              <Grid onClick={handleClick} key={value} id={value + (gridOrder - 1) * 10} item>
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
                    id={index}
                    label={"Text" + (index + 1)}
                    className={classes.textField}
                    onChange={handleTextChange}
                    margin="normal"
                    placeholder={value}
                    defaultValue="ADD TEXT"
                    multiline
                    value={value}
                  />
                  <IconButton key={index} id={index} className={classes.fontColorBox} onClick={openColorPicker}>
                    <ColorLensIcon fontSize="large" color="secondary" />
                  </IconButton>
                  <Popover
                    id={index}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <CompactPicker color={fontColor[popoverIndex]} onChangeComplete={handleColorChange} />
                  </Popover>
                  <div className={classes.fontSliderBox}>
                    <Slider
                      key={index}
                      id={index}
                      value={font[index]}
                      onChange={handleFontsizeChange}
                      aria-labelledby="continuous-slider"
                    />
                    <Typography id="vertical-slider" gutterBottom>
                      Font-size
                    </Typography>
                  </div>
                  <IconButton className={classes.deleteIcon} id={index} onClick={deleteText}>
                    <DeleteForeverIcon fontSize="large" />
                  </IconButton>
                </div>
              ))}
              <IconButton className={classes.addTextIcon} onClick={addText} color="primary" className={classes.addTextButton} aria-label="add text">
                <AddCircleIcon fontSize="large" />
              </IconButton>
              <div onMouseEnter={previewProcess}>
                <Button onClick={preview} variant="contained" color="secondary">Preview</Button>
              </div>
              <Popover
                open={openPreview}
                anchorEl={anchorEl2}
                onClose={handleClose2}
                anchorPosition={{
                  left: 300,
                  top: 20
                }}
                anchorReference="anchorPosition"
              >
                <img className={classes.previewImage} src={ouputUrl} alt="" />
                <div className={classes.downloadButton}>
                  <Button onClick={handleClose2} color="secondary"><KeyboardReturnIcon /> Re-edit</Button>
                  <Button onClick={doneAndDownload} color="primary"><GetAppIcon /> Download</Button>
                </div>

              </Popover>
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Paper id="outputImage" className={classes.editGrid}>
            {textArray.map((value, index) => (
              <DraggableCore
                onStop={(event, ui) => saveDeltas(index, event, ui)}
                position={delta[index]}
                bounds="parent"
              >
                <h1
                  align="center"
                  className={classes.dragText}
                  style={{ color: fontColor[index], fontSize: `${font[index] / 20}rem`, zIndex: index + 1 }}
                >
                  {value}
                </h1>
              </DraggableCore>
            ))}
            <img
              className={classes.chosen}
              src={props.items[chosenMeme].url}
              alt=""
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

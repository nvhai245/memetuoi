import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import LoginForm from '../components/LoginForm';
import Router from 'next/router';
import axios from 'axios';
import SignupForm from '../components/SignupForm';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));

export default function Header(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl3, setAnchorEl3] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const open3 = Boolean(anchorEl3);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClickOpen2() {
        setOpen2(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const gotoProfile = () => {
      setAnchorEl(null);
      handleMobileMenuClose();
      Router.push(`/profile/${props.status.user._id}`, `/profile`);
    }

    const handleClose2 = () => {
        setOpen2(false);
    };

    function handleMenu3(event) {
        setAnchorEl3(event.currentTarget);
    }

    function handleClose3() {
        setAnchorEl3(null);
    }

    function handleProfileMenuOpen(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleMobileMenuClose() {
        setMobileMoreAnchorEl(null);
    }

    function handleMenuClose() {
        setAnchorEl(null);
        handleMobileMenuClose();
    }

    const handleLogout = async () => {
        await axios.get("http://localhost:3000/auth/logout").then(res => {
            if (res.data.message) {
                setAnchorEl(null);
                handleMobileMenuClose();
                Router.push("/index");
            }
        })
    }

    function handleMobileMenuOpen(event) {
        setMobileMoreAnchorEl(event.currentTarget);
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={menuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={gotoProfile}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>My account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton aria-label="show 11 new notifications" color="inherit">
                    <Badge badgeContent={11} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <div className={classes.grow}>
          <AppBar position="static" color="secondary">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="open drawer"
                onClick={handleMenu3}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl3}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open3}
                onClose={handleClose3}
              >
                <MenuItem onClick={() => {setAnchorEl3(null); Router.push("/memes/hot")}}><WhatshotIcon color="error"/> Hot Memes</MenuItem>
                <MenuItem onClick={() => {setAnchorEl3(null); Router.push("/memes")}}><BrightnessHighIcon color="error"/> Best Of Day</MenuItem>
                <MenuItem onClick={() => {setAnchorEl3(null); Router.push("/create")}}><BorderColorIcon color="primary"/> Create New Memes</MenuItem>
              </Menu>
              <Typography className={classes.title} variant="h6" noWrap>
                Fresh Memes
              </Typography>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </div>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                {!props.status.user &&
                  <div>
                    <Button onClick={handleClickOpen} color="inherit">Login</Button>
                    <Dialog fullWidth onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                      <LoginForm submit={handleClose} />
                    </Dialog>
                    <Button onClick={handleClickOpen2} color="inherit">Signup</Button>
                    <Dialog fullWidth onClose={handleClose2} aria-labelledby="simple-dialog-title" open={open2}>
                      <SignupForm submit={handleClose2} />
                    </Dialog>
                  </div>
                }
                {props.status.user &&
                  <div>
                    <Typography display="inline">{props.status.user.username}</Typography>
                                <IconButton aria-label="show 4 new mails" color="inherit">
                                    <Badge badgeContent={4} color="secondary">
                                        <MailIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton aria-label="show 17 new notifications" color="inherit">
                                    <Badge badgeContent={17} color="secondary">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                            </div>
                        }
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}

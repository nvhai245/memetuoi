import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: "40rem",
        margin: "1rem auto"
    },
    media: {
        width: "32rem",
        margin: "0 auto"
    },
    progress: {
        width: "1em",
        margin: "1rem auto"
    },
    root: {
        margin: "0px 0px"
    },
    likeIcon: {
        marginLeft: "30%"
    },
    "@media only screen and (max-width: 720px)": {
        card: {
            maxWidth: "100%",
            margin: "1rem 0"
        },
        media: {
            width: "100%"
        },
        likeIcon: {
            marginLeft: "15%"
        }
    }
}));


export default function Feed(props) {
    let dat = Object.entries(props.data).slice(0, 10).map(entry => entry[1]);
    console.log(dat);
    const [memeData, setMemeData] = useState(dat);
    const [isFetching, setIsFetching] = useState(false);
    const [numPosts, setNumPosts] = useState(10);
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        setIsFetching(true);
        console.log(document.documentElement.offsetHeight);
    }
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [numPosts]);
    useEffect(() => {
        if (!isFetching) return;
        fetchData();
    }, [isFetching]);
    useEffect(() => {
        [...document.querySelectorAll(".redditVideo")].map(video => {
            let myvideo = video;
            let myaudio = document.getElementById(`myAudio${video.id.slice(7)}`);
            myvideo.onplay = () => {
                myaudio.currentTime = myvideo.currentTime;
                myaudio.play();
            }
            myvideo.onpause = () => { myaudio.pause(); }
            myvideo.onwaiting = () => {
                myaudio.pause();
            }
            myvideo.onplaying = () => {
                myaudio.currentTime = myvideo.currentTime;
                myaudio.play();
            }
        });
    });
    const classes = useStyles();
    const fetchData = () => {
        let newMemeData = Object.entries(props.data).slice(0, numPosts + 10).map(entry => entry[1]);
        setMemeData(newMemeData);
        setIsFetching(false);
        setNumPosts(numPosts + 10);
    }
    return (
        <div className={classes.root}>
            {memeData.map((value, index) => (
                <Card className={classes.card}>
                    <CardHeader
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={value.title}
                    />
                    <div className={classes.media}>
                        {value.is_video ?
                            <video style={{width: "100%"}} className="redditVideo" id={`myVideo${index}`} controls>
                                <source src={value.media.reddit_video.fallback_url} type="video/mp4" />
                                <audio id={`myAudio${index}`} controls>
                                    <source src={`${value.url}/audio`} type="audio/mpeg" />
                                </audio>
                            </video> :
                            value.type !== "image" ? value.media && value.media.type === "gfycat.com" ?
                                <img style={{width: "100%"}} preload="metadata" src={value.media.oembed.thumbnail_url} /> :
                                <video style={{width: "100%"}} muted={true} preload="metadata" autoPlay={true} loop={true}>
                                    <source src={`${value.url.slice(0, value.url.lastIndexOf("."))}.mp4`} type="video/mp4" />
                                </video> :
                                <img style={{width: "100%"}} preload="metadata" src={value.url} />
                        }
                    </div>
                    <CardActions disableSpacing>
                        <IconButton className={classes.likeIcon} aria-label="add to favorites">
                            <span style={{ color: "rgba(0, 0, 0, 1)" }} role="img" aria-label="sheep">😆</span>
                        </IconButton>
                        <span style={{ marginRight: "5%" }}>{value.likes}</span>
                        <IconButton aria-label="add to favorites">
                            <ChatIcon color="secondary" />
                        </IconButton>
                        <span style={{ marginRight: "5%" }}>{value.comments}</span>
                        <IconButton aria-label="share">
                            <ShareIcon />
                        </IconButton>
                    </CardActions>
                </Card>
            ))}
            <div className={classes.progress}><CircularProgress /></div>
        </div>
    )
}

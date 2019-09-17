import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField } from 'formik-material-ui';
import Router from 'next/router';
import Button from "@material-ui/core/Button";
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1, 1),
    },
    button: {
        marginTop: "0.5rem"
    },
    container: {
        padding: "0 0"
    },
    signup: {
        fontWeight: 450
    },
    errorMessage: {
        float: "right",
        marginTop: "0.5rem"
    }
}));

const SignupForm = (props) => {
    const classes = useStyles();
    const [databaseErr, setErr] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(false);
    const handleSubmit = async (fields, actions) => {
        setSubmitStatus(true);
        event.preventDefault();
        let code = undefined;
        await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fields, null, 4),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fields, null, 4),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Router.push(`/profile?userId=${data._id}`, `/profile`);
                setSubmitStatus(false);
                actions.setSubmitting(false);
                props.submit();
                Router.push('/');
            });
    };
    return (
        <React.Fragment>
            <CssBaseline />
            <Container className={classes.container} maxWidth="sm">
                <Paper className={classes.root}>
                    <Typography className={classes.signup} color="textSecondary" align="center" variant="h2">
                        Signup
             </Typography>
                    <Formik className={classes.formik}
                        initialValues={{
                            username: '',
                            email: '',
                            password: '',
                            confirmPassword: ''
                        }}
                        validationSchema={Yup.object().shape({
                            username: Yup.string()
                                .min(4, 'Username must be at least 4 characters')
                                .required('Username is required'),
                            email: Yup.string()
                                .email('Email is invalid')
                                .required('Email is required'),
                            password: Yup.string()
                                .min(6, 'Password must be at least 6 characters')
                                .required('Password is required'),
                            confirmPassword: Yup.string()
                                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                                .required('Confirm Password is required')
                        })}
                        onSubmit={handleSubmit}
                        render={({ errors, status, touched }) => (
                            <Form>
                                <div className="form-group">
                                    <Field fullWidth label="Username" name="username" type="text" component={TextField} className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                </div>
                                <div className="form-group">
                                    <Field fullWidth label="Email" name="email" type="email" component={TextField} className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                </div>
                                <div className="form-group">
                                    <Field fullWidth label="Password" name="password" type="password" component={TextField} className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                </div>
                                <div className="form-group">
                                    <Field fullWidth label="Confirm Password" name="confirmPassword" type="password" component={TextField} className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                                </div>
                                <div className={classes.button}>
                                    <Button size="large" disabled={submitStatus} fullWidth type="submit" variant="contained" color="primary"> Signup </Button>
                                </div>
                            </Form>
                        )}
                    />
                </Paper>
                {databaseErr &&
                    <Typography className={classes.errorMessage} color="error" variant="button" gutterBottom>
                        wrong email or password!
             </Typography>
                }
            </Container>
        </React.Fragment>
    );
};

export default SignupForm;

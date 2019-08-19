import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { TextField } from 'formik-material-ui';
import Button from "@material-ui/core/Button";
import * as Yup from 'yup';
import Router from 'next/router';
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
        marginTop: "5rem"
    },
    login: {
        fontWeight: 450
    },
    errorMessage: {
        float: "right",
        marginTop: "0.5rem"
    }
}));

const LoginForm = () => {
    const classes = useStyles();
    const [databaseErr, setErr] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(false);
    const handleSubmit = (fields, actions) => {
        setSubmitStatus(true);
        event.preventDefault();
        let code = undefined;
        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fields, null, 4),
        })
            .then(response => {
                code = response.status;
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (code == 404 || 403) {
                    setErr(true);
                }
                if (code == 200) {
                    setErr(false);
                    Router.push(`/profile?userId=${data._id}`, `/profile`)
                }
                actions.setSubmitting(false);
                setSubmitStatus(false);
            });
    };
    return (
        <React.Fragment>
            <CssBaseline />
            <Container className={classes.container} maxWidth="sm">
                <Paper className={classes.root}>
                    <Typography className={classes.login} color="textSecondary" align="center" variant="h2">
                        Login
             </Typography>
                    <Formik className={classes.formik}
                        initialValues={{
                            email: '',
                            password: '',
                            confirmPassword: ''
                        }}
                        validationSchema={Yup.object().shape({
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
                                    <Field fullWidth label="Email" name="email" type="email" component={TextField} className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                </div>
                                <div className="form-group">
                                    <Field fullWidth label="Password" name="password" type="password" component={TextField} className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                </div>
                                <div className="form-group">
                                    <Field fullWidth label="Confirm Password" name="confirmPassword" type="password" component={TextField} className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                                </div>
                                <div className={classes.button}>
                                    <Button size="large" disabled={submitStatus} fullWidth type="submit" variant="contained" color="primary"> Login </Button>
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

export default LoginForm;

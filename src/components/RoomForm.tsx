import React from 'react';
import {
  makeStyles,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

import FieldError from './FieldError';

interface IProps {
  codeExistsError: boolean;
  createRoom: (values: IValues) => void;
}

export interface IValues {
  code: string;
  title: string;
  isBlind: boolean;
}

const schema = yup.object().shape({
  code: yup
    .string()
    .trim()
    .matches(/^[a-zA-Z0-9\-_]+$/, 'Leyfilegir stafir: [a-zA-Z0-9-_]')
    .required(),
  title: yup.string().required(),
  isBlind: yup.boolean().required(),
});

const useStyles = makeStyles((theme) => ({
  submitContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const RoomForm: React.FC<IProps> = ({ codeExistsError, createRoom }) => {
  const classes = useStyles();

  return (
    <Formik
      onSubmit={createRoom}
      initialValues={getInitialValues()}
      validationSchema={schema}
      validateOnChange
    >
      {({
        values,
        errors,
        isSubmitting,
        submitCount,
        dirty,
        isValid,
        handleChange,
        handleSubmit,
        handleBlur,
      }) => {
        const hasSubmitted = !!submitCount;

        return (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  autoFocus
                  required
                  id="code"
                  variant="outlined"
                  label="Kóði"
                  value={values.code}
                  disabled={isSubmitting}
                  error={(hasSubmitted && !!errors.code) || codeExistsError}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {hasSubmitted && !!errors.code && !!values.code && (
                  <FieldError>{errors.code}</FieldError>
                )}
                {codeExistsError && (
                  <FieldError>Kóði er nú þegar til</FieldError>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  id="title"
                  variant="outlined"
                  label="Titill"
                  value={values.title}
                  disabled={isSubmitting}
                  error={hasSubmitted && !!errors.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} className={classes.submitContainer}>
                <FormControlLabel
                  label="Blind smökkun"
                  control={
                    <Checkbox
                      id="isBlind"
                      checked={values.isBlind}
                      onChange={handleChange}
                    />
                  }
                />
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={
                    isSubmitting || !dirty || (hasSubmitted && !isValid)
                  }
                >
                  Vista
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );

  function getInitialValues() {
    return { code: '', title: '', isBlind: false };
  }
};

export default RoomForm;

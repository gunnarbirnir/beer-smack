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
import { IRoom } from '../interfaces';

interface IProps {
  room: IRoom | null;
  editing: boolean;
  codeExistsError: boolean;
  createRoom: (values: IValues) => Promise<void>;
  updateRoom: (values: IValues) => Promise<void>;
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
    alignItems: 'flex-start',
  },
}));

const RoomForm: React.FC<IProps> = ({
  room,
  editing,
  codeExistsError,
  createRoom,
  updateRoom,
}) => {
  const classes = useStyles();

  return (
    <Formik
      onSubmit={editing ? updateRoom : createRoom}
      initialValues={getInitialValues()}
      validationSchema={schema}
      validateOnChange
      enableReinitialize
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
                  autoComplete="off"
                  value={values.code}
                  disabled={isSubmitting || editing}
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
                  autoComplete="off"
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
                  {editing ? 'Vista' : 'Búa til smökkun'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );

  function getInitialValues() {
    return room
      ? { code: room.code, title: room.title, isBlind: room.isBlind }
      : { code: '', title: '', isBlind: false };
  }
};

export default RoomForm;

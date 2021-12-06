import React from 'react';
import { makeStyles } from '@material-ui/core';
import * as yup from 'yup';

interface IProps {
  open: boolean;
}

export interface IValues {
  name: string;
  index: number;
  type: string;
  abv: number;
  active: boolean;
  brewer: string;
  country: string;
  description: string;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  index: yup.number().required(),
  type: yup.string().required(),
  abv: yup.number().required(),
  active: yup.boolean().required(),
  brewer: yup.string().required(),
  country: yup.string().required(),
  description: yup.string().required(),
});

const useStyles = makeStyles((theme) => ({}));

const EditBeerModal: React.FC<IProps> = ({ open }) => {
  const classes = useStyles();

  return null;

  function getInitialValues() {
    return {
      name: '',
      index: 0,
      type: '',
      abv: 0,
      active: true,
      brewer: '',
      country: 'Ísland',
      description: '',
    };
  }
};

export default EditBeerModal;

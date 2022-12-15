import React from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from 'react-hook-form' 

import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  })

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values))

    if (!data.payload) {
      return alert('Авторизоваться не удалось.')
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    } 
    
  }

  if (isAuth) {
    return <Navigate to='/'/>
  }

  return (
    <Paper classes={{ root: styles.root }} style={{width: '90%', backgroundColor: 'rgb(177, 184, 203)', borderRadius: '1px'}}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        className={styles.field}
        style={{color: 'white', borderRadius: '1px'}}
        label="E-Mail"
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        {...register('email', { required: 'Укажите почту.' })}
        fullWidth
      />
      <TextField 
      className={styles.field} 
      style={{color: 'white'}}
      label="Пароль"
      error={Boolean(errors.email?.message)}
      helperText={errors.password?.message}
      {...register('password', { required: 'Укажите пароль.' })} 
      fullWidth />
      <Button disabled={!isValid} type="submit" size="large" style={{backgroundColor: 'rgb(203 177 184)', color: 'white', border: '1px solid white', borderRadius: '1px'}} variant="contained" fullWidth>
        Войти
      </Button>
      </form>
    </Paper>
  );
};

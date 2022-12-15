import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'
import { logout, selectIsAuth } from "../../redux/slices/auth";
import { useDispatch, useSelector } from 'react-redux'

import styles from './Header.module.scss';
import Container from '@mui/material/Container';

export const Header = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      dispatch(logout())
      window.localStorage.removeItem('token')
    }
  };

  return (
    <div className={styles.root} style={{backgroundColor: '#b8cbb1'}}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link style={{border: '1px solid white', borderRadius: '1px', backgroundColor: '#cbb1b8'}} className={styles.logo} to="/">
            <div>WG Blog</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained" style={{border: '1px solid white', borderRadius: '1px', backgroundColor: '#cbb1b8'}}>Написать статью</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" style={{border: '1px solid white', borderRadius: '1px', backgroundColor: '#b1b8cb'}}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined" style={{border: '1px solid white', borderRadius: '1px', backgroundColor: '#cbb1b8', color: 'white'}}>Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained" style={{border: '1px solid white', borderRadius: '1px', backgroundColor: '#b1b8cb'}}>Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

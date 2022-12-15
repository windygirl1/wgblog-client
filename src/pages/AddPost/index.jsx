import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'
import SimpleMDE from 'react-simplemde-editor';
import { useSelector } from 'react-redux'
import { selectIsAuth } from "../../redux/slices/auth";
import { useNavigate, Navigate, useParams } from 'react-router-dom'
import axios from '../../axios'

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null)

  const isEditing = Boolean(id)

  const handleChangeFile = async (event) => {
    try {
      const formData= new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      const { data } = await axios.post('/upload', formData)
      setImageUrl(data.url)
    } catch (err) {
      console.warn(err)
      alert('Ошибка при загрузке файла.')
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      const fields = {
        title,
        imageUrl,
        tags,
        text
      }
      const { data } = isEditing 
      ? await axios.patch(`/posts/${id}`, fields)
      : await axios.post('/posts', fields)
      const _id =  isEditing ? id : data._id
      navigate(`/posts/${_id}`)
    } catch (err) {
      console.warn(err)
      alert('Ошибка при создании статьи.')
    }
  }

  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`)
      .then( ({ data }) => {
        setTitle(data.title)
        setText(data.text)
        setImageUrl(data.imageUrl)
        setTags(data.tags.join(','))
      })
      .catch ( (err) => {
        console.warn(err)
        alert('Ошибка при получении статьи.')
      })
    }
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/'/>
  }

  return (
    <Paper style={{ padding: 30, backgroundColor: '#b1b8cb', borderRadius: '1px' }} >
      <Button style={{border: '1px solid white', borderRadius: '1px', backgroundColor: 'rgb(203, 177, 184)', color: 'white'}} onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile}  hidden/>
      {imageUrl && (
        <>
        <Button variant="contained" style={{border: '1px solid white', borderRadius: '1px', marginLeft: '10px', backgroundColor: '#b1b8cb'}} onClick={onClickRemoveImage}>
          Удалить
        </Button>
        <img className={styles.image} style={{width: '100%'}} src={`http://localhost:3333${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        style={{backgroundColor: '#b1b8cb', borderRadius: '1px', border: '1px solid white'}}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      {/* <TextField 
        classes={{ root: styles.tags }} 

        variant="standard" 
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)} 
        fullWidth /> */}
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} style={{background: '#b1b8cb'}}/>
      <div className={styles.buttons} style={{backgroundColor: '#b1b8cb', borderRadius: '1px'}}>
        <Button style={{border: '1px solid white', borderRadius: '1px', backgroundColor: 'rgb(203, 177, 184)', color: 'white'}} onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Cохранить' : 'Опубликовать'}
        </Button>
        <Link to="/">
          <Button style={{color: 'white'}} size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};

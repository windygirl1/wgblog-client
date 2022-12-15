import React from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { fetchRemovePost } from '../../redux/slices/posts';

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch()
  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = () => {
    if (window.confirm('Вы уверены, что хотите удалить статью?')) {
      dispatch(fetchRemovePost(id))
    }
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}  style={{backgroundColor: '#b1b8cb', borderRadius: '1px', wordBreak: 'break-all', color: 'white'}}>
      {isEditable && (
        <div className={styles.editButtons} style={{borderRadius: '1px', backgroundColor: '#ffffff00'}}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary" style={{backgroundColor: 'rgb(203, 177, 184)', border: '1px solid white'}}>
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary" style={{backgroundColor: '#b1b8cb', border: '1px solid white'}}>
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper} >
        <div style={{color: 'white', wordBreak: 'break-word', border: '1px solid white', width: '70%', backgroundColor: 'rgb(203, 177, 184)'}}>
        <UserInfo {...user} additionalText={createdAt.replace(/[a-zа-яё]/gi, '/').slice(0, 16)} />
        </div>
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })} >
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          {/* <ul className={styles.tags}>
            {tags.map((name) => (
              <li key={name}>
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul> */}
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon style={{color: 'white'}}/>
              <span style={{color: 'white'}}>{viewsCount}</span>
            </li>
            {/* <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

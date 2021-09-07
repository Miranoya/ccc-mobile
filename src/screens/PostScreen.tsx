import React, { useState } from "react";
import { useForm, useFormState, SubmitErrorHandler} from "react-hook-form";
import imageCompression from 'browser-image-compression';
import axios from 'axios';
/* material ui */
import { Box, Container, Button, TextField } from '@material-ui/core';
/* components */
import PhotosUpload from "../components/PhotosUpload";
/* styles */
import styles from "../styles/PostScreen.module.css";
/* conifg */
import { config } from "../config/Config";

type Inputs = {
  title: string;
  description: string;
}

const PostScreen: React.FC = () => {

  /* useFormを呼び出して使いたいメソッド */
  const { register, formState: {errors}, handleSubmit } = useForm<Inputs>();

  /* useState */
  const [photos, setPhotos] = useState<File[]>([]);
  const [values, setValues] = useState({
    title: '',
    description: ''
  });
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  //const [errors, setErrors] = useState({});

  /* 入力があったときのイベントハンドラ */
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    }); 
  };

  /* Geolocation API に関する処理 */
  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setPosition({ latitude, longitude });
    })
  };

  /* Submitのイベントハンドラ */
  const handleOnSubmit = async (data: Inputs) => {
    const { title, description } = data;
    if (
      title === "" &&
      photos.length === 0
    ) {
      /* titleとphotoが空なら送信しない */
      window.confirm("入力されていない項目があります");
      return;
    }

    /* 位置情報が取得できるか判定する */
    if( navigator.geolocation ){
      // 現在位置を取得できる場合の処理
      /* 位置情報をセットする */
      getCurrentPosition();
      } else {
      // 現在位置を取得できない場合の処理
      window.confirm("位置情報が取得できません");
      return;
      }

    /* formDataに変換する */
    const formData = new FormData()
    formData.append("title", title);
    formData.append("detail", description);
    /* 位置情報をformDataに追加する */
    formData.append("lat", String(position.latitude));
    formData.append("lng", String(position.longitude));

    /* imageCompressionのoption */
    const compressOption = {
      maxSizeMB: 3,
    }

    /* imageCompression function */
    const compressedPhotoData = await Promise.all(
      photos.map(async (photo) => {
        return {
          blob: await imageCompression(photo, compressOption),
          name: photo.name,
        };
      })
    );

    /* formData(photo)初期化 */
    formData.append("sub_image_1", '');
    formData.append("sub_image_2", '');
    formData.append("sub_image_3", '');
    formData.append("thumbnail", '');

    /* サムネイルを追加 */
    formData.set("thumbnail", compressedPhotoData[0].blob);

    /* formDataにphotoを追加 */
    for (let i = 1; i < compressedPhotoData.length; i++) {
      const key: string = "sub_image_" + String(i);
      formData.set(key, compressedPhotoData[i].blob);
    }

    console.log(...formData.entries())

    /* axiosによるPOST処理 */
    //const url: string = "https://httpbin.org/post";
    const url: string= config.spotPostUrl;
    const header = { headers: {
      'Content-Type': 'multipart/form-data',
       }};
    axios.post(url, formData, header)
         .then(res => {
           console.log("Sucusess");
           console.log(res.data);
         }).catch(err => {
           console.log("Failed");
           console.log(err.data);
         })
  }

  return (
    <div className={styles.formContent}>
      <div>
        <PhotosUpload name="photos" photos={photos} setPhotos={setPhotos} />
      </div>


      <div className={styles.formArea}>
        
        <form className={styles.form} onSubmit={handleSubmit(handleOnSubmit)}>

          <div className={styles.titleInputArea}>
            <label htmlFor="title" className={styles.formLabel}>タイトル
              <span className={styles.formLabelSpan}> *必須</span>
            </label>
            <TextField 
              type="text"  
              {...register("title", {required: true, maxLength: 12})}
              fullWidth
              className={styles.formInputTitle} 
              label="最大12文字以内"
              onChange={handleChange}
              error = {Boolean(errors.title)}
              helperText={errors.title && "タイトルを12文字以内で入力してください"}
            />
          </div>
          <div className={styles.descriptionInputArea}>
            <label htmlFor="description" className={styles.formLabel}>詳細
              <span className={styles.formLabelSpan}> *任意</span>
            </label>
            <TextField 
              type="text"  
              {...register("description")}
              fullWidth
              className={styles.formInputDescription} 
              label="危険箇所の状況を教えてください"
              onChange={handleChange}
            />
          </div>
          <div className={styles.buttonArea}>  
            <Button type="submit" variant="contained" color="primary" className={styles.bottomButton}>
              送信する
            </Button>
            <Button  variant="contained" color="primary" className={styles.bottomButton}>
              クリア
            </Button>
          </div>
        </form>
        
      </div>
    </div>

  )
}

export default PostScreen
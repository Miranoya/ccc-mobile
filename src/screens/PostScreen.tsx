import React, { useState } from "react";
import { useForm, useFormState, SubmitErrorHandler} from "react-hook-form";
import imageCompression from 'browser-image-compression';
import axios from 'axios';
/* material ui */
import { Box, Container, Button } from '@material-ui/core';
/* components */
import PhotosUpload from "../components/PhotosUpload";
/* styles */
import styles from "../styles/PostScreen.module.css";
import { isConstructorDeclaration } from "typescript";

type Inputs = {
  title: string;
  description: string;
}

const PostScreen: React.FC = () => {

  /* useFormを呼び出して使いたいメソッド */
  const { register, handleSubmit, formState } = useForm<Inputs>();

  /* useState */
  const [photos, setPhotos] = useState<File[]>([]);
  const [values, setValues] = useState({
    title: '',
    description: ''
  });
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [errors, setErrors] = useState({});

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
    formData.append("description", description);
    /* 位置情報をformDataに追加する */
    formData.append("latitude", String(position.latitude));
    formData.append("longitude", String(position.longitude));

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

    /* formDataにphotoを追加 */
    compressedPhotoData.forEach((photoData) => {
      formData.append("photo", photoData.blob, photoData.name);
    });

    console.log(...formData.entries())

    /* axiosによるPOST処理 */
    const url: string = "https://httpbin.org/post";
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

  const onTest = () => {
    console.log("test")
  }

  return (
    <div className={styles.formContent}>
      <div>
        <PhotosUpload name="photos" photos={photos} setPhotos={setPhotos} />
      </div>


      <div className={styles.boxTextInput}>
        
        <form className={styles.form} onSubmit={handleSubmit(handleOnSubmit)}>

          <div className={styles.formInputs}>
            <label htmlFor="title" className={styles.formLabel}>タイトル
              <span className={styles.formLabelSpan}> *必須</span>
            </label>
            <input 
              type="text"  
              {...register("title", {required: true})}
              className={styles.formInputTitle} 
              placeholder="タイトルを入力してください"
              onChange={handleChange}
            />
          </div>
          <div className={styles.formInputs}>
            <label htmlFor="description" className={styles.formLabel}>説明
              <span className={styles.formLabelSpan}> *任意</span>
            </label>
            <textarea 
              {...register("description")}
              className={styles.formInputDescription} 
              placeholder="概要を入力してください"
              onChange={handleChange}
            />
          </div>

          <Button type="submit" variant="contained" color="primary" className={styles.submitButton}>
            送信する
          </Button>
        </form>
        
      </div>
    </div>

  )
}

export default PostScreen
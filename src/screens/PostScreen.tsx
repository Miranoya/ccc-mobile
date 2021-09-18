import React, { useState } from "react";
import { useForm } from "react-hook-form";
import imageCompression from 'browser-image-compression';
import axios from 'axios';
/* material ui */
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
/* components */
import PhotosUpload from "../components/PhotosUpload";
/* styles */
import styles from "../styles/PostScreen.module.css";
/* conifg */
import { config } from "../config/Config";
/* React Loading */
import ReactLoading from "react-loading";

type Inputs = {
  title: string;
  description: string;
}

const PostScreen: React.FC = () => {

  /* useFormを呼び出して使いたいメソッド */
  const { register, formState: { errors }, handleSubmit } = useForm<Inputs>();

  /* useState */
  const [photos, setPhotos] = useState<File[]>([]);
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [initTitle, setInitTitle] = useState<string>("");
  const [initDescription, setInitDescription] = useState<string>("");
  const [isResultOpen, setIsResultOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPostSuccessful, setIsPostSuccessful] = useState<boolean>(false);

  /* Loading Dialogをクローズする処理 */
  const handleLoadingDialogClose = () => {
    setLoading(false);
  }

  /* Result Dialogをクローズする処理 */
  const handleResultDialogClose = () => {
    setIsResultOpen(false);
  }

  /* clearボタンの処理 */
  const onClear = () => {
    if (window.confirm("入力を破棄しますか?")) {
      setInitTitle("");
      setInitDescription("");
      setPhotos([]);
    }
  }

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
      title === "" ||
      photos.length === 0
    ) {
      /* titleとphotoが空なら送信しない */
      window.confirm("1枚以上写真を添付してください");
      return;
    }

    /* 位置情報が取得できるか判定する */
    if (navigator.geolocation) {
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
    formData.set("thumbnail", new File([compressedPhotoData[0].blob], compressedPhotoData[0].name));

    /* formDataにphotoを追加 */
    for (let i = 1; i < compressedPhotoData.length; i++) {
      const key: string = "sub_image_" + String(i);
      formData.set(key, new File([compressedPhotoData[i].blob], compressedPhotoData[i].name));
    }

    console.log(...formData.entries())

    /* Loading Dialogをオープン */
    setLoading(true);

    /* axiosによるPOST処理 */
    //const url: string = "https://httpbin.org/post";
    const url: string = config.spotPostUrl;
    const header = {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    };
    axios.post(url, formData, header)
      .then(res => {
        console.log("Success");
        console.log(res.data);
        /* Loading Dialog */
        handleLoadingDialogClose();
        /* Result Dialog */
        setIsPostSuccessful(true);
        setIsResultOpen(true);
      }).catch(err => {
        console.log("Failed");
        console.log(err.response.data);
        /* Loading Dialog */
        handleLoadingDialogClose();
        /* Result Dialog */
        setIsPostSuccessful(false);
        setIsResultOpen(true);
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
              {...register("title", { required: true, maxLength: 12 })}
              fullWidth
              className={styles.formInputTitle}
              label="最大12文字以内"
              error={Boolean(errors.title)}
              helperText={errors.title && "タイトルを12文字以内で入力してください"}
              onChange={(event) => setInitTitle(event.target.value)}
              value={initTitle}
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
              onChange={(event) => setInitDescription(event.target.value)}
              value={initDescription}
            />
          </div>
          <div className={styles.buttonArea}>
            <Button type="submit" variant="contained" color="primary" className={styles.bottomButton}>
              <span className={styles.buttonLabel}>送信</span>
              <SendIcon className={styles.buttonIcon} fontSize="small" />
            </Button>
            <Button onClick={onClear} variant="contained" color="primary" className={styles.bottomButton} >
              <span>クリア</span>
              <ClearIcon className={styles.buttonIcon} fontSize="small" />
            </Button>
          </div>
        </form>

        {/* Loading Dialog */}
        <Dialog
          open={loading}
          onClose={handleLoadingDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-icon"
        >
          <DialogTitle id="alert-dialog-title">{"送信中"}</DialogTitle>
          <DialogContent id="alert-dialog-icon">
            <ReactLoading type="bars" color="#2adf88" className={styles.loadingIcon}></ReactLoading>
          </DialogContent>
        </Dialog>

        {/* Result Dialog */}
        <Dialog
          open={isResultOpen}
          onClose={handleResultDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-icon"
        >
          {isPostSuccessful && (
            <DialogContent id="alert-dialog-icon">
              <div>送信されました</div>
            </DialogContent>
          )}
          {!isPostSuccessful && (
            <DialogContent id="alert-dialog-icon">
              <div>送信に失敗しました</div>
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={handleResultDialogClose}>
              <span className={styles.dialogActionLabel}>OK</span>
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </div>

  )
}

export default PostScreen
import React, {useState} from "react";
/* styles */
import styles from '../styles/PhotosUpload.module.css';
/* material ui */
import { Button } from '@material-ui/core';

interface PhotosUploadProps {
  name: string,
  componentRef?: (instance: HTMLInputElement | null) => void,
  photos: File[],
  setPhotos: (file: File[]) => void;
}

const PhotosUpload: React.FC<PhotosUploadProps> = ({name, photos, componentRef, setPhotos}) => {

  /* error処理のstate */
  const [isSameError, setIsSameError] = useState(false)
  const [isNumberError, setIsNumberError] = useState(false)
  const [isFileTypeError, setIsTypeError] = useState(false)

  /* error処理のリセット */
  const resetErrors = () => {
    setIsSameError(false);
    setIsNumberError(false);
    setIsTypeError(false);
  }

  /* 写真アップロードイベントハンドル */
  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) {
      return
    }
    const files = Object.values(event.target.files).concat()

    /* errorリセット */
    event.target.value = ""
    resetErrors();

    /* 写真選択 */
    const pickedPhotos = files.filter((file) => {
      if(
        ![
          "image/jpeg",
          "image/png",
          "image/bmp"
        ].includes(file.type)
      ) {
        setIsTypeError(true);
        return false;
      }

      const existsSameSize = photos.some((photo) => photo.size === file.size);
      if (existsSameSize) {
        setIsSameError(true);
        return false;
      }

      return true;
    });

    /*　写真が選択されていない */
    if (pickedPhotos.length === 0) {
      return
    }
    
    /*　追加選択 */
    const concatPhotos = photos.concat(pickedPhotos);
    if (concatPhotos.length >= 4) {
      setIsNumberError(true);
    }
    setPhotos(concatPhotos.slice(0, 3));
  };

  /* 写真削除 */
  const handleCancel = (photoIndex: number) => {
    if (window.confirm("選択した画像を削除してもよろしいですか?")) {
      resetErrors();
      const modifyPhotos = photos.concat();
      modifyPhotos.splice(photoIndex, 1);
      setPhotos(modifyPhotos);
    }
  }

  return (
    <div className={styles.photosUploader}>
      <div>
        {[...Array(3)].map((_:number, index: number) => 
        index < photos.length ? (
          <span className={styles.photoInline} key={index}>
              <Button type="button" key={index} onClick={() => handleCancel(index)}>
                <div className={styles.preview}>
                  <img
                    src={URL.createObjectURL(photos[index])}
                    alt=""
                    className={styles.previewImg}
                  />
                </div>
              </Button>
          </span>
        ) : (
          <span className={styles.photoInline} key={index}>
              <Button type="button" key={index}>
                <div className={styles.preview}>
                  <img
                    src="https://www.shoshinsha-design.com/wp-content/uploads/2020/05/noimage-760x460.png"
                    alt=""
                    className={styles.previewImg}
                  />
                </div>
              </Button>
          </span>
        )
        )}
      </div>

      <div>
        {isSameError && (
          <div className={styles.errorLabel}>既に選択された画像と同じものは表示されません</div>
        )}
        {isNumberError && (
          <div className={styles.errorLabel}>添付できる画像は3枚までです</div>
        )}
        {isFileTypeError && (
          <div className={styles.errorLabel}>添付できるのは画像ファイルのみです</div>
        )}
      </div>

      <div className={styles.addButton}>
        <label htmlFor={name} className={styles.label}>
          写真を追加
            <input
              type="file"
              name={name}
              id={name}
              ref={componentRef} 
              accept="image/*" 
              onChange={handleFile}
              multiple
            />
        </label>
       </div>
    </div>
  );
};

export default PhotosUpload;

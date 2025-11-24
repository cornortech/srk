import axios, { AxiosProgressEvent } from "axios";
import { v4 as uuidv4 } from "uuid";

const cloudName = "doia6qktn";
const presetKeyForImg = "srkImg";
const presetKeyForVideos = "srkVideo";

interface CallBack {
  (progress: number, url: string): void;
}
interface ReturnType {
  url: string;
  status: number;
}

const useUploadMedia = () => {
  const upload = async (
    file: File,
    mediaType: "image" | "video",
    cb?: CallBack
  ): Promise<ReturnType> => {
    const formData = new FormData();

    // Generate unique filename
    // const fileExtension = file.name.split(".").pop();
    const baseName = file.name.replace(/\.[^/.]+$/, ""); // remove extension
    // const uniqueFileName = `${baseName}_${uuidv4()}.${fileExtension}`;
    const uniqueFileName = `${baseName
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "")}_${uuidv4()}`;

    formData.append("file", file);
    formData.append("public_id", uniqueFileName); // ensure uniqueness

    let presetKey = presetKeyForImg;
    if (mediaType === "image") {
      presetKey = presetKeyForImg;
    } else if (mediaType === "video") {
      presetKey = presetKeyForVideos;
    }
    formData.append("upload_preset", presetKey);
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/${mediaType}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (e: AxiosProgressEvent) => {
            if (e.total) {
              const loaded = Math.round((100 * e?.loaded) / e.total);
              if (cb) cb(loaded, "");
            }
          },
        }
      );
      if (cb) {
        cb(100, res?.data?.secure_url);
      }
      return { url: res?.data?.secure_url, status: 200 };
    } catch (error) {
      console.log(error);
      return { url: "", status: 500 };
    }
  };

  return { upload };
};
export default useUploadMedia;

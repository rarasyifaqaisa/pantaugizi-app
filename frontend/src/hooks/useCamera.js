import { useState, useRef } from "react";

export function useCamera() {
  const videoRef   = useRef(null);
  const [stream, setStream]     = useState(null);
  const [error,  setError]      = useState(null);
  const [preview, setPreview]   = useState(null); // base64 foto

  const startCamera = async () => {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 }
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      setError("Izin kamera ditolak. Aktifkan di Pengaturan Safari → PantauGizi.");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return null;
    const canvas = document.createElement("canvas");
    canvas.width  = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setPreview(dataUrl);
    stopCamera();
    return dataUrl.split(",")[1]; // return base64 only
  };

  const handleFileUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setPreview(dataUrl);           // simpan full dataUrl untuk preview <img>
        resolve(dataUrl.split(",")[1]); // return base64 only untuk AI
      };
      reader.readAsDataURL(file);
    });
  };

  const reset = () => {
    setPreview(null);
    stopCamera();
  };

  return { videoRef, stream, error, preview, startCamera, stopCamera, capturePhoto, handleFileUpload, reset };
}
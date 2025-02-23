import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const BarcodeScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .decodeFromVideoDevice(null, videoRef.current!, (result, err) => {
        if (result) {
          setScannedCode(result.getText());
          codeReader.reset(); 
        }
      })
      .catch((err) => console.error("Error al iniciar el escáner:", err));

    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div>
      <h2>Escáner de Códigos de Barras</h2>
      <video ref={videoRef} style={{ width: "100%", height: "400px", border: "1px solid black" }} />
      {scannedCode && <p>Código detectado: {scannedCode}</p>}
    </div>
  );
};

export default BarcodeScanner;

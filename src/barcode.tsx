import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const BarcodeScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [codeReader, setCodeReader] = useState<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    setCodeReader(reader);
    startScanning(reader);

    return () => {
      reader.reset();
    };
  }, []);

  const startScanning = (reader: BrowserMultiFormatReader) => {
    setScannedCode(null); 

    reader
      .decodeFromVideoDevice(null, videoRef.current!, (result, err) => {
        if (result) {
          setScannedCode(result.getText());
          reader.reset();
        }
      })
      .catch((err) => console.error("Error al iniciar el escáner:", err));
  };

  const handleRescan = () => {
    if (codeReader) {
      startScanning(codeReader); 
    }
  };

  return (
    <div>
      <h2>Escáner de Códigos de Barras</h2>
      <video ref={videoRef} style={{ width: "100%", height: "400px", border: "1px solid black" }} />
      
      {scannedCode ? (
        <>
          <p>Código detectado: <strong>{scannedCode}</strong></p>
          <button onClick={handleRescan} style={{ padding: "10px", marginTop: "10px", cursor: "pointer" }}>
            Volver a escanear
          </button>
        </>
      ) : (
        <p>Escanea un código de barras con la cámara.</p>
      )}
    </div>
  );
};

export default BarcodeScanner;

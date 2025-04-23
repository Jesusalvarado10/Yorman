import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import logoBECO from "./image/CENTROBECO.jpg";
import ProductPriceModal from "./productPriceModal";

const BarcodeScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [codeReader, setCodeReader] = useState<BrowserMultiFormatReader | null>(
    null
  );
  const [isScanning, setIsScanning] = useState<boolean>(true);

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
    setIsScanning(true);
    reader
      .decodeFromVideoDevice(null, videoRef.current!, (result, err) => {
        if (result) {
          setScannedCode(result.getText());
          setIsScanning(false);
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
    <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <img
        src={logoBECO}
        alt="Logo BECO"
        style={{
          maxWidth: "300px",
          height: "auto",
          display: "block",
          margin: "20px auto",
        }}
      />
      
      {isScanning && (
        <>
          <h2 style={{ marginBottom: "20px" }}>Verificador de precios</h2>
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "400px",
              border: "1px solid black",
              margin: "20px auto",
              borderRadius: "8px",
            }}
          />
          <p style={{ marginTop: "10px" }}>Escanea un código de barras con la cámara.</p>
        </>
      )}

      {scannedCode && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontWeight: "bold", fontSize: "18px" }}>
            Código detectado: <span style={{ color: "#3b82f6" }}>{scannedCode}</span>
          </p>
          <div style={{ margin: "20px 0" }}>
            <ProductPriceModal barcode={scannedCode} />
          </div>
          <button
            onClick={handleRescan}
            style={{
              padding: "10px 20px",
              marginTop: "20px",
              cursor: "pointer",
              backgroundColor: "#4b5563",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              display: "block",
              margin: "0 auto",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#374151"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
          >
            Volver a escanear
          </button>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
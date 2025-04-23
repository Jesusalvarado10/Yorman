import { useState, useEffect } from 'react';

// 3. Definiendo las interfaces:
//    - Necesitamos una interfaz para los datos del producto
//    - Incluiremos todos los campos del endpoint
//    - Hacemos los campos opcionales que pueden ser null

interface ProductPriceData {
  regularprice: number;
  origintax: number;
  functionalPrice: number | null;
  commercialPrice: number;
  finalFullFunctionalPrice: number;
  ivaFunctionalAmount: number | null;
  finalFullPriceCommercial: number | null;
  finalFullPricePromotionCommercial: number;
  finalFullPricePromotionFunctional: number;
}

// 4. Implementando el componente:
//    - Usaremos estados para modal, datos, carga y errores
//    - Implementaremos estilos inline con style
//    - Manejaremos la carga de datos con useEffect

const ProductPriceModal = (barcode: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ProductPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8129/api/verify-product/by-code-product/${barcode.barcode}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos del producto');
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    } else {
      setData(null);
      setError(null);
    }
  }, [isOpen]);

  return (
    <div style={{ padding: '16px' }}>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
      >
        Ver Precios
      </button>

      <div 
        style={{
          display: isOpen ? 'flex' : 'none',
          position: 'fixed',
          inset: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '50'
        }}
      >
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            maxWidth: '42rem',
            width: '100%',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              Detalles de Precios
            </h2>
          </div>

          <div style={{ padding: '16px' }}>
            {isLoading ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '32px' 
              }}>
                <div style={{ 
                  border: '4px solid #3b82f6', 
                  borderTopColor: 'transparent', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite' 
                }} />
              </div>
            ) : error ? (
              <div style={{ padding: '16px', color: '#ef4444' }}>
                {error}
              </div>
            ) : data ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  padding: '16px' 
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                    Precios Base
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p>Precio Regular: ${data.regularprice.toFixed(2)}</p>
                    <p>Impuesto Original: ${data.origintax.toFixed(2)}%</p>
                    <p>Precio Comercial: ${data.commercialPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  padding: '16px' 
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                    Precios Funcionales
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p>Precio Funcional: {data.functionalPrice !== null ? `$${data.functionalPrice.toFixed(2)}` : 'No disponible'}</p>
                    <p>Precio Total Funcional: ${data.finalFullFunctionalPrice.toFixed(2)}</p>
                    <p>Precio Promocional Funcional: ${data.finalFullPricePromotionFunctional.toFixed(2)}</p>
                  </div>
                </div>

                <div style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  padding: '16px' 
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                    Precios Comerciales
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p>Precio Total Comercial: {data.finalFullPriceCommercial !== null ? `$${data.finalFullPriceCommercial.toFixed(2)}` : 'No disponible'}</p>
                    <p>Precio Promocional Comercial: ${data.finalFullPricePromotionCommercial.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPriceModal;
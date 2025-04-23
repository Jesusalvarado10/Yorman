// 1. Analizando los requisitos:
//    - Necesitamos un modal para mostrar precios de productos
//    - Debe ser sin librerías externas
//    - Debe manejar estados de carga y errores
//    - Debe mostrar datos de una API
//    - Debe ser TypeScript
// 
// 2. Planificando la estructura:
//    - Usaremos useState para manejar estados
//    - Implementaremos una interfaz para los datos
//    - Crearemos estilos inline para el modal
//    - Manejaremos errores y carga

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
//    - Implementaremos estilos inline para el modal
//    - Manejaremos la carga de datos con useEffect

const ProductPriceModal = (barcode: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ProductPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    console.log (barcode.bar)
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

// 5. Implementando el JSX:
//    - Crearemos un modal con estilos inline
//    - Usaremos CSS modules para los estilos
//    - Implementaremos una estructura clara para los precios

  return (
    <div className="p-4">
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Ver Precios
      </button>

      <div 
        className={`
          ${isOpen ? 'fixed inset-0' : 'hidden'}
          bg-black/50 flex items-center justify-center
          z-50
        `}
      >
        <div 
          className={`
            bg-white rounded-lg shadow-lg
            max-w-2xl w-full
            overflow-hidden
          `}
        >
          <div className="p-4 border-b">
            <h2 className="text-2xl font-bold">
              Detalles de Precios
            </h2>
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="border-4 border-blue-500 border-t-transparent w-8 h-8 rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="p-4 text-red-500">
                {error}
              </div>
            ) : data ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Precios Base
                  </h3>
                  <div className="space-y-2">
                    <p>Precio Regular: ${data.regularprice.toFixed(2)}</p>
                    <p>Impuesto Original: ${data.origintax.toFixed(2)}%</p>
                    <p>Precio Comercial: ${data.commercialPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Precios Funcionales
                  </h3>
                  <div className="space-y-2">
                    <p>Precio Funcional: {data.functionalPrice !== null ? `$${data.functionalPrice.toFixed(2)}` : 'No disponible'}</p>
                    <p>Precio Total Funcional: ${data.finalFullFunctionalPrice.toFixed(2)}</p>
                    <p>Precio Promocional Funcional: ${data.finalFullPricePromotionFunctional.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Precios Comerciales
                  </h3>
                  <div className="space-y-2">
                    <p>Precio Total Comercial: {data.finalFullPriceCommercial !== null ? `$${data.finalFullPriceCommercial.toFixed(2)}` : 'No disponible'}</p>
                    <p>Precio Promocional Comercial: ${data.finalFullPricePromotionCommercial.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPriceModal;
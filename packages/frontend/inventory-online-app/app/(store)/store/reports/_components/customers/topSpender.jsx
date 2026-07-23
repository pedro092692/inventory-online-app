'use client'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts'


export default function TopSpendersReport({ data = [] }) {
  // Colores para las barras (puedes usar los colores de Nexastock)
  const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

  // Formateador de moneda
  const formatCurrency = (value) => `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Custom Tooltip para la gráfica
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold capitalize text-gray-800">{payload[0].payload.name}</p>
          <p className="text-indigo-600 font-bold">
            Total: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Top Clientes por Gasto</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LADO IZQUIERDO: GRÁFICA */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" tickFormatter={(tick) => `$${tick}`} />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12, textTransform: 'capitalize' }}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
              <Bar dataKey="total_spent" radius={[0, 4, 4, 0]} barSize={30}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LADO DERECHO: TABLA DE DETALLES */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-t-lg">
              <tr>
                <th scope="col" className="px-4 py-3 rounded-tl-lg">Cliente</th>
                <th scope="col" className="px-4 py-3">Total Gastado</th>
                <th scope="col" className="px-4 py-3">Teléfono</th>
                <th scope="col" className="px-4 py-3 rounded-tr-lg">Última Compra</th>
              </tr>
            </thead>
            <tbody>
              {data.map((customer, index) => (
                <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 capitalize">
                    {index + 1}. {customer.name}
                  </td>
                  <td className="px-4 py-4 font-bold text-indigo-600">
                    {formatCurrency(customer.total_spent)}
                  </td>
                  <td className="px-4 py-4">
                    {customer.phone}
                  </td>
                  <td className="px-4 py-4">
                    {/* Nota: Corregí el typo 'last_purcahse' a 'last_purchase' si lo arreglas en BD, si no, déjalo como viene en tu JSON */}
                    {customer.last_purcahse || customer.last_purchase}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
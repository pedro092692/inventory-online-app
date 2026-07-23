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
const formatCurrency = (value) => 
    `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const CustomTooltip = ({ active, payload }) => {

    if (!active || !payload?.length) return null

    const customer = payload[0].payload

    return (

        <div className="rounded-xl bg-white shadow-lg border border-slate-200 p-4">

            <p className="font-semibold text-slate-800">
                {customer.name}
            </p>

            <p className="text-2xl font-bold text-[#274C86] mt-1">
                {formatCurrency(customer.total_spent)}
            </p>

            <div className="mt-3 text-sm text-slate-500">

                <div>{customer.phone}</div>

                <div>
                    Última compra {customer.last_purchase}
                </div>

            </div>

        </div>

    )

}
  
function Card({title,value}){

return(

<div className="rounded-xl border border-slate-200 bg-white p-5">

<p className="text-sm text-slate-500">
{title}
</p>

<h2 className="mt-2 text-3xl font-bold text-slate-800">
{value}
</h2>

</div>

)

}
  return (
    <>
    <div className="grid grid-cols-4 gap-5 mb-8">

<Card
title="Clientes"
value="124"
/>

<Card
title="Ventas"
value="$18,240"
/>

<Card
title="Ticket Promedio"
value="$52"
/>

<Card
title="Compras"
value="654"
/>

</div>
    <ResponsiveContainer width="100%" height={420}>
      <BarChart
          data={data}
          layout="vertical"
          margin={{
              top: 0,
              right: 20,
              left: 10,
              bottom: 0
          }}
      >
      <XAxis hide type="number" />

      <YAxis
        width={120}
        type="category"
        dataKey="name"
        tick={{
            fill: "#5B6472",
            fontSize: 13
        }}
      />

      <Tooltip content={<CustomTooltip />} />

        <Bar
            dataKey="total_spent"
            radius={8}
            barSize={18}
            fill="#274C86"
        />
      </BarChart>
      
    </ResponsiveContainer>
    <div className="space-y-3">

{
data.map((customer,index)=>(
<div
key={customer.id}
className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:shadow transition"
>

<div>

<div className="font-semibold text-slate-800">

#{index+1} {customer.name}

</div>

<div className="text-sm text-slate-500">

{customer.phone}

</div>

</div>

<div className="text-right">

<div className="font-bold text-[#274C86]">

{formatCurrency(customer.total_spent)}

</div>

<div className="text-xs text-slate-500">

{customer.last_purchase}

</div>

</div>

</div>
))
}

</div>
    </>
  )
}
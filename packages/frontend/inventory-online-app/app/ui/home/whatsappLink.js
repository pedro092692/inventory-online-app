// Número de WhatsApp del negocio, leído de la variable de entorno
// NEXT_PUBLIC_WHATSAPP_NUMBER (ver .env.local) para poder cambiarlo sin
// tocar código. Se limpia a solo dígitos porque así lo requiere wa.me.
const RAW_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

export const WHATSAPP_NUMBER = RAW_NUMBER.replace(/[^0-9]/g, '')

export const WHATSAPP_URL = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=Hola quiero mas información sobre NexaStock.` : '#'

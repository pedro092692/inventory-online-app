import crypto from 'crypto'

export default function hasPassword(password, salt) {
    if(typeof password !== 'string' || typeof salt !== 'string') {
        throw new Error('Invalid Password or salt')
    }

    const secretSalt = process.env.PIN_SECRET_SALT 

    return crypto
        .createHmac('sha256', secretSalt + salt)
        .update(password)
        .digest('hex')
}

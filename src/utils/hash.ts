import bcrypt from 'bcrypt'
import crypto from 'crypto'

export const hashPassword = (password:string)=> bcrypt.hash(password,10)
export const comparePassword = async (password:string,hash:string)=> await bcrypt.compare(password,hash)


export const hashOtp = (otp:string)=> crypto.createHash('sha256').update(otp).digest('hex')
export const compareOtp = (otp:string,hash:string)=> hashOtp(otp) === hash
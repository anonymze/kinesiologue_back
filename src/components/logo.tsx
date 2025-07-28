import logo from '@/assets/images/logo.png'
import Image from 'next/image'

export default function Logo() {
  return <Image src={logo} width={150} height={150} alt="Logo" />
}

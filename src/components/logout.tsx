import { LogOutIcon } from 'lucide-react'
import Link from 'next/link'

export default function Logout() {
  return (
    <Link id="logout-button" href="/admin/logout">
      <LogOutIcon size={25} />
      <span>Se déconnecter</span>
    </Link>
  )
}

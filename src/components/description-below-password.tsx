'use client'

import React from 'react'

export default function DescriptionBelowPassword() {
  if (typeof window === 'undefined') return null

  const divDescription = document.createElement('div')
  divDescription.className = 'password-description'
  divDescription.style.marginTop = '0.5rem'
  divDescription.style.fontSize = '1rem'
  divDescription.style.color = '#666'
  divDescription.textContent =
    'Le mot de passe doit contenir au moins 10 caractères, un chiffre et une lettre.'

  React.useLayoutEffect(() => {
    const formElement = document.querySelector('form')
    const authFields = formElement?.querySelector('.auth-fields')
    const formType = formElement?.getAttribute('method') === 'POST' ? 'POST' : 'PATCH'

    if (!authFields || !formType) return

    let labelFieldPassword = authFields?.querySelector('#field-password')

    const addDescription = () => {
      if (!labelFieldPassword) return
      labelFieldPassword.parentNode?.insertBefore(divDescription, labelFieldPassword.nextSibling)
    }

    // Initial attempt to add description
    addDescription()

    // Add description when password field becomes available
    const observer = new MutationObserver((mutations, obs) => {
      labelFieldPassword = authFields?.querySelector('#field-password')
      if (!labelFieldPassword) return
      obs.disconnect()
      addDescription()
    })

    observer.observe(authFields, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  // Component doesn't need to render anything visible
  return null
}

import { useState, useEffect } from 'react'

export function Message({ type = 'success', text, duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  const alertClass = type === 'success' ? 'alert-success' : 'alert-error'

  return (
    <div className={`alert mt-4 ${alertClass}`}>
      <span>{text}</span>
    </div>
  )
}

export function useMessage() {
  const [message, setMessage] = useState({ show: false, type: 'success', text: '' })

  const showMessage = (type, text) => {
    setMessage({ show: true, type, text })
  }

  const hideMessage = () => {
    setMessage({ ...message, show: false })
  }

  return { message, showMessage, hideMessage }
}

export default Message
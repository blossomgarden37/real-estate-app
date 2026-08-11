import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 未ログインの場合はログイン画面へリダイレクトするラッパー
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-screen">読み込み中...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

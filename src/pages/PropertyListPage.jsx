import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/properties'
import PropertyForm from '../components/PropertyForm'

// 物件一覧画面(Supabaseの properties テーブルとCRUD連携)
function PropertyListPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formMode, setFormMode] = useState(null) // null | 'create' | { editing: property }

  const loadProperties = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchProperties()
      setProperties(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const handleCreate = async (values) => {
    const created = await createProperty({ userId: user.id, ...values })
    setProperties([created, ...properties])
    setFormMode(null)
  }

  const handleUpdate = async (id, values) => {
    const updated = await updateProperty(id, values)
    setProperties(properties.map((p) => (p.id === id ? updated : p)))
    setFormMode(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('この物件を削除しますか?')) return
    await deleteProperty(id)
    setProperties(properties.filter((p) => p.id !== id))
  }

  return (
    <div className="property-page">
      <header className="property-header">
        <div>
          <h1>物件一覧</h1>
          <p className="property-user">{user?.email}</p>
        </div>
        <div className="property-header-actions">
          <button className="primary-button" onClick={() => setFormMode('create')}>
            物件を登録
          </button>
          <button className="logout-button" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      {formMode === 'create' && (
        <PropertyForm onSubmit={handleCreate} onCancel={() => setFormMode(null)} />
      )}
      {formMode?.editing && (
        <PropertyForm
          initialValues={{
            name: formMode.editing.name,
            rent: formMode.editing.rent,
            area: formMode.editing.area,
            layout: formMode.editing.layout,
          }}
          onSubmit={(values) => handleUpdate(formMode.editing.id, values)}
          onCancel={() => setFormMode(null)}
        />
      )}

      {loading && <p>読み込み中...</p>}
      {error && <p className="auth-error">{error}</p>}

      {!loading && !error && properties.length === 0 && (
        <p>登録されている物件はありません。「物件を登録」から追加してください。</p>
      )}

      <div className="property-list">
        {properties.map((property) => (
          <div className="property-card" key={property.id}>
            <h2 className="property-name">{property.name}</h2>
            <p className="property-rent">
              {property.rent.toLocaleString()}円 / 月
            </p>
            <p className="property-area">
              {property.area} ・ {property.layout}
            </p>
            <div className="property-card-actions">
              <button
                className="secondary-button"
                onClick={() => setFormMode({ editing: property })}
              >
                編集
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(property.id)}
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PropertyListPage

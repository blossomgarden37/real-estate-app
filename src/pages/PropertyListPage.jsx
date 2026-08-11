import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 物件一覧のダミーデータ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'グリーンヒルズ渋谷', rent: 128000, area: '東京都渋谷区' },
  { id: 2, name: 'サンライズ横浜', rent: 95000, area: '神奈川県横浜市' },
  { id: 3, name: 'パークサイド新宿', rent: 145000, area: '東京都新宿区' },
  { id: 4, name: 'リバーフロント大阪', rent: 87000, area: '大阪府大阪市' },
  { id: 5, name: 'メゾン福岡天神', rent: 76000, area: '福岡県福岡市' },
  { id: 6, name: 'ヒルサイド札幌', rent: 68000, area: '北海道札幌市' },
]

// 物件一覧画面
function PropertyListPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="property-page">
      <header className="property-header">
        <div>
          <h1>物件一覧</h1>
          <p className="property-user">{user?.email}</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          ログアウト
        </button>
      </header>

      <div className="property-list">
        {DUMMY_PROPERTIES.map((property) => (
          <div className="property-card" key={property.id}>
            <h2 className="property-name">{property.name}</h2>
            <p className="property-rent">
              {property.rent.toLocaleString()}円 / 月
            </p>
            <p className="property-area">{property.area}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PropertyListPage

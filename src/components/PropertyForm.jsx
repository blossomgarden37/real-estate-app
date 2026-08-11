import { useState } from 'react'

const EMPTY_FORM = { name: '', rent: '', area: '', layout: '' }

// 物件の新規登録・編集を行うフォーム。
// initialValuesを渡すと編集モード、渡さなければ新規登録モードになる。
function PropertyForm({ initialValues, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValues ?? EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await onSubmit({
        name: form.name,
        rent: Number(form.rent),
        area: form.area,
        layout: form.layout,
      })
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h2>{initialValues ? '物件を編集' : '物件を新規登録'}</h2>

      <label htmlFor="name">物件名</label>
      <input id="name" value={form.name} onChange={handleChange('name')} required />

      <label htmlFor="rent">家賃(円)</label>
      <input
        id="rent"
        type="number"
        min="0"
        value={form.rent}
        onChange={handleChange('rent')}
        required
      />

      <label htmlFor="area">エリア</label>
      <input id="area" value={form.area} onChange={handleChange('area')} required />

      <label htmlFor="layout">間取り</label>
      <input
        id="layout"
        placeholder="例: 1LDK"
        value={form.layout}
        onChange={handleChange('layout')}
        required
      />

      {error && <p className="auth-error">{error}</p>}

      <div className="property-form-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          キャンセル
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  )
}

export default PropertyForm

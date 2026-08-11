import { supabase } from './supabaseClient'

// 自分が登録した物件を一覧取得する(表示順は登録が新しい順)
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 物件を新規登録する。user_idはログイン中のユーザーIDを指定する
export async function createProperty({ userId, name, rent, area, layout }) {
  const { data, error } = await supabase
    .from('properties')
    .insert({ user_id: userId, name, rent, area, layout })
    .select()
    .single()

  if (error) throw error
  return data
}

// 物件情報を更新する(RLSにより自分が登録した物件のみ更新可能)
export async function updateProperty(id, { name, rent, area, layout }) {
  const { data, error } = await supabase
    .from('properties')
    .update({ name, rent, area, layout })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// 物件を削除する(RLSにより自分が登録した物件のみ削除可能)
export async function deleteProperty(id) {
  const { error } = await supabase.from('properties').delete().eq('id', id)
  if (error) throw error
}

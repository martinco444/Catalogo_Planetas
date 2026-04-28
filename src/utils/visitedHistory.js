const KEY = 'visited_planets_v1'

export function getVisited(){
  try{
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  }catch(e){ return [] }
}

export function addVisited(item){
  try{
    const list = getVisited()
    // keep unique by id, most recent first
    const filtered = list.filter(i => i.id !== item.id)
    filtered.unshift({ id: item.id, name: item.name, ts: Date.now(), img: item.img || null })
    // cap history to 20 entries
    const capped = filtered.slice(0,20)
    localStorage.setItem(KEY, JSON.stringify(capped))
    return capped
  }catch(e){ return [] }
}

export function clearVisited(){
  try{ localStorage.removeItem(KEY) }catch(e){}
}

export default { getVisited, addVisited, clearVisited }

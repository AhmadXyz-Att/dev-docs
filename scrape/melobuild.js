/* Scrape Gak tau tapi untuk ML(gak main ml gw njir)
* Author: AhmadXyz
* Base url = melobuild[DOT]com
* Note: jangan lupa share
*/

export async function getBld(hero) {
  const sb = 'https://bfnagdegsgqrrhlurlpc.supabase.co/rest/v1';
  const k = 'sb_publishable_YSny9E2TJNUVcxTP_B0YOw_K40Uo8A1';
  const hdr = {
    'Content-Type': 'application/json',
    apikey: k,
    Authorization: 'Bearer ' + k,
    Referer: 'https://molebuild.com/builds',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36'
  };
  const req = async (u, o = {}) => {
    const r = await fetch(u, { headers: hdr, ...o });
    const t = await r.text();
    if (!r.ok) throw new Error(r.status + ' ' + u + '\n' + t);
    return t ? JSON.parse(t) : null;
  };
  const t1 = await req(sb + '/rpc/get_relevant_builds', {
    method: 'POST',
    body: JSON.stringify({ p_hero_id: null, p_search: hero, p_limit: 20, p_offset: 0 })
  });

  const idBld = t1.map(x => x.build_id);
  const prmBld = 'id,title,user_id,hero_id,items,likes_count,created_at,is_public,is_verified,patch_id,retribution_types,emblem_id,selected_emblem_attributes,patches(id,version,name,is_active),heroes(id,name,roles,image_url),emblems(id,name,image_url),battle_spells(id,name,image_url)';
  const bld = await req(sb + '/builds?select=' + encodeURIComponent(prmBld) + '&id=in.(' + idBld.join(',') + ')');

  const idItm = [...new Set(bld.flatMap(b => b.items || []))];
  const idUsr = [...new Set(bld.map(b => b.user_id).filter(Boolean))];
  const idPtc = [...new Set(bld.map(b => b.patch_id).filter(Boolean))];

  const [itm, prf, ...emb] = await Promise.all([
    idItm.length ? req(sb + '/items?select=id,image_url,name,stats,price&id=in.(' + idItm.join(',') + ')') : [],
    idUsr.length ? req(sb + '/profiles?select=user_id,username,is_verified,mpl&user_id=in.(' + idUsr.join(',') + ')') : [],
    ...idPtc.map(id => req(sb + '/emblem_versions?select=' + encodeURIComponent('*,emblems:emblem_id(id,name,image_url,attributes)') + '&patch_id=eq.' + id))
  ]);
  const mapItm = Object.fromEntries(itm.map(i => [i.id, i]));
  const mapUsr = Object.fromEntries(prf.map(p => [p.user_id, p]));
  const mapEmb = Object.fromEntries(idPtc.map((id, idx) => [id, emb[idx]]));
  const hsl = {
    search: hero,
    hero: bld[0]?.heroes || null,
    items: itm,
    profiles: mapUsr,
    emblems_by_patch: mapEmb,
    builds: bld.map(b => ({
      id: b.id,
      title: b.title,
      username: mapUsr[b.user_id]?.username || null,
      likes_count: b.likes_count,
      created_at: b.created_at,
      patch: b.patches ? { version: b.patches.version, name: b.patches.name, is_active: b.patches.is_active } : null,
      emblem: b.emblems ? { id: b.emblems.id, name: b.emblems.name, image_url: b.emblems.image_url } : null,     selected_emblem_attributes: b.selected_emblem_attributes,
      battle_spell: b.battle_spells || null,
      items: (b.items || []).map(id => mapItm[id]).filter(Boolean)
    }))
  };
  const jsn = JSON.stringify(hsl, null, 2);
  console.log(jsn);
}

export default getBld;

import axios from 'axios'

export async function scrapeInstagram(url) {
    if (!url) throw new Error('URL wajib diisi')

    const apiUrl = `https://api.fuku.eu.cc/api/igdl?api=YOUR_KEY&url=${encodeURIComponent(url)}`
    const { data: res } = await axios.get(apiUrl, { timeout: 30000 })

    const result = res?.result

    const scrape = {
        status: res?.status,
        creator: res?.creator,
        endpoint: res?.endpoint,
        success: result?.success,
        source: result?.source,
        shortcode: result?.shortcode,
        hosting: result?.hosting,
        thumb: result?.thumb,
        sd: result?.sd,
        hd: result?.hd,
        title: result?.meta?.title,
        username: result?.meta?.username,
        commentCount: result?.meta?.commentCount,
        likeCount: result?.meta?.likeCount,
        takenAt: result?.meta?.takenAt,
        media: result?.media?.map((v, i) => ({
            index: i + 1,
            url: v.url,
            name: v.name,
            type: v.type,
            ext: v.ext
        })),
        fetchedAt: result?.fetchedAt,
        remaining: res?.usageInfo?.remaining,
        limit: res?.usageInfo?.limit,
        totalUsed: res?.usageInfo?.totalUsed,
        isAdmin: res?.isAdmin
    }

    return scrape
}

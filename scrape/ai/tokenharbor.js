/* SCRAPE BY AHMADXYZ

** BASE URL: https://tokenharbor.ai
** Request By: ~ 😊
** Author: AhmadXyz
*/
Note: Silahkan login dulu ke web nya terus ambil apikey masing masing! & di bagian https://tokenharbor.ai/dashboard

alur: buat apikey --> terus masuk ke dashboard terus aktifkan model free


const apikeymu = "MASUKKAN_APIKEU_DISINI:V";
const linknya = "https://tokenharbor.ai/v1/chat/completions";
const ai = ["deepseek-v4.1-flash:free", "mimo-v2.6-flash:free"];

async function anu(pesan, modelTerpilih) {
    try {
        const respons = await fetch(linknya, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apikeymu}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: modelTerpilih,
                messages: [{ role: "user", content: pesan }]
            })
        });
        const data = await respons.json();
        if (!respons.ok) {
            throw new Error(data.error?.message || "Error Wak:v");
        }
        return data;
    } catch (kesalahan) {
        return { error: kesalahan.message };
    }
}

async function jalankuen(pesan) {
    const iniDia = [];
    for (const model of ai) {
        const hasil = await anu(pesan, model);      
        if (hasil.error) {
            iniDia.push({
                model: model,
                status: "gagal",
                pesan_kesalahan: hasil.error
            });
            continue;
        }
        iniDia.push({
            model: model,
            status: "sukses",
            balasan: hasil.choices[0].message.content.trim(),
            proses_berpikir: hasil.choices[0].message.reasoning_content ? hasil.choices[0].message.reasoning_content.trim() : null,
            statistik_token: {
                prompt_tokens: hasil.usage.prompt_tokens,
                completion_tokens: hasil.usage.completion_tokens,
                total_tokens: hasil.usage.total_tokens
            }
        });
    }
    console.log(JSON.stringify(iniDia, null, 2));
}

jalankuen("halo aku gue");

/*
 * WRAPPER DEEPORG CHAT AI
 *
 * Base URL : https://deepai.org/chat/gpt-6-luna
 * Author   : AhmadXyz
 * Req by   : Finix
 *
 * Description:
 * Wrapper untuk mengakses layanan DeepOrg Chat AI
 *
 */
const { randomUUID: buatUUID } = require('node:crypto');
const alamatAPI = 'https://api.deepai.org/hacking_is_a_serious_crime';
const namaModel = 'gpt-6-luna';
let idSesi = buatUUID();
let riwayatChat = [];
async function deeporg(teks) {
  if (typeof teks !== 'string' || !teks.trim()) {
    return {
      success: false,
      status: 400,
      error: 'Teks tidak boleh kosong'
    };
  }
  const kunciAPI = "tryit-19444315711-81c95136f9c3a51523863ffbb73a7c36"
  if (!kunciAPI) {
    return {
      success: false,
      status: 401,
      error: 'apikey belum diatur'
    };
  }
  const riwayatBaru = [
    ...riwayatChat,
    {
      role: 'user',
      content: teks.trim()
    }
  ];
  const idSensitivitas = buatUUID();
  const formulir = new FormData();
  formulir.append('chat_style', 'chat');
  formulir.append('language', 'en');
  formulir.append('web_access_enabled', 'true');
  formulir.append('sandbox_enabled', 'false');
  formulir.append('chatHistory', JSON.stringify(riwayatBaru));
  formulir.append('model', namaModel);
  formulir.append('session_uuid', idSesi);
  formulir.append('sensitivity_request_id', idSensitivitas);
  formulir.append('tool_activity_support', '1');
  formulir.append('thinking_image_tool_support', '1');
  formulir.append('hacker_is_stinky', 'very_stinky');
  formulir.append(
    'enabled_tools',
    JSON.stringify(['image_generator', 'image_editor'])
  );
  try {
    const respons = await fetch(alamatAPI, {
      method: 'POST',
      headers: {
        'api-key': kunciAPI,
        Accept: '*/*'
      },
      body: formulir,
      signal: AbortSignal.timeout(90000)
    });
    const isiRespons = await respons.text();

    if (!respons.ok) {
      return {
        success: false,
        status: respons.status,
        error: isiRespons || respons.statusText,
        session_id: idSesi
      };
    }
    riwayatChat = [
      ...riwayatBaru,
      {
        role: 'assistant',
        content: isiRespons
      }
    ];
    return {
      success: true,
      status: respons.status,
      data: {
        text: isiRespons
      },
      session_id: idSesi
    };
  } catch (kesalahan) {
    return {
      success: false,
      status: 0,
      error: kesalahan.message,
      session_id: idSesi
    };
  }
}
deeporg.reset = function () {
  idSesi = buatUUID();
  riwayatChat = [];

  return {
    success: true,
    session_id: idSesi
  };
};
deeporg.getHistory = function () {
  return JSON.parse(JSON.stringify(riwayatChat));
};
module.exports = deeporg;

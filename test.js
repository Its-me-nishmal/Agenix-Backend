// Import node-fetch (skip if using Node.js 18+ with native fetch)

async function sendMessage() {
  try {
    const response = await fetch('https://agenix-backend.vercel.app/sessions/68a55dfeb80df4745c9dd5ba/messages', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'priority': 'u=1, i',
        'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'Referer': 'https://hayatixai.nichu.dev/'
      },
      body: JSON.stringify({
        role: 'user',
        content: 'hey'
      })
    });

    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

sendMessage();
export async function sendManyChatMessage(subscriberId: string, messageText: string, apiKey: string) {
  const url = 'https://api.manychat.com/fb/sending/sendContent';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      subscriber_id: subscriberId,
      data: {
        version: "v2",
        content: {
          messages: [
            {
              type: "text",
              text: messageText
            }
          ]
        }
      },
      message_tag: "ACCOUNT_UPDATE"
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error sending ManyChat message:', errorText);
    throw new Error(`ManyChat API Error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

export async function createManyChatSubscriber(whatsappNumber: string, apiKey: string) {
  // Use createSubscriber endpoint (or find by system field to ensure they exist)
  // According to Manychat API, you can find a subscriber by Custom Field or create them.
  const url = 'https://api.manychat.com/fb/subscriber/createSubscriber';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      first_name: "Usuario",
      whatsapp_phone: whatsappNumber,
      has_opt_in_sms: false,
      has_opt_in_email: false,
      consent_phrase: "Web opt-in"
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error creating ManyChat subscriber:', errorText);
    throw new Error(`ManyChat API Error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

import axios from 'axios';

export const sendTemplateMessage = async () => {
  try {
    const response = await axios({
      url: "https://graph.facebook.com/v22.0/713492948524774/messages",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        to: "919712877500", 
        type: "template",
        template: {
          name: "hello_world", 
          language: {
            code: "en_US",
          },
        },
      },
    });

    console.log("Message sent:", response.data);
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
  }
};


export const sendTextMessage = async ({ to, name, jobTitle, jobRole, duration, company, stipend }) => {
  try {
    const response = await axios({
      url: "https://graph.facebook.com/v22.0/713492948524774/messages",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        to: `91${to}`, 
        type: "text",
        text: {
        body: 
          `Hello ${name},

          We are pleased to inform you about a new *Internship Opportunity* at *${company}* that aligns with your profile.

          📌 *Position:* ${jobTitle}  
          👨‍💻 *Role:* ${jobRole}  
          ⏳ *Duration:* ${duration}  
          🏢 *Company:* ${company}  
          💰 *Stipend:* ${stipend}

          This is a great opportunity to enhance your skills and advance your career.

          👉 Apply now: https://prepverse-ai.onrender.com/

          Best regards,  
          The Prepverse.AI Team`,
        }
      },
    });

    console.log("WhatsApp message sent:", response.data);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.response?.data || error.message);
  }
};


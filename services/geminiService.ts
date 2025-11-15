
import { GoogleGenAI } from "@google/genai";
import { Booking } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and will show an alert in the browser.
  // In a real production environment, the API key should be securely managed.
  console.warn("API_KEY for Gemini is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateConfirmationMessage(booking: Booking): Promise<string> {
  if (!API_KEY) {
     return "Sua solicitação de reserva foi recebida! Agradecemos por nos escolher. Entraremos em contato em breve para confirmar seu horário.";
  }
  if (!booking.service || !booking.professional || !booking.date || !booking.time || !booking.client.name) {
    throw new Error("Booking information is incomplete.");
  }

  const { service, professional, date, client } = booking;
  
  const formattedDate = date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `
    Você é um assistente virtual da Massoterapia Concept Clínica.
    Gere uma mensagem amigável e acolhedora em português do Brasil informando que a **solicitação de agendamento foi recebida** e está **aguardando confirmação**.
    A mensagem deve ser curta, com no máximo 3 frases.
    Acalme o cliente, dizendo que a clínica confirmará o horário em breve.
    Inclua o nome do cliente e o serviço solicitado.
    Forneça uma dica de preparação relevante para o serviço.

    Detalhes do Agendamento:
    - Cliente: ${client.name}
    - Serviço: ${service.name}
    - Descrição do Serviço: ${service.description}
    - Profissional: ${professional.name}
    - Data: ${formattedDate}
    - Horário: ${booking.time}

    Exemplo de Dica: Para uma massagem relaxante, a dica pode ser sobre chegar um pouco antes para relaxar. Para drenagem linfática, pode ser sobre beber bastante água.

    Não inclua a data, hora ou nome do profissional na sua resposta, apenas o nome do cliente, o nome do serviço e a dica.
    Comece a mensagem com "Olá, ${client.name}!".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sua solicitação de reserva foi recebida! Agradecemos por nos escolher. Entraremos em contato em breve para confirmar seu horário.";
  }
}

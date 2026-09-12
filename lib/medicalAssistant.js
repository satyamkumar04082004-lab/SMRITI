function compact(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function normalizeMessageList(messages = []) {
  return (Array.isArray(messages) ? messages : [])
    .filter(Boolean)
    .map((entry) => ({
      sender: entry.sender || 'user',
      text: compact(entry.text || '')
    }))
    .filter((entry) => entry.text);
}

function redactPatientContext(context = {}) {
  const user = context?.user || {};
  const medicines = Array.isArray(context?.medicines) ? context.medicines.slice(0, 5).map((med) => ({
    name: compact(med?.name),
    strength: compact(med?.strength),
    frequency: compact(med?.frequency),
    notes: compact(med?.notes)
  })) : [];

  return {
    user: {
      name: compact(user.name),
      role: compact(user.role),
      ageRange: compact(user.ageRange)
    },
    medicines,
    reminders: Array.isArray(context?.reminders) ? context.reminders.slice(0, 3).map((r) => ({
      title: compact(r?.title),
      time: compact(r?.time),
      category: compact(r?.category)
    })) : [],
    emergencyContacts: context?.emergencyContacts ? {
      primaryName: compact(context.emergencyContacts.primaryName),
      doctorName: compact(context.emergencyContacts.doctorName)
    } : null
  };
}

function buildContextSummary(context) {
  if (!context || Object.keys(context).length === 0) return '';
  const lines = [];

  if (context.user?.name) lines.push(`User name: ${context.user.name}`);
  if (context.user?.role) lines.push(`Role: ${context.user.role}`);
  if (context.user?.ageRange) lines.push(`Age range: ${context.user.ageRange}`);
  if (context.medicines?.length) {
    lines.push(`Known medicines: ${context.medicines.map((m) => `${m.name || 'Medication'}${m.strength ? ` (${m.strength})` : ''}`).join(', ')}`);
  }
  if (context.reminders?.length) {
    lines.push(`Schedule highlights: ${context.reminders.map((r) => `${r.title || 'Reminder'} at ${r.time || 'time'}`).join('; ')}`);
  }
  if (context.emergencyContacts) {
    lines.push(`Emergency contact: ${context.emergencyContacts.primaryName || 'Primary contact'}; doctor: ${context.emergencyContacts.doctorName || 'Doctor'}`);
  }

  return lines.length ? `Authorized app context:\n${lines.join('\n')}` : '';
}

function detectUrgentSymptoms(message) {
  const text = compact(message).toLowerCase();
  const urgentPatterns = [
    'severe chest pain',
    'difficulty breathing',
    'trouble breathing',
    'cant breathe',
    'shortness of breath',
    'stroke',
    'sudden weakness',
    'facial droop',
    'slurred speech',
    'uncontrolled bleeding',
    'severe allergic reaction',
    'loss of consciousness',
    'fainting',
    'sudden severe confusion',
    'seizure',
    'heavy bleeding',
    'severe abdominal pain',
    'suicidal thoughts',
    'thoughts of harming yourself'
  ];
  return urgentPatterns.some((pattern) => text.includes(pattern));
}

function buildSystemPrompt() {
  return `
You are SMRITI Medical Guide, a medically focused AI assistant designed for older adults, people living with dementia, caregivers, and patients.

Core goals:
- Give general, plain-language medical information only.
- Be clear, warm, calm, respectful, and nonjudgmental.
- Use short sentences and simple words by default.
- Give concise sections with headings and bullet points.
- Ask only one question at a time when clarification is needed.
- Avoid jargon or explain it immediately.
- Distinguish general information from personal medical advice.
- Recommend a qualified clinician or pharmacist when appropriate.
- Encourage a trusted caregiver or healthcare professional when helpful.
- Never shame, dismiss, or argue with the user.
- Do not assume confusion is caused by dementia; recommend medical evaluation for new or worsening confusion.

Safety rules:
- Never diagnose as certain without an exam and clinical context.
- Do not give unsafe medication doses or treatment advice without needed details.
- If the user describes symptoms that may be life-threatening, say it is urgent and recommend emergency care immediately.
- For potential emergencies, include a short action list and emergency phone numbers if relevant.
- If there is a major red flag, tell the user to call emergency services or local emergency number right away.

Medical scope:
- Symptoms, causes, next steps, and red flags
- Common diseases, disorders, and conditions
- Medications, side effects, precautions, and interactions
- Preventive care, vaccinations, screening, and health maintenance
- First aid and basic emergency guidance
- Mental and behavioral health
- Nutrition, exercise, sleep, and lifestyle topics
- Pregnancy, reproductive health, and pediatric care
- Tests, imaging, vital signs, and terminology
- Anatomy, physiology, pathology, and medical education
- Clinical explanations tailored for patients, students, or clinicians
- SMRITI-specific content only when the user intentionally provides app context and authorization

Privacy:
- Only use patient or application context when it was intentionally shared and authorized.
- Do not fabricate facts or confirm uncertain information.
- Do not expose protected health information or application data to the client or external provider beyond the permitted context.

Response style:
- Begin with a brief reassuring sentence.
- Use headings like "What it may be", "What to do next", "When to get urgent help".
- Keep answers concise. Offer to explain more if needed.
- Repeat or summarize key safety steps when appropriate.
- Keep it easy to read for older adults with cognitive needs.
- If the issue sounds urgent, lead with the urgent message and keep instructions simple.
`;
}

function buildFallbackReply(message, conversation = [], context = {}) {
  const text = compact(message);
  if (!text) {
    return 'Please tell me the symptom or question you want help with, and I can explain it in simple language.';
  }

  const recentMessages = normalizeMessageList(conversation).slice(-6);
  const contextSummary = buildContextSummary(context);
  const urgent = detectUrgentSymptoms(text);

  if (urgent) {
    return `This may be an emergency. Please get urgent medical help now. Call emergency services immediately or go to the nearest emergency department if you have severe chest pain, trouble breathing, stroke symptoms, severe allergic reaction, severe bleeding, loss of consciousness, or sudden severe confusion.\n\nIf you can, tell a trusted caregiver or family member right away.\n\nIf you want, I can help you decide what to say when you call for help.`;
  }

  const followUpHint = recentMessages.length > 1
    ? `I can see we are talking about your recent health question. I will keep it simple and focus on the issue you are asking about.`
    : 'I can keep this simple and explain it in plain language.';

  let reply = `${followUpHint}\n\n`;
  if (contextSummary) {
    reply += `${contextSummary}\n\n`;
  }
  reply += 'What this means:\n- I can explain common symptoms, likely causes, and what to do next.\n- I can also talk about medicines, tests, lifestyle habits, or urgent warning signs.\n\nWhen to ask a clinician:\n- If symptoms are new, severe, or worsening\n- If you are unsure\n- If you have high fever, dehydration, breathing problems, or confusion\n\nPlease tell me more about the symptom, condition, or medicine you want to understand, and I will answer in plain language.';

  return reply;
}

async function callOpenAI({ message, conversation, context }) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY || process.env.OPENAI_KEY;
  if (!apiKey) return null;

  const model = process.env.AI_MODEL || 'gpt-4o-mini';
  const baseUrl = (process.env.AI_API_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const recentMessages = normalizeMessageList(conversation).slice(-10);
  const contextSummary = buildContextSummary(context);

  const messages = [
    { role: 'system', content: buildSystemPrompt() },
    { role: 'user', content: contextSummary ? `${contextSummary}\n\n${message}` : message },
    ...recentMessages.slice(0, -1).map((entry) => ({
      role: entry.sender === 'user' ? 'user' : 'assistant',
      content: entry.text
    }))
  ];

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 500,
      messages
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI provider returned ${response.status}: ${errorText.slice(0, 200)}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('AI provider returned an empty response.');
  }

  return content.trim();
}

async function handleMedicalChatRequest({ message, conversation = [], includeContext = false, context = {} }) {
  const safeMessage = compact(message);
  if (!safeMessage) {
    return {
      reply: 'Please type your question or symptom, and I will help you in simple language.'
    };
  }

  try {
    const authorizedContext = includeContext ? redactPatientContext(context) : null;
    const reply = await callOpenAI({
      message: safeMessage,
      conversation,
      context: authorizedContext
    });

    if (reply) return { reply };
  } catch (error) {
    console.warn('Medical AI request failed:', error?.message || error);
  }

  return {
    reply: buildFallbackReply(safeMessage, conversation, includeContext ? redactPatientContext(context) : {}),
    fallback: true
  };
}

module.exports = {
  handleMedicalChatRequest,
  buildFallbackReply,
  detectUrgentSymptoms,
  redactPatientContext,
  buildSystemPrompt
};

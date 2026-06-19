import Constants from 'expo-constants';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export function getOpenAIKey() {
  const extraKey = Constants.expoConfig?.extra?.OPENAI_API_KEY as string | undefined;
  return extraKey || process.env.OPENAI_API_KEY || '';
}

export async function generateStoryFromOpenAI(theme: string, childName: string, childAge: number, childAgeGroup?: string) {
  const apiKey = getOpenAIKey();
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Add OPENAI_API_KEY to Expo extra or environment variables.');
  }

  const prompt = `Write a safe, friendly 2-minute ${theme} story for a ${childAge}-year-old${childAgeGroup ? ` in the ${childAgeGroup} age group` : ''} named ${childName}. Keep the language simple, use short sentences, include a gentle lesson, and keep the story under 180 words.`;

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a kind and safe storyteller for young children.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 250,
      temperature: 0.75,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error?.message || 'OpenAI request failed');
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('OpenAI returned an unexpected response.');
  }

  return content.trim();
}

export function createFallbackStory(theme: string, childName: string) {
  return `Once upon a time, ${childName} went on a ${theme} adventure. ${childName} met new friends, solved a small problem, and learned that kindness and curiosity help every hero.`;
}

export async function fetchSimBriefData(userId) {
  const url = `https://www.simbrief.com/api/xml.fetcher.php?userid=${userId}&json=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro na requisição SimBrief');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Falha ao buscar dados do SimBrief:', error);
    return null;
  }
}

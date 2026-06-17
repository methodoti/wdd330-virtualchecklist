const file = '/json/checklist.json';

export default async function getChecklistData() {
  const response = await fetch(file);
  const data = await response.json();
  return data.aircrafts; //important to deliver the data!
}

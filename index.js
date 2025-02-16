import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import csvtojson from 'csvtojson';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));

const API_KEY = 'INSERISCI_LA_TUA_CHIAVE';
const API_URL = 'https://www.dati.gov.it/api/3/action/package_show?id=cestini-napoli';

async function fetchBinData() {
  try {
    const response = await fetch(`${API_URL}&access_key=${API_KEY}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const packageInfo = await response.json();
    const resource = packageInfo.result.resources.find(r => r.format === 'CSV');

    if (!resource) throw new Error('Nessuna risorsa CSV trovata');

    const csvResponse = await fetch(resource.url);
    const csvText = await csvResponse.text();
    return await csvtojson().fromString(csvText);
  } catch (error) {
    console.error('Errore nel fetch dati:', error);
    return null;
  }
}

app.get('/api/bins', async (req, res) => {
  const binData = await fetchBinData();
  if (!binData) return res.status(500).json({ error: 'Impossibile ottenere i dati' });
  res.json(binData);
});

app.listen(PORT, () => console.log(`Server in ascolto su porta ${PORT}`));
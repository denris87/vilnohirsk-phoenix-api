const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');

const app = express();
app.use(cors());

// URL к файлу YAML в вашем новом репозитории на GitHub
const GITHUB_API_URL = 'https://api.github.com/repos/denris87/vilnohirsk-phoenix-api/contents/phoenix.yaml';

app.get('/api/phoenix', async (req, res) => {
    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        if (!response.ok) throw new Error('Не вдалося завантажити YAML з GitHub API');
        
        const yamlText = await response.text();
        const data = yaml.load(yamlText);
        
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        res.json(data.phoenix || []);
    } catch (error) {
        console.error('Помилка сервера:', error);
        res.status(500).json({ error: 'Failed to load data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

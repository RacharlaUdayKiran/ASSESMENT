const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

// Replace with your actual WHOIS API key
const API_KEY = 'YOUR_API_KEY';
var WHOIS_API_URL = 'https://www.whoisxmlapi.com/whoisserver/WhoisService';

app.post('/whois', async (req, res) => {
    const { domain, type } = req.body;

    if (!domain || !['domain', 'contact'].includes(type)) {
        return res.status(400).json({ error: 'Please provide a valid domain and type ("domain" or "contact")' });
    }

    try {
        const response = await axios.get(WHOIS_API_URL, {
            params: {
                apiKey: API_KEY,
                domainName: domain,
                outputFormat: 'JSON'
            }
        });

        const data = response.data;
        if (!data.WhoisRecord) {
            return res.status(500).json({ error: 'No Whois data found' });
        }

        const record = data.WhoisRecord;

        if (type === 'domain') {
            return res.json({
                domainName: record.domainName,
                createdDate: record.createdDate,
                updatedDate: record.updatedDate,
                expiresDate: record.expiresDate,
                registrarName: record.registrarName
            });
        } else if (type === 'contact') {
            const contact = record.registrant || {};
            return res.json({
                name: contact.name,
                organization: contact.organization,
                email: contact.email,
                telephone: contact.telephone,
                country: contact.country
            });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error fetching Whois data' });
    }
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;
const WHOIS_API_KEY = "YOUR_API_KEY"; // Replace with your actual Whois XML API Key

app.use(cors());
app.use(express.json());

const WHOIS_API_URL = "https://www.whoisxmlapi.com/whoisserver/WhoisService";

function truncateHostnames(hostnames) {
  if (!hostnames || !Array.isArray(hostnames)) return "N/A";
  const combined = hostnames.join(", ");
  return combined.length > 25 ? combined.substring(0, 25) + "..." : combined;
}

app.post("/api/whois", async (req, res) => {
  const { domain, type } = req.body;

  if (!domain || !["domain", "contact"].includes(type)) {
    return res.status(400).json({ error: "Invalid input data." });
  }

  try {
    const response = await axios.get(WHOIS_API_URL, {
      params: {
        apiKey: WHOIS_API_KEY,
        domainName: domain,
        outputFormat: "JSON"
      }
    });

    const record = response.data.WhoisRecord || {};

    if (type === "domain") {
      const result = {
        domainName: record.domainName || "N/A",
        createdDate: record.createdDate || "N/A",
        updatedDate: record.updatedDate || "N/A",
        expiresDate: record.expiresDate || "N/A",
        registrarName: record.registrarName || "N/A",
        hostnames: truncateHostnames(record.nameServers?.hostNames)
      };
      return res.json(result);
    } else if (type === "contact") {
      const contact = record.registrant || {};
      const result = {
        name: contact.name || "N/A",
        organization: contact.organization || "N/A",
        email: contact.email || "N/A",
        telephone: contact.telephone || "N/A",
        country: contact.country || "N/A"
      };
      return res.json(result);
    }
  } catch (error) {
    console.error("WHOIS API Error:", error.message);
    return res.status(500).json({ error: "WHOIS lookup failed." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

  
  

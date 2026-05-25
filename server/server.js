// Backend entry point
const express = require('express');
const app = express();
const http = require('http'); 
const server = http.createServer(app);


let certificates=[];

app.post('/api/certificates', (req, res) => {
  const {
    certificateNumber,
    equipmentOwner,
    location,
    calibrationDate,
    nextDueDate,
    equipmentName,
    manufacturer,
    serialNumber,
    fitForUse
  } = req.body;
  
  const newCertificate = {
    id: Date.now(),
    certificateNumber,
    equipmentOwner,
    location,
    calibrationDate,
    nextDueDate,
    equipmentName,
    manufacturer,
    serialNumber,
    fitForUse,
    createdAt: new Date().toISOString()
  };
  
  certificates.push(newCertificate);
  res.status(201).json(newCertificate);
});





app.get('/api/certificates/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const certificate = certificates.find(c => c.id === id);
  
  if (!certificate) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  
  res.json(certificate);
});








server.listen(5000, () => {
  console.log('Server running on http://localhost:3000');
});
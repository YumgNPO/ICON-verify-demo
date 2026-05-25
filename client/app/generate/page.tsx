'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import { PDFDocument, rgb } from 'pdf-lib';

export default function GenerateCertificate() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(true); 
  const [isLoading, setIsLoading] = useState(false);

  // State mapped strictly to the PDF variables
  const [formData, setFormData] = useState({
    certificateNumber: 'ILRIL/SCNL/PSV/T7 BONNY/05/26/07',
    equipmentOwner: 'Saipem Contracting Nigeria Limited',
    serviceRequest: 'Calibration & Certification', 
    location: 'T7 PROJECT NLNG BONNY SITE',
    calibrationDate: '17th MAY 2026',
    nextDueDate: '16th MAY 2027',
    equipmentName: 'PRESSURE SAFETY VALVE',
    manufacturer: 'RAJTECH',
    serialNumber: 'PSV 005',
    assetNo: 'NOT SEEN',
    psvType: 'SAFETY VALVE', 
    range: '0-10 BAR',
    setPressure: '10 BAR',
    refDescription: 'Ashcroft Test Gauge', 
    refModel: 'DPG224',
    refSerialNo: '2831125818',
    ambientTemp: '30°C',
    refCalDate: '14/12/2025',
    refNextDue: '13/12/2026',
    display: 'Excellent',
    flangeIntegrity: 'Excellent',
    remark: 'Ok',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    router.push('/'); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Send data to backend
      const response = await fetch('http://localhost:5000/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Backend connection failed");
      const dbData = await response.json();
      const certificateId = dbData.id;

      // 2. Generate QR Code
      const verificationUrl = `http://localhost:3000/verify/${certificateId}`;
      const qrImage = await QRCode.toDataURL(verificationUrl);
      
      // 3. Load Blank Template
      const existingPdfBytes = await fetch('/blank-template.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const secondPage = pages[1];

      const textSize = 10;
      const textsize1 = 8;
      const textsize2 = 6
      const textColor = rgb(0, 0, 0);

      // ==========================================
      // PAGE 1 STAMPING
      // ==========================================
      const page1X = 230; 
      firstPage.drawText(formData.certificateNumber, { x: page1X, y: 628, size: textSize, color: textColor });
      firstPage.drawText(formData.equipmentOwner, { x: page1X, y: 605, size: textSize, color: textColor });
      firstPage.drawText(formData.equipmentName, { x: page1X, y: 570, size: textSize, color: textColor });
      firstPage.drawText(formData.manufacturer, { x: page1X, y: 540, size: textSize, color: textColor });
      firstPage.drawText(formData.serialNumber, { x: page1X, y: 510, size: textSize, color: textColor });
      firstPage.drawText(formData.assetNo, { x: page1X, y: 480, size: textSize, color: textColor }); 
      firstPage.drawText(formData.ambientTemp, { x: page1X, y: 450, size: textSize, color: textColor });
      firstPage.drawText(formData.calibrationDate, { x: page1X, y: 420, size: textSize, color: textColor });
      firstPage.drawText(formData.nextDueDate, { x: page1X, y: 390, size: textSize, color: textColor });
      firstPage.drawText(formData.location, { x: page1X, y: 360, size: textSize, color: textColor });
      
      // Page 1 Remark Blank
      firstPage.drawText(formData.equipmentName, { x: 260, y: 135, size: textSize, color: textColor }); 

      // Page 1 QR Code
      const qrImageBytes = await fetch(qrImage).then(res => res.arrayBuffer());
      const qrImageEmbed = await pdfDoc.embedPng(qrImageBytes);
      firstPage.drawImage(qrImageEmbed, {
        x: 460, 
        y: 600, 
        width: 100,
        height: 100,
      });

      // Page 1 Standard Instrument Table
      const p1TableY = 180;
      firstPage.drawText(formData.refDescription, { x: 70, y: p1TableY, size: textSize, color: textColor });
      firstPage.drawText(formData.refModel, { x: 220, y: p1TableY, size: textSize, color: textColor });
      firstPage.drawText(formData.refSerialNo, { x: 300, y: p1TableY, size: textSize, color: textColor });
      firstPage.drawText(formData.refCalDate, { x: 400, y: p1TableY, size: textSize, color: textColor });
      firstPage.drawText(formData.refNextDue, { x: 480, y: p1TableY, size: textSize, color: textColor });

      // ==========================================
      // PAGE 2 STAMPING
      // ==========================================
      secondPage.drawText(formData.certificateNumber, { x: 230, y: 580, size: textSize, color: textColor });
      secondPage.drawText(formData.equipmentOwner, { x: 230, y: 560, size: textSize, color: textColor });
      secondPage.drawText(formData.serviceRequest, { x: 230, y: 540, size: textSize, color: textColor }); 
      
      // Left Info Column
      const p2LeftX = 180;
      secondPage.drawText(formData.equipmentName, { x: p2LeftX, y: 505, size: textSize, color: textColor });
      secondPage.drawText(formData.manufacturer, { x: p2LeftX, y: 485, size: textSize, color: textColor });
      secondPage.drawText(formData.serialNumber, { x: p2LeftX, y: 465, size: textSize, color: textColor });
      secondPage.drawText(formData.assetNo, { x: p2LeftX, y: 445, size: textSize, color: textColor });
      secondPage.drawText(formData.range, { x: p2LeftX, y: 425, size: textSize, color: textColor });
      secondPage.drawText(formData.refDescription, { x: 220, y: 395, size: textSize, color: textColor }); 

      // Right Info Column
      const p2RightX = 420;
      secondPage.drawText(formData.ambientTemp, { x: p2RightX, y: 485, size: textSize, color: textColor });
      secondPage.drawText(formData.calibrationDate, { x: p2RightX, y: 465, size: textSize, color: textColor });
      secondPage.drawText(formData.nextDueDate, { x: p2RightX, y: 445, size: textSize, color: textColor });

      // Page 2 Physical Inspection Table
      const p2PhysTableY = 320;
      secondPage.drawText(formData.display, { x: 100, y: p2PhysTableY, size: textSize, color: textColor }); 
      secondPage.drawText(formData.flangeIntegrity, { x: 280, y: p2PhysTableY, size: textSize, color: textColor }); 

      // Page 2 Calibration Data Table
      const p2CalTableY = 230;
      secondPage.drawText(formData.psvType, { x: 70, y: p2CalTableY, size: textSize, color: textColor }); 
      secondPage.drawText(formData.serialNumber, { x: 180, y: p2CalTableY, size: textSize, color: textColor });
      secondPage.drawText(formData.range, { x: 290, y: p2CalTableY, size: textSize, color: textColor });
      secondPage.drawText(formData.setPressure, { x: 390, y: p2CalTableY, size: textSize, color: textColor });
      secondPage.drawText(formData.remark, { x: 480, y: p2CalTableY, size: textSize, color: textColor });

      // Page 2 Bottom Dates
      const signatureY = 155; 
      secondPage.drawText(formData.calibrationDate, { x: 230, y: signatureY, size: textSize, color: textColor }); 
      secondPage.drawText(formData.calibrationDate, { x: 450, y: signatureY, size: textSize, color: textColor }); 

      // Compile and Open PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');

    } catch (error) {
       console.error("Error generating PDF:", error);
       alert("Failed to connect to the database. Make sure the Node.js server is running on port 5000.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthorized) return <div className="min-h-screen flex items-center justify-center">Unauthorized</div>;

  const inputCss = "w-full p-2 border border-slate-300 rounded-md text-slate-900 bg-white mt-1";
  const labelCss = "text-sm font-semibold text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Certificate Generator</h1>
            <p className="text-slate-500 mt-1">Review and finalize equipment details.</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 border rounded-md hover:bg-slate-50 text-slate-700">
            Log Out
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Core Information */}
          <div className="bg-slate-50 p-6 rounded-lg border">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">1. Core Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCss}>Certificate Number</label>
                <input type="text" name="certificateNumber" value={formData.certificateNumber} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>Equipment Owner / Customer</label>
                <input type="text" name="equipmentOwner" value={formData.equipmentOwner} onChange={handleChange} className={inputCss} />
              </div>
              <div className="col-span-2">
                <label className={labelCss}>Service Request</label>
                <input type="text" name="serviceRequest" value={formData.serviceRequest} onChange={handleChange} className={inputCss} />
              </div>
              <div className="col-span-2">
                <label className={labelCss}>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>Calibration Date</label>
                <input type="text" name="calibrationDate" value={formData.calibrationDate} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>Next Due Date</label>
                <input type="text" name="nextDueDate" value={formData.nextDueDate} onChange={handleChange} className={inputCss} />
              </div>
            </div>
          </div>

          {/* Section 2: Equipment Specifications */}
          <div className="bg-slate-50 p-6 rounded-lg border">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">2. Equipment Specifications</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCss}>Equipment</label>
                <input type="text" name="equipmentName" value={formData.equipmentName} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>Manufacturer</label>
                <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>Serial Number</label>
                <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>ASSET NO</label>
                <input type="text" name="assetNo" value={formData.assetNo} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>PSV TYPE</label>
                <input type="text" name="psvType" value={formData.psvType} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>RANGE</label>
                <input type="text" name="range" value={formData.range} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>SET PRESSURE</label>
                <input type="text" name="setPressure" value={formData.setPressure} onChange={handleChange} className={inputCss} />
              </div>
            </div>
          </div>

          {/* Section 3: Reference Instrument Used */}
          <div className="bg-slate-50 p-6 rounded-lg border">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">3. Reference Instrument Used</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <label className={labelCss}>Description</label>
                <input type="text" name="refDescription" value={formData.refDescription} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>Model</label>
                <input type="text" name="refModel" value={formData.refModel} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>Serial No.</label>
                <input type="text" name="refSerialNo" value={formData.refSerialNo} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>Ambient Temp</label>
                <input type="text" name="ambientTemp" value={formData.ambientTemp} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>Calibration Date</label>
                <input type="text" name="refCalDate" value={formData.refCalDate} onChange={handleChange} className={inputCss} />
              </div>
              <div>
                <label className={labelCss}>Next Due</label>
                <input type="text" name="refNextDue" value={formData.refNextDue} onChange={handleChange} className={inputCss} />
              </div>
            </div>
          </div>

          {/* Section 4: Inspection & Calibration Data */}
          <div className="bg-slate-50 p-6 rounded-lg border">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">4. Inspection & Calibration Data</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className={labelCss}>Display</label>
                <select name="display" value={formData.display} onChange={handleChange} className={inputCss}>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div>
                <label className={labelCss}>Inlet/Outlet Flange Integrity</label>
                <select name="flangeIntegrity" value={formData.flangeIntegrity} onChange={handleChange} className={inputCss}>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div>
                <label className={labelCss}>REMARK</label>
                <input type="text" name="remark" value={formData.remark} onChange={handleChange} className={inputCss} />
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md flex items-center font-bold">
              <span className="mr-2">✅</span> CERTIFIED FIT FOR USE
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={isLoading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-md transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Generating...' : 'Generate Certificate'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
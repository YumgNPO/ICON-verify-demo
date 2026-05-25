import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Exact styles to replicate the original physical document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 10,
    marginBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000080', // Navy blue
    marginBottom: 4,
  },
  companySubtext: {
    fontSize: 8,
    color: '#333',
    maxWidth: 250,
  },
  qrCode: {
    width: 70,
    height: 70,
  },
  docTitleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecoration: 'underline',
    textTransform: 'uppercase',
  },
  gridContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: '35%',
    fontSize: 10,
    color: '#555',
  },
  value: {
    width: '65%',
    fontSize: 10,
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 5,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableCol: {
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 5,
    fontSize: 9,
  },
  remarkSection: {
    fontSize: 10,
    marginTop: 10,
    lineHeight: 1.5,
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  signatureBlock: {
    width: '40%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 9,
  }
});

export const CertificatePDF = ({ data, qrCodeUrl }: { data: any, qrCodeUrl: string }) => (
  <Document>
    
    {/* ================= PAGE 1: TEST CERTIFICATE ================= */}
    <Page size="A4" style={styles.page}>
      
      {/* Top Branding & QR */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.companyName}>ICON</Text>
          <Text style={styles.companySubtext}>ICON LIFTING & RIGGING INSPECTIONS LIMITED</Text>
          <Text style={styles.companySubtext}>Lifting and Rigging Inspections, NDT Inspections, Certification of Lifting equipment</Text>
        </View>
        {qrCodeUrl && <Image src={qrCodeUrl} style={styles.qrCode} />}
      </View>

      <View style={styles.docTitleContainer}>
        <Text style={styles.docTitle}>TEST CERTIFICATE</Text>
      </View>

      {/* Main Data Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.row}><Text style={styles.label}>Certificate Number:</Text><Text style={styles.value}>{data.certificateNumber || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Equipment Owner:</Text><Text style={styles.value}>{data.equipmentOwner || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Equipment:</Text><Text style={styles.value}>{data.equipmentName || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Manufacturer:</Text><Text style={styles.value}>{data.manufacturer || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Serial Number:</Text><Text style={styles.value}>{data.serialNumber || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>ASSET NO:</Text><Text style={styles.value}>{data.assetNumber || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Environmental Conditions:</Text><Text style={styles.value}>{data.ambientTemperature || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Calibration Date:</Text><Text style={styles.value}>{data.calibrationDate || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Next Due Date:</Text><Text style={styles.value}>{data.nextDueDate || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Location:</Text><Text style={styles.value}>{data.location || 'N/A'}</Text></View>
      </View>

      {/* Reference Instrument Table */}
      <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>STANDARD INSTRUMENT USED:</Text>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableColHeader, { width: '30%' }]}>Description</Text>
          <Text style={[styles.tableColHeader, { width: '20%' }]}>Model</Text>
          <Text style={[styles.tableColHeader, { width: '20%' }]}>Serial No.</Text>
          <Text style={[styles.tableColHeader, { width: '15%' }]}>Cal Date</Text>
          <Text style={[styles.tableColHeader, { width: '15%', borderRightWidth: 0 }]}>Next Due</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCol, { width: '30%' }]}>{data.refInstrumentMake || 'N/A'}</Text>
          <Text style={[styles.tableCol, { width: '20%' }]}>{data.refInstrumentModel || 'N/A'}</Text>
          <Text style={[styles.tableCol, { width: '20%' }]}>{data.refSerialNumber || 'N/A'}</Text>
          <Text style={[styles.tableCol, { width: '15%' }]}>{data.refCalDate || 'N/A'}</Text>
          <Text style={[styles.tableCol, { width: '15%', borderRightWidth: 0 }]}>{data.refDueDate || 'N/A'}</Text>
        </View>
      </View>

      <Text style={styles.remarkSection}>
        <Text style={{ fontWeight: 'bold' }}>Remark: </Text>
        Icon Lifting & Rigging Inspections Limited certifies that the pressure Safety Valve meets the rating specification as stated in all SCNL Procedure Specification and certified FIT for use.
      </Text>

    </Page>

    {/* ================= PAGE 2: CALIBRATION CERTIFICATE ================= */}
    <Page size="A4" style={styles.page}>
      
      {/* Top Branding & QR */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.companyName}>ICON</Text>
          <Text style={styles.companySubtext}>ICON LIFTING & RIGGING INSPECTIONS LIMITED</Text>
          <Text style={styles.companySubtext}>205 NTA/ Choba Road, Ozuoba, PHC.</Text>
        </View>
        {qrCodeUrl && <Image src={qrCodeUrl} style={styles.qrCode} />}
      </View>

      <View style={styles.docTitleContainer}>
        <Text style={styles.docTitle}>CALIBRATION CERTIFICATE</Text>
        <Text style={{ fontSize: 10, marginTop: 4 }}>Certificate Nº {data.certificateNumber || 'N/A'}</Text>
      </View>

      {/* Page 2 Data Layout */}
      <View style={[styles.gridContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <View style={{ width: '48%' }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>Equipment Information</Text>
          <View style={styles.row}><Text style={styles.label}>Customer:</Text><Text style={styles.value}>{data.equipmentOwner || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Equipment:</Text><Text style={styles.value}>{data.equipmentName || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Manufacturer:</Text><Text style={styles.value}>{data.manufacturer || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Serial No:</Text><Text style={styles.value}>{data.serialNumber || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>RANGE:</Text><Text style={styles.value}>{data.equipmentRange || 'N/A'}</Text></View>
        </View>
        <View style={{ width: '48%' }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>Environmental & Intervals</Text>
          <View style={styles.row}><Text style={styles.label}>Ambient Temp:</Text><Text style={styles.value}>{data.ambientTemperature || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Cal Date:</Text><Text style={styles.value}>{data.calibrationDate || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Due Date:</Text><Text style={styles.value}>{data.nextDueDate || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Ref. Instrument:</Text><Text style={styles.value}>{data.refInstrumentMake || 'N/A'}</Text></View>
        </View>
      </View>

      {/* Inspection Results Table */}
      <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>Calibration Data:</Text>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableColHeader, { width: '20%' }]}>TYPE</Text>
          <Text style={[styles.tableColHeader, { width: '20%' }]}>SERIAL NUMBER</Text>
          <Text style={[styles.tableColHeader, { width: '25%' }]}>RANGE</Text>
          <Text style={[styles.tableColHeader, { width: '20%' }]}>SET PRESSURE</Text>
          <Text style={[styles.tableColHeader, { width: '15%', borderRightWidth: 0 }]}>REMARK</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCol, { width: '20%' }]}>SAFETY VALVE</Text>
          <Text style={[styles.tableCol, { width: '20%' }]}>{data.serialNumber || 'N/A'}</Text>
          <Text style={[styles.tableCol, { width: '25%' }]}>{data.equipmentRange || 'N/A'}</Text>
          <Text style={[styles.tableCol, { width: '20%' }]}>{data.setPressure || 'N/A'}</Text>
          <Text style={[styles.tableCol, { width: '15%', borderRightWidth: 0 }]}>{data.calibrationRemark || 'N/A'}</Text>
        </View>
      </View>

      <Text style={styles.remarkSection}>
        Method: It has been tested using measurement standards traceable to the National Institute of Standards and Technology (NIST) accepted intrinsic standards of measurement. Any alteration to these records automatically invalidates the certificate.
      </Text>

      {/* Signature Blocks */}
      <View style={styles.signatureSection}>
        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine}></View>
          <Text style={styles.signatureText}>KELVIN ERAE</Text>
          <Text style={styles.signatureText}>Instrument Engineer</Text>
        </View>
        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine}></View>
          <Text style={styles.signatureText}>Approved by QA/QC</Text>
          <Text style={styles.signatureText}>Date: {data.calibrationDate || 'N/A'}</Text>
        </View>
      </View>

    </Page>
  </Document>
);
import { BlobStream } from 'blob-stream';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, renderToStream } from '@react-pdf/renderer';

// Define your document styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#000',
  },
  cell: {
    flex: 1,
    padding: 8,
  }
});

// Define the PDF document
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.title}>
        <Text>SPL/T MATE EXPENSE REPORT</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>Date</Text>
          <Text style={styles.cell}>Amount</Text>
          <Text style={styles.cell}>Payer</Text>
          <Text style={styles.cell}>Receiver</Text>
          <Text style={styles.cell}>Description</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>5/1/2024</Text>
          <Text style={styles.cell}>$ 7.50</Text>
          <Text style={styles.cell}>Adam</Text>
          <Text style={styles.cell}>Hudson</Text>
          <Text style={styles.cell}>Paper Towels</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default async function GET(req, res) {
  // Render the PDF to a stream


  return new Response(
    <MyDocument />,
    {
      status: 200,
      headers: { "Content-Type": "application/pdf" },
    },
  );
}

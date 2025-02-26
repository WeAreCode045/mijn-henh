
import { StyleSheet } from '@react-pdf/renderer';
import { AgencySettings } from '@/types/agency';

export const createStyles = (settings: AgencySettings) => StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: 'white',
  },
  section: {
    marginBottom: 20,
  },
  coverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  coverLogo: {
    width: 150,
    height: 50,
    objectFit: 'contain',
  },
  handwrittenText: {
    fontFamily: 'Helvetica',
    fontSize: 24,
    color: settings.secondaryColor || '#2a2a2a',
    fontStyle: 'italic',
  },
  coverFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: settings.primaryColor || '#9b87f5',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 32,
    color: 'white',
    fontWeight: 900,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
  },
  coverPrice: {
    fontSize: 28,
    color: 'white',
    fontWeight: 900,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 16,
    color: settings.primaryColor || '#1a1a1a',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#4a4a4a',
  },
  descriptionBlock: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 8,
    marginVertical: 15,
  },
  keyInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 20,
  },
  keyInfoBox: {
    width: '31%',
    padding: 15,
    backgroundColor: settings.primaryColor || '#40497A',
    borderRadius: 8,
    marginBottom: 10,
  },
  keyInfoLabel: {
    fontSize: 10,
    color: 'white',
    marginBottom: 4,
  },
  keyInfoValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 60,
  },
  gridImage: {
    width: '23%',
    height: 150,
    objectFit: 'cover',
    borderRadius: 8,
    aspectRatio: '4:3',
  },
  areaGridImage: {
    width: '31%', // Updated from 48% to 31% for 3-column layout
    height: 180, // Adjusted height to maintain aspect ratio
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 15,
  },
  fullWidthImage: {
    width: '100%',
    height: 400,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 15,
  },
  categoryBlock: {
    backgroundColor: settings.primaryColor || '#40497A',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    marginBottom: 15,
  },
  categoryTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeItem: {
    color: 'white',
    fontSize: 12,
    marginBottom: 5,
  },
  contactBlock: {
    width: '48%',
    padding: 20,
    backgroundColor: settings.primaryColor || '#40497A',
    borderRadius: 8,
    marginBottom: 20,
  },
  contactTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactInfo: {
    color: 'white',
    fontSize: 12,
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  headerLogo: {
    width: 120,
    height: 40,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
    borderTop: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
});

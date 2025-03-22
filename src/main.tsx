
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faMapMarker, 
  faPhone, 
  faEnvelope, 
  faHome,
  faBed,
  faBath,
  faCar,
  faCalendar,
  faRuler,
  faBolt
} from '@fortawesome/free-solid-svg-icons';

// Import the BlockNote CSS globally to ensure it's available throughout the app
import "@blocknote/react/style.css";

library.add(
  faMapMarker,
  faPhone,
  faEnvelope,
  faHome,
  faBed,
  faBath,
  faCar,
  faCalendar,
  faRuler,
  faBolt
);

createRoot(document.getElementById("root")!).render(<App />);

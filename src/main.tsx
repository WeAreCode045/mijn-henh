
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

// Note: BlockNote CSS is now imported directly in the DescriptionSection component

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


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

// We're having issues with the BlockNote CSS import, so let's try an alternative approach
// Instead of importing the CSS directly, we'll load it in the component that uses it

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

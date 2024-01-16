import ReactGA from 'react-ga';

const TRACKING_ID = 'UA-276967126-1'; // Replace with your tracking ID

export const initGAUniversal = () => {
  ReactGA.initialize(TRACKING_ID);
}

export const logPageViewUniversal = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

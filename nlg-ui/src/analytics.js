import ReactGA from "react-ga4";


const TRACKING_ID = 'G-J47SRPCZ5X';

export const initGA = () => {
    ReactGA.initialize(TRACKING_ID);
}

export const logPageView = () => {
    try {
        //ReactGA.set({ page: window.location.pathname });
       // ReactGA.pageview(window.location.pathname);
        ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: window.location.pathname });
    } catch (e) {
        console.error(e)
    }

}

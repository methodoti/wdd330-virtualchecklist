import { initSimBrief } from './SimBriefData.mjs';
import { initWeather } from './WeatherData.mjs';
import { initCheckList } from './ChecklistRender.mjs';
import { loadHeaderFooter } from './utils.mjs';

// load header and footer
loadHeaderFooter();

//init dummy functions
initSimBrief();
initWeather();
initCheckList();

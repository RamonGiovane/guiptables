import * as operations from './operations.js'; 
import conf from '../conf.js';

export class Settings {
    autoSave;
    savePath;
    logPath;
}

let settings;

export function loadConfigFile(){
    operations.loadConfigFile(conf.path, setConfiguration);
}

function setConfiguration(textContent){
    let s = JSON.parse(textContent);  
    settings = s;
}
export function getConfiguration(){
    return settings;
}

export function saveTableState(path){
    operations.runIptablesSave(path == null ? settings.savePath : path);
}

export function loadTableState(path, requireRefresh = null){
    operations.runIptablesRestore(
        path == null ? settings.savePath : path, requireRefresh);
}

export function saveChanges(settings){
    operations.saveConfig(settings, conf.path);
}

export function getConfPath(){
    return conf.path;
}
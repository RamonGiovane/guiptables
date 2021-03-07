import * as widgets from './widgets.js';
import * as consts from './constants.js';
import { reloadTableRules } from './rules.js';

let interfaceNames = []


export function authenticate(onSuccessCallback, onFailureCallback) {
    return cockpit.spawn(["ls", "/root/"], { err: "out" })
        .then(() => onSuccessCallback())
        .catch(() => onFailureCallback());
}

export function flush(table) {
    let response;

    cockpit.spawn(["iptables", "-t", table, "-F"], { err: "out" })
        .stream(res => widgets.errorMessage(consts.flushTable, res));

    return response;
}

export function getRuleIndex(table, chain, ruleNumber) {

    let arr = filterTableByChain(table, chain);

    let index = arr.findIndex(element => element.cells[1].textContent == ruleNumber);

    return index < 0 ? index : index + 1;
}

export function deleteRule(ruleData) {

    if (!ruleData || parseInt(ruleData.ruleIndexInChain) <= 0)
        widgets.errorMessage(consts.deleteRule, consts.invalidIndexMsg);

    cockpit.spawn(["iptables", "-t", ruleData.ruleTable,
        "-D", ruleData.ruleChain, ruleData.ruleIndexInChain], { err: "out" })
        .stream(res => widgets.errorMessage(consts.deleteRule, res))

}

export function getInterfaceNames() {

    if (interfaceNames.length > 0)
        return interfaceNames;

    cockpit.spawn(["ls", "/sys/class/net"])
        .then(res => interfaceNames = res.split("\n"))
        .catch(res => widgets.errorMessage(consts.loadSystemInt, res));
}

export function readFile(fileName) {
    let response;
    cockpit.spawn(["cat", fileName])
        .then(res => response = res)
        .catch(err => response = err)

    return response;
}



export function filterTableByChain(table, chain) {

    //Pega as linha da tabela (<tr> dentro do <tbody>) em forma de HTMLCollection
    let arr = Array.from(document.getElementsByClassName(`row-${table}-${chain}`));


    //Filtra e retorna apenas as linhas daquela tabela e daquela cadeia
    let a = arr.filter(function (element) {
        return element.textContent.includes(chain);
    });

    return a;
}

export function applyRule(ruleRecord, onSuccessCallback, autoSavePath = null) {
    let args = ["iptables", "-t", ruleRecord.table];

    if (ruleRecord.ruleBelow)
        args.push(...["-I", ruleRecord.chain, ruleRecord.ruleBelow]);
    else
        args.push(...["-A", ruleRecord.chain]);

    if (ruleRecord.outputInterface)
        args.push(...["-o", ruleRecord.outputInterface]);

    if (ruleRecord.inputInterface)
        args.push(...["-i", ruleRecord.inputInterface]);

    if (ruleRecord.protocol && ruleRecord.protocol != "all (default)") {
        args.push(...["-p", ruleRecord.protocol]);
        if (ruleRecord.protocolOptions) {
            let opt = ruleRecord.protocolOptions.split(" ");
            args.push(...opt);
        }
    }

    if (ruleRecord.source)
        args.push(...["-s", ruleRecord.source]);

    if (ruleRecord.destination)
        args.push(...["-d", ruleRecord.destination]);

    if (ruleRecord.action)
        args.push(...["-j", ruleRecord.action]);

    let gotError = false;
    cockpit.spawn(args, { err: "out" })
        .stream(

            res => {

                gotError = true;
                widgets.errorMessage("apply rule", "Command passed:<br>" + args.join(" ") + "<br>Error:<i> " + res + "</i>")
            })
        .always(() => {
            if (gotError == false) {
                onSuccessCallback();
                
                if(autoSavePath)
                    runIptablesSave(autoSavePath);
            }
        });

}

export function isIptablesInstalled(onTrueCallback, onFalseCallback) {
    let error = false;
    cockpit.spawn(["iptables", "-L"], { "error": "out" })
        .catch(() => error = true)
        .always(() => {
            if (error)
                onFalseCallback()
            else
                onTrueCallback()
        });
}


export function installIptables() {
    let error = false;
    widgets.raiseInstallationStart();
    cockpit.spawn(["yum", "-y", "install", "iptables"], { "error": "out" })
        .catch(() => error = true)
        .always(() => {
            if (error)
                widgets.raiseInstallationError();
            else
                widgets.raiseInstallationSuccess();
        });
}


export function loadConfigFile(configPath, onSuccessCallback) {


    cockpit.file(configPath).read()
        .done(function (content, tag) {
            if(content == null)
                 widgets.errorMessage("load configuration file.", 
                "Application may not work as expected.<br>File not found.");
            onSuccessCallback(content, tag)
        })
        .fail(function (error) {
            widgets.errorMessage("load configuration file.", 
            "Application may not work as expected.<br>" + error);
        });
}

export function runIptablesSave(path){

    cockpit.spawn(["iptables-save"], {"err" : "out"})
    .then((res) =>{
        
        saveRulesToPath(res, path);
    })
    .catch((res) =>{

            widgets.errorMessage("save tables state", "Error: " + res);
       
            
    });
}

function saveRulesToPath(content, path){
    cockpit.file(path).replace(content)
    .then((res) =>{
        widgets.okMessage("Success", "Tables state saved at: " + path);
    })
    .catch((res) =>{

        widgets.errorMessage("save tables state", "Error: " + res);
        
         
    });
}

export function runIptablesRestore(path, requireRefresh){
    
    let errorMessage;
    cockpit.spawn(["iptables-restore", path], {"err" : "out"})
    .stream((res) =>{
       
        errorMessage = res;
        
    })
    .always((res) =>{
        if(errorMessage)
            widgets.errorMessage("load tables state", "Error: " + errorMessage);
        else
            if(requireRefresh)
            widgets.loadModal("Tables state restored from " + path);
            
    });
}

export function saveConfig(config, path){

    let str = JSON.stringify(config).split('\",\"').join('\",\n\"');
    cockpit.file(path).replace(str)
    .then(() =>{       
        
        widgets.okMessage("Settings saved", "Configurations stored at " + path);
    })
    .catch((res)=>{
        widgets.errorMessage("save settings", "Error: " + res)
    });
}






// verificar se um caminho existe

// salvar regras com iptables-save

// carregar regras com iptables-restore

// criar pagina de logs

// criar pacote do programa

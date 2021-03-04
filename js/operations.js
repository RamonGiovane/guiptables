import * as widgets from './widgets.js';

let interfaceNames = []

let chains = 
    {
        "filter" : ["Show all", "INPUT", "FORWARD", "OUTPUT"],
        "nat" : ["Show all", "INPUT", "OUTPUT", "PREROUTING", "POSTROUTING"],
    }

export default class RuleData{
    ruleNumber;
    ruleChain;
    ruleTable;
    ruleIndexInChain;
}


export function flush(table){
    let response;
    
    cockpit.spawn(["iptables", "-t", table, "-F"], {err : "out"})
    .stream(res=>  widgets.errorMessage("flush table", res));

    return response;
}

export function getRuleIndex(table, chain, ruleNumber){
    
    let arr = filterTableByChain(table, chain);

    let index = arr.findIndex(element => element.cells[1].textContent == ruleNumber);
    
    return index < 0 ? index : index + 1; 
}

export function getChains(table){
    return chains[table];
}
export function deleteRule(ruleData){

    if(!ruleData || parseInt(ruleData.ruleIndexInChain) <=  0)
        alert("Error: Rule not found (rule index is invalid).");

    cockpit.spawn(["iptables", "-t", ruleData.ruleTable,
         "-D", ruleData.ruleChain, ruleData.ruleIndexInChain], {err : "out"})
    .stream(res=>   widgets.errorMessage("delete rule", res))

}

export function getInterfaceNames(){

    if(interfaceNames.length > 0)
        return interfaceNames;

    cockpit.spawn(["ls", "/sys/class/net"])
        .then(res=>   interfaceNames = res.split("\n"))
        .catch(res => widgets.errorMessage("load system interfaces", res));
}

export function readFile(fileName){
    let response;
    cockpit.spawn(["cat", fileName])
    .then(res=>  response = res)
    .catch(err=> response = err)

    return response;
}



export function filterTableByChain(table, chain){

    //Pega as linha da tabela (<tr> dentro do <tbody>) em forma de HTMLCollection
    let arr = Array.from(document.getElementsByClassName(`row-${table}-${chain}`));
    
     
    //Filtra e retorna apenas as linhas daquela tabela e daquela cadeia
    let a = arr.filter(function(element){
         return element.textContent.includes(chain);
     });

     debugger
     return a;
}

export default class RuleData{
    ruleNumber;
    ruleChain;
    ruleTable;
    ruleIndexInChain;
}

export function flush(table){
    cockpit.spawn(["iptables", "-t", table, "-F"])
    .then(res=>  console.log("All rows deleted on table " + table))
    .catch(err=> alert(err))
}

export function getRuleIndex(table, chain, ruleNumber){
    
    let arr = filterTableByChain(table, chain);

    let index = arr.findIndex(element => element.cells[0].textContent == ruleNumber);
    
    return index < 0 ? index : index + 1; 
}

export function deleteRule(ruleData){

    if(!ruleData || parseInt(ruleData.ruleIndexInChain) <=  0)
        alert("Error: Rule not found (rule index is invalid).");

    cockpit.spawn(["iptables", "-t", ruleData.ruleTable,
         "-D", ruleData.ruleChain, ruleData.ruleIndexInChain])
    .then(res=>  console.log("Rule deleted on " + ruleData.ruleTable))
    .catch(err=> alert("Error: Rule not found (rule may be deleted already).\nDetails: " + err))

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

     return a;
}
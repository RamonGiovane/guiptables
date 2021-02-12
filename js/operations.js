export default class RuleData{
    ruleNumber;
    ruleChain;
    ruleTable;
    ruleIndexInChain;
}

export function flush(table){
    cockpit.spawn(["/usr/sbin/iptables", "-t", table, "-F"])
    .then(res=>  alert("All rows deleted on table " + table))
    .catch(err=> alert(err))
}

export function getRuleIndex(table, chain, ruleNumber){
    let arr = filterTableByChain(table, chain);
    
    return arr.findIndex(element => element.split(" ")[0] == ruleNumber);

}

export function deleteRule(ruleData){


   
  
    cockpit.spawn(["/usr/sbin/iptables", "-t", ruleData.ruleTable,
         "-D", ruleData.ruleChain, ruleData.ruleIndexInChain])
    .then(res=>  alert("Rule deleted on " + ruleData.table))
    .catch(err=> alert(err))


}



export function filterTableByChain(table, chain){

    //Pega as linha da tabela (<tr> dentro do <tbody>) em forma de HTMLCollection
    let arr = Array.from(document.getElementsByClassName(`row-${table}-${chain}`));
    
     
    //Filtra e retorna apenas as linhas daquela tabela e daquela cadeia
    let a = arr.filter(function(element){
         return element.textContent.includes(chain);
     });

     alert(a.length);

     return a;
}

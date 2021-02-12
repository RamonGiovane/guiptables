import RuleData from "./operations.js";
import * as operations from './operations.js'

/**Runs 'iptables -t [table] -L -v' and fills the HTML table with the response
 * With this command is possible to fetch general info of the 
 * rules set on each iptables layer.
 */


 export function addRulesInTable(){
    
    
    
    cockpit.spawn(["/usr/sbin/iptables", "-t", "nat", "-n", "-L", "-v"])
    .then(res=>  processResponse(res, "nat"))
    .catch(err=> alert(err))
   
    cockpit.spawn(["/usr/sbin/iptables", "-t", "filter", "-n", "-L", "-v"])
    .then(res=>  processResponse(res, "filter"))
    .catch(err=> alert(err))

}

function splitChainName(element){
    return element.split(" ")[1];
}

function processResponse(data, table)
{

    let text = data.split("\n");

    let hasContent = false;
    
    let i = 0;
    
    let chainName;

    text.forEach(element => {
        

        if(element.startsWith("Chain")){
            chainName = splitChainName(element);
            return;
        }
            
        if(element.startsWith(" pkts"))
            return;

        if(!element)
            return;

        hasContent = true;
        
        splitRowAndSetRule(element, table, chainName, i+1)
        
        i++;


    });

    if(!hasContent){
        fillEmptyTable(table)
    }

}

function splitRowAndSetRule(rule, table, chainName, ruleNumber){
    
    //Uma linha com regras se torna um array
    let text = rule.trim().split(/[ ,]+/);
    
    text = checkMissingColumns(text);

    //Accessa a tag html
    let tableRow = document.getElementById(table + "-rules-table");

    //Inicializa a linha com a primeira coluna, o numero da regra
    let cols = `<td>${ruleNumber}</td>`;
    
    let i = 0;
    
    let destination = ""

    //Cria as colunas de uma linha
    text.forEach(element => {
        
        //Montando a coluna 'Destination' que as vezes é composta 
        //por varias palavras e pode ter sido quebrada em fragmentos
        if(i >= 8){
            destination += formatColumn(element);
            destination += "      ";
        }

        else {
            //Inserindo uma coluna
            cols +=
            `
                <td>
                    ${formatColumn(element)}
                </td>
            `;
        }
        
        i++;

        //Inserindo a coluna Chain
        if(i == 2){
            cols +=
            `
                <td>
                    ${chainName}
                </td>
            `;
        }


    });

    //Adiciona por fim a coluna 'Destination'
    cols += `<td>${destination}</td>`


    //Cria a tag de linha propriamente dita
    let tr = document.createElement("tr");

    
    //Insere o conteudo da colunas na linha
    tr.innerHTML =
           
        `
            <tr>
                ${cols}
            </tr>
        `
    
    //Adiciona o botao de excluir 
    tr.appendChild(createDeleteButton(table, chainName, ruleNumber));

    //Insere a linha no HTML
    tableRow.appendChild(tr);   
}

function createDeleteButton(table, chainName, ruleNumber){
   
   let td = document.createElement("td");
   td.id = `delete-${table}-${chainName}-${ruleNumber}`; 
   
   let icon = document.createElement("i");
   icon.className = "fa fa-trash";
   icon.ariaHidden = "true;"
   icon.addEventListener("click", () => deleteButtonListener(td.id));
   
   td.appendChild(icon);

   return td;
}

function deleteButtonListener(id){
    
    let rule = extractRuleFromId(id);
    operations.deleteRule(rule);
}

function extractRuleFromId(id){
    
    let rule = new RuleData();

    //delete-${table}-${chainName}-${ruleNumber}"
    let data = id.split("-");
 
    rule.table = data[1];
    rule.ruleChain = data[2];
    rule.ruleNumber = data[3];
    rule.ruleIndexInChain = operations.getRuleIndex(rule.table, rule.ruleChain, rule.ruleNumber);

    return rule;
}

function checkMissingColumns(arr){
   

    ///
    ///Checking if target is missing
    let copy = arr.slice(0, 3);
    
    if(copy[2] == "all" || copy[2] == "tcp" || copy[2] == "udp")
        arr.splice(2, 0, "--");

    ///
    ///

    return arr;

}

function formatColumn(element){
    
    if(element == "*")
        return "any"
    
    if(element == "0.0.0.0/0")
        return "anywhere";
    
    return element;

}

function fillEmptyTable(table){

    //Accessa a tag html
    let tableRow = document.getElementById(table + "-rules-table");
    
    let tr = document.createElement("tr");
   
    //Insere o conteudo da colunas na linha
    tr.innerHTML =
           
        `
            <tr>
               <td colspan="12">No active rules</td>
            </tr>
        `
    
    tableRow.appendChild(tr);
    
}


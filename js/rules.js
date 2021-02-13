import RuleData from "./operations.js";
import * as operations from './operations.js'
import * as widgets from './widgets.js'

/**Runs 'iptables -t [table] -L -v' and fills the HTML table with the response
 * With this command is possible to fetch general info of the 
 * rules set on each iptables layer.
 */
 export function addRulesInTable(){
    
    loadTableRules("nat");

    loadTableRules("filter");
}

/**Runs 'iptables -t [table] -F' which deletes all table rows then
 * reloads the table HTML.
 */
export function flushTable(table){
    operations.flush(table);
    reloadTableRules(table);
}

function loadTableRules(table){
    cockpit.spawn(["iptables", "-t", table, "-n", "-L", "-v"])
    .then(res=>  processResponse(res, table))
    .catch(err=> alert(err))
   
}

function reloadTableRules(table){

    //Destroying rules
    let rules = document.getElementById(table + "-rules-table");
  
    
    let children = rules.childNodes;
    
    for(let i = children.length -1; i >=0; i--)
        children[i].remove();
 
    
    loadTableRules(table);
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

    tr.className = `row-${table}-${chainName}`

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


   let dataToogle = document.createAttribute("data-toggle");
   dataToogle.value = "modal";

   
   let dataTarget = document.createAttribute("data-target");
   dataTarget.value = "#dangerModal";

   icon.setAttributeNode(dataToogle);
   icon.setAttributeNode(dataTarget);

   icon.addEventListener("click", () => 
    widgets.dangerModal("Delete rule", () => deleteButtonListener(td.id)));
   
   td.appendChild(icon);

   return td;
}

function deleteButtonListener(id){
    
    let rule = extractRuleFromId(id);
    operations.deleteRule(rule);
    reloadTableRules(rule.ruleTable);
}

function extractRuleFromId(id){
    
    let rule = new RuleData();

    let data = id.split("-");
    
    rule.ruleTable = data[1];
    rule.ruleChain = data[2];
    rule.ruleNumber = data[3];
    rule.ruleIndexInChain = operations.getRuleIndex(rule.ruleTable, rule.ruleChain, rule.ruleNumber);

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


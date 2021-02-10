
/**Runs 'iptables -t [table] -L -v' and fills the HTML table with the response
 * With this command is possible to fetch general info of the 
 * rules set on each iptables layer.
 */
export function addRulesInTable(){
    
    cockpit.spawn(["/usr/sbin/iptables", "-t", "nat", "-L", "-v"])
    .then(res=>  processResponse(res, "nat"))
    .catch(err=> alert(err))
   
    cockpit.spawn(["/usr/sbin/iptables", "-t", "filter", "-L", "-v"])
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
        
        splitAndSetRule(element, table, chainName, i+1)
        
        i++;

        console.log(element);

    });

    if(!hasContent){
        fillEmptyTable(table)
    }

}

function splitAndSetRule(rule, table, chainName, ruleNumber){
    
    //Uma linha com regras se torna um array
    let text = rule.trim().split(/[ ,]+/);
    
    //Accessa a tag html
    let tableRow = document.getElementById(table + "-rules-table");

    let rows = `<td>${ruleNumber}</td>`;
    
    let i = 0;
    
    //Cria as colunas de uma linha
    text.forEach(element => {
        
        //Inserindo uma coluna
        rows +=
        `
            <td>
                ${element}
            </td>
        `;

        i++;

        //Inserindo a coluna Chain
        if(i == 2){
            rows +=
            `
                <td>
                    ${chainName}
                </td>
            `;
        }

        

    });

    //Cria a tag de linha propriamente dita
    let tr = document.createElement("tr");
   
    console.log(rows);
    //Insere o conteudo da colunas na linha
    tr.innerHTML =
           
        `
            <tr>
                ${rows}
                <td><i class="fa fa-trash" aria-hidden="true"></i></td>
            </tr>
        `
    
    //Insere a linha no HTML
    tableRow.appendChild(tr);   
}

function fillEmptyTable(table){

    //Accessa a tag html
    let tableRow = document.getElementById(table + "-rules-table");
    
    let tr = document.createElement("tr");
   
    //Insere o conteudo da colunas na linha
    tr.innerHTML =
           
        `
            <tr>
               <td colspan="10">No active rules</td>
            </tr>
        `
    
    tableRow.appendChild(tr);
    
}

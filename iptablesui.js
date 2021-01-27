function fillEmptyTable(table){
    //Accessa a tag html
    tableRow = document.getElementById(table + "-rules-table");
    
    tr = document.createElement("tr");
   
    //Insere o conteudo da colunas na linha
    tr.innerHTML =
           
        `
            <tr>
               <td colspan="9">No active rules</td>
            </tr>
        `
    
    tableRow.appendChild(tr);
    
}


function splitRule(rule, table){
    
    //Uma linha com regras se torna um array
    text = rule.trim().split(/[ ,]+/);
    
    //Accessa a tag html
    tableRow = document.getElementById(table + "-rules-table");

    rows = ""
    //Cria as colunas de uma linha
    text.forEach(element => {
        rows +=
        `
            <td>
                ${element}
            </td>
        `;
    });

    //Cria a tag de linha propriamente dita
    tr = document.createElement("tr");
   
    console.log(rows);
    //Insere o conteudo da colunas na linha
    tr.innerHTML =
           
        `
            <tr>
                ${rows}
            </tr>
        `
    
    //Insere a linha no HTML
    tableRow.appendChild(tr);
  

 
   

    
}

function fillRules(data, table)
{

    text = data.split("\n");

    hasContent = false;
    
    text.forEach(element => {
        
        

        if(element.startsWith("Chain"))
            return;
        if(element.startsWith(" pkts"))
            return;

        if(!element)
            return;

        hasContent = true;
        splitRule(element, table)
        console.log(element);

    });

    if(!hasContent){
        fillEmptyTable(table)
    }

}


function runIptables()
{
    cockpit.spawn(["/usr/sbin/iptables", "-t", "nat", "-L", "-v"])
    .then(res=>  fillRules(res, "nat"))
    .catch(err=> alert(err))
   
    cockpit.spawn(["/usr/sbin/iptables", "-t", "filter", "-L", "-v"])
    .then(res=>  fillRules(res, "filter"))
    .catch(err=> alert(err))
   

}

runIptables();
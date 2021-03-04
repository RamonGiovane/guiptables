
import * as bootstrap from './../bootstrap/bootstrap.min.js';

export function dangerModal(title, confirmCallback){
            
    document.getElementById("danger-modal-title").innerText = title;
    document.getElementById("danger-confirm-button").onclick = confirmCallback;    

}

export function ruleModal(interfaceNames, table, chain = null) {
    
    table = table.toLowerCase();

    if (chain == null)
        chain = document.getElementById(table + "-chain-menu").value;



    loadRuleModal("Add new rule", table, chain, interfaceNames, null);
}

function loadRuleModal(title, table, chain, interfaces, applyCallback){

    let interfacesOptionsHTML = "";
    
    interfaces.forEach(i => {
        
        if(!i) return;

        interfacesOptionsHTML += 
        `
        <option value="${i}-item">${i}</option>
        `
    });

    if(table == "nat")
        table = table.toUpperCase();
    else
        table =  table.charAt(0).toUpperCase() + table.substring(1);

    document.getElementById("rule-modal-title").innerText = title;
    document.getElementById("badge-table").innerText = "Table: " + table;
    document.getElementById("badge-chain").innerText = "Chain: " + chain;
    document.getElementById("rule-confirm-button").onclick = applyCallback; 
    document.getElementById("intput-interface-rule-menu").innerHTML = interfacesOptionsHTML;
    document.getElementById("output-interface-rule-menu").innerHTML = interfacesOptionsHTML;
 
    
}

export function cancelRuleModal(){
    let modal = document.getElementById("ruleModal");

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('style', 'display: none');
}




export function errorMessage(operationTried, message){
 debugger
    let div = document.createElement("div");
    div.className = "alert alert-danger";
    div.innerHTML =
    `
    <span class="pficon pficon-error-circle-o"></span>
    <strong>Failed to ${operationTried}</strong>. ${message} 
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">Close</button>
    `;

    let board = document.getElementById("message-board");

    board.appendChild(div);

}

export function tableMessage(table, message){
   
    let msg = document.getElementById(table + "-message");

    msg.innerHTML = `<strong>${message}</strong>`;

}

export function hideTableMessage(table){
   
    let msg = document.getElementById(table + "-message");

    if(msg != null)
        msg.innerHTML = "";
}

export class Chain{
    filerChains = [];
    natChains = [];
}

/**Runs 'iptables -t [table] -S'.
 * With this command is possible the chain names of each applied 
 * rule on each iptables layer.
 */
export function getChainData(){
    
    let c = new Chain();
    
    cockpit.spawn(["/usr/sbin/iptables", "-t", "nat", "-S"])
    .then(res=>  c.natChains = extractChainArray(res))
    .catch(err=> alert(err))
    
    cockpit.spawn(["/usr/sbin/iptables", "-t", "filter", "-S"])
    .then(res=>  c.filterChains = extractChainArray(res))
    .catch(err=> alert(err))

    return c;
}

function extractChainArray(text){
   
    let chainArray = []
    
    let lines = text.split("\n");
   
    lines.forEach(lin => {
        
        if(lin.startsWith("-P"))
            return;
       
        
        let cols = lin.split(" ");

        //Adiciona o nome da cadeia daquela linha
        if(cols.length >= 2)
          chainArray.push(cols[1])
        
    });

    return chainArray;
}

import * as widgets from './widgets.js';
import * as config from './config.js';

export function logData(commandArr, operationTried, operationResult, resultMessage){

    //format result message
    if(resultMessage)
        resultMessage = resultMessage.replace("`", "'");

    cockpit.spawn(["date", "+\"%F %T\""])
    .then((date) =>{       
        
        let str = 
            date + `Trying to: ${operationTried}\n#${commandArr.join(" ")}`;
        
        str += `\n${operationResult ? "OK" : "ERR"}! ${resultMessage}\n-`;

        writeLogData(str);
    });
}

export function writeLogData(txt){
    cockpit.script(`echo "${txt}" >> ${config.getConfiguration().logPath}`, {"err":"out"} )
    .stream(err => widgets.errorMessage("write log file", err));
}

export function loadLogs(){
    //create file if doesn't exist
    cockpit.script(`if [[ ! -w ${config.getConfiguration().logPath
        } ]]; then touch ${config.getConfiguration().logPath}; fi`)
    .then( () =>{
        //read file
        cockpit.script(`cat ${config.getConfiguration().logPath}`)
        .then((res) =>{
            debugger
            widgets.logModal(res.split("\n-\n"))
        })
        .catch(err => widgets.errorMessage("load log file", err))
    }).catch(err => widgets.errorMessage("load log file", err));
}
    


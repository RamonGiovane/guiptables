# guiptables


### 🇧🇷 [Manual em Português](#instruções) 🔗
_Uma interface gráfica para o Firewall do Linux, Iptables. Feito usando Cockpit para CentOS._

### :us: [English Manual](#instructions) 🔗
_A Graphic User Interface for Linux's Iptables Firewall. Made with Cockpit for CentOS._

## Instruções

## 1. Instalando o _guiptables_
Acesse a seção de [**Releases**](https://github.com/RamonGiovane/guiptables/releases) e opte por baixar um pacote binário executável ou o código fonte diretamente;

### Usando o pacote binário
Atualmente, apenas pacotes rpm para sistemas RHEL-like estão disponíveis.
Depois de baixado o pacote, basta executar:

    rpm -i guiptables<versao>.rpm


### Usando o código fonte
Se você não utiliza um sistema RHEL-like, essa é a maneira mais fácil.
Não é preciso compilar nenhum código, mas é necessário que você já tenha as seguintes dependências instaladas:

```yml
- Cockpit >= 224.2
- bash
- yum (opcional, usado para instalar o Iptables no caso de não estar)
```

Depois de instalar o Cockpit e baixar o código fonte, basta copiar a pasta do repositório para o diretório de aplicativos desenvolvidos para Cockpit:
```bash
cp -r guiptables/ /usr/share/cockpit/
```



## 2. Instalando o _Iptables_ via Cockpit

Soaria incomum, mas caso o Iptables não esteja instalado, você poderia fazê-lo via Cockpit ao executar o _guiptables_ pela primeira vez:

![image](https://user-images.githubusercontent.com/40267373/111898685-61ca0b00-8a06-11eb-9136-0f0be660babe.png)

Após a instalação você será solicitado para recarregar a página. 

Nota: isso não funcionará se você não possuir o **yum** instalado.

## 3. Listando as regras

A interface básica do _guiptables_ é mostrar as regras aplicadas nas tabelas do firewall.

![image](https://user-images.githubusercontent.com/40267373/111898858-575c4100-8a07-11eb-92c3-d510056f3ec6.png)

Cada regra aplicada aparecerá em sua respectiva tabela, numa linha com um conjunto de informações:

- Quantidade de pacotes trafegados
- Porção de dados trafegados
- Cadeia em que pertence (chain)
- Ação que desempenha (job/action/target)
- Os protocolos que se aplicam
- Opções avançadas
- Interface de entrada
- Interface de saída
- Endereço de entrada
- Endereço de saída


**Todas as regras mostradas são recuperadas da memória do sistema. Isso significa que regras aplicadas fora do _guiptables_ também serão exibidas.**

Por padrão, são exibidas todas as regras de uma tabela **(Show all)**, mas é possível filtrar pela **cadeia (chain)**, usando o dropdown no topo da tabela de maneira que mostre como o Iptables exibiria em linha de comando.

## 4. Adicionando uma regra
  ### Nova regra
  Para criar uma nova regra, primeiro é preciso escolher uma das cadeias disponíveis para a tabela no dropdown. Em seguida, clicar no botão azul **➕ Add rule**.
  Uma janela será aberta com as opções disponíveis para que sua regra seja criada: 
  
  ![image](https://user-images.githubusercontent.com/40267373/109742540-fed71800-7bad-11eb-9571-b514ca7e001f.png)
  
  Ao clicar em aplicar, uma nova regra será adicionada no fim da tabela.
  Uma mensagem de erro será disparada, caso sejam aplicadas opções inválidas para a regra.
  
  ### Inserir nova regra em uma posição
  Como a ordem das regras é importante, você pode aplicar uma regra em uma ordem especifica.
  Para isso, escolha uma cadeia no dropdown, em seguida, clique no botão menor  **➕ Add rule** à esquerda de uma das regras da lista.
  
  Dessa forma você aplicaria uma nova regra sobre a regra escolhida.
  
  Ou seja, a nova regra ocupará a posição da regra escolhida. 
  
  A regra escolhida ficará um posição adiante, abaixo da nova regra.
    
 ## 5. Excluindo regras
 Para excluir uma regra, basta clicar no **botão de lixeira 🗑️** em vermelho na lista de regras, à direita.
 
 Você pode optar também por excluir TODAS as regras de TODAS as cadeias de uma tabela de uma vez. Basta clicar no botão **Flush Table 🗑️** acima da tabela desejada.
 
 ## 6. Salvando e carregando o estado das tabelas
 
 ### Criando um backup
 Você pode salvar o estado das tabelas em um arquivo de backup. 
 
 Essa opção usa internamente o comando **iptables-save**.
 
 Para  manualmente gravar o conteúdo atual das tabelas do serviço Iptables, basta ir nas **configurações** clicando no **botão de engrenagem ⚙️ azul**, no topo da página.
 
 Você pode especificar um caminho para salvar ou deixar o padrão. Em seguida, clique em **Save current state**.
 
![image](https://user-images.githubusercontent.com/40267373/111886608-be4d0c00-89ad-11eb-8d3c-d96d2fb936eb.png)


**Não confundir com o botão Save no canto inferior.**

O botão **Save** guardará as alterações feitas nessa tela de configuração, como o caminho de logs e a opção de auto-salvar.  

### A função auto-salvar
Você pode optar por auto-salvar o estado das tabelas no arquivo especificado, toda vez que uma regra for inserida.
Lembre-se que o arquivo não guardará histórico, será sempre **sobrescrito**.

### Restaurando um backup
Para restaurar um arquivo de backup, basta especifica-lo no mesmo campo e clicar no botão **Restore from this**.
Após isso será solicitado que a página seja recarregada.

 ## 7. Consultando logs
 Você pode checar as últimas operações realizadas dentro do _**guiptables**_ clicando no **botão com ícone de jornal 📰**.
 
 ### O que é salvo?
 Registra-se log, toda vez que:
  - uma regra for inserida ou deletada
  - um erro ocorreu tentando inserir ou deletar uma regra
  - uma tabela foi limpa (Flush table)
  - ocorreu um erro ao limpar uma tabela 
  - o Iptables foi instalado via Cockpit
  - ocorreu um erro ao instalar o Iptables
  - alterou-se o arquivo de configuração
  - ocorreu um erro ao alterar o arquivo de configuração

Você pode alterar o caminho em que o arquivo texto dos logs é salvo, **nas configurações ⚙️**.

<hr>

## Instructions

## 1. Installing _guiptables_
Access the [**Releases**](https://github.com/RamonGiovane/guiptables/releases) section and choose to download an executable binary package or the source code directly.

### Using the binary package
Currently, only rpm packages for RHEL-like systems are available.
Once the package has been downloaded, simply run:

     rpm -i guiptables<version>.rpm


### Using the source code
If you don't use a RHEL-like system, this is the easiest way.
You don't need to compile any code, but you must already have the following dependencies installed:

```yml
- Cockpit >= 224.2
- bash
- yum (optional, used to install Iptables in case it is not there)
```

After installing Cockpit and downloading the source code, simply copy the repository folder to the directory of applications developed for Cockpit:
```bash
cp -r guiptables/ /usr/share/cockpit/
```

## 2. Installing _Iptables_ via Cockpit

It would sound unusual, but if Iptables is not installed, you could do it via Cockpit when running _guiptables_ for the first time:

![image](https://user-images.githubusercontent.com/40267373/111898685-61ca0b00-8a06-11eb-9136-0f0be660babe.png)

After installation you will be asked to reload the page.

Note: this will not work if you don't have **yum** installed.

## 3. Rules list

The basic interface of _guiptables_ shows the rules applied in the firewall tables.
  
![image](https://user-images.githubusercontent.com/40267373/111898858-575c4100-8a07-11eb-92c3-d510056f3ec6.png)
  
Each applied rule will appear in its respective table, in a line with a set of information:

- Number of packets trafficked
- Portion of data trafficked
- Chain which it belongs
- Action it performs (job / action / target)
- The protocols that apply
- Advanced options
- Input interface
- Output interface
- Origin address
- Destination address


**All rules shown are retrieved from system memory. This means that any rule applied outside _guiptables_ will also be exhibited.**

By default, all the rules for a table are displayed, but it is possible to filter by **chain**, using the dropdown at the top of the table so that it shows how Iptables would display on the command line.

## 4. Adding a rule
  ### New rule at the end
  
  To create a new rule, you must first choose one of the available chains for the table at the dropdown. Then click on the blue **➕ Add rule** button.
  A window will open with the options available for your rule to be created:
  
  ![image](https://user-images.githubusercontent.com/40267373/109742540-fed71800-7bad-11eb-9571-b514ca7e001f.png)
    
  ### Insert new rule at position
  
  Since the order of the rules is important, you can apply a rule in a specific order.
  To do this, choose a chain from the dropdown, then click the smaller button **➕ Add rule** to the left of one of the rules in the list.
  
  That way you would apply a new rule over the chosen rule.
  
  That is, the new rule will occupy the position of the chosen rule.
  
  The chosen rule will be placed one position below the new rule.
    
## 5. Deleting rules

To delete a rule, simply click the red **trash can button 🗑️** in the list of rules on the right.
 
You can also decide to delete ALL rules from ALL chains in a table at once. Just click on the **Flush Table 🗑️** button above the desired table.
 
 ## 6. Saving and loading the tables state
 
 ### Creating a backup
 You may save the tables state in a external backup file.
 
 This option uses the **iptables-save** command internally.
 
 To manually store the current content of the tables, go to the **config.** screen by clicking on the **blue gear ⚙️ button** at the top of the page. 
 
 You may specify the save path or leave it with the default setting. Then, click on **Save current state**.
 
![image](https://user-images.githubusercontent.com/40267373/111886608-be4d0c00-89ad-11eb-8d3c-d96d2fb936eb.png)


**Do not confuse with the Save button at the bottom.**

The **Save** button will keep any changes made at this screen, such as log path or auto-save.

### Autosave feature
You may choose to autosave the tables state on the specified save file every time a new rule is added.
Just remember that the save file will not keep history, will be always **overwritten**.


### Recovering a backup file
In order to restore a save file, just specify it on the same Save path field and then click on **Restore from this**.
After that you will be requested to reload the page.

 ## 7. Checking logs
 You may check the last operations done inside  _**guiptables**_ by clicking on the **journal iconned button 📰**.
 
 ### What is logged?
 Log is recorded every time:
  - a rule is inserted or deleted
  - an error occurred while trying to insert or delete a rule
  - a table has been flushed
  - an error occurred while flushing a table
  - Iptables was installed via Cockpit
  - an error occurred while installing Iptables
  - the configuration file has been changed
  - an error occurred while saving chnages on the configuration file

**At the settings ⚙️**, you may change the path where the log text file is saved.




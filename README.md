# guiptables
A Graphic User Interface for Linux's Iptables Firewall. Made with Cockpit for CentOS 

Quando o usuario pediu para editar a ordem das regras, o programa pode fazer:
  - iptables save > file.txt # salva as regras num arquivo
  - abre o arquivo txt extrai as regras dessa tabela em ordem e salva elas num array na memoria. 
  - muda a ordem como solicitado
  - faz um flush na tabela atual
  - aplica as regras na ordem que esta no array na memoria
  - se falhar, faz um iptables restore file.txt
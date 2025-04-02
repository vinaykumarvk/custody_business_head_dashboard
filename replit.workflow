[deployment]
run = "./workflow.sh"
deploymentTarget = "vanish"

[[ports]]
localPort = 5000
externalPort = 80

[[ports]]
localPort = 4200
externalPort = 443

[management]
restartable = true
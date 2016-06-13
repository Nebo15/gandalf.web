# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
    config.vm.network "private_network", ip: "10.4.4.58"
    config.vm.network "forwarded_port", guest: 80, host: 8081
    config.vm.synced_folder "", "/www/nebo15.gandalf.web",
            owner: "vagrant", group: "vagrant"
    config.vm.provider "virtualbox" do |v|
      v.gui = false
      v.name = "gandalf.web"
      v.customize ["modifyvm", :id, "--memory", "512"]
      v.customize ["modifyvm", :id, "--cpuexecutioncap", "50"]
      v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
      v.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
      config.vm.provision "shell", inline: $virtualbox_script_app
    end
end

$virtualbox_script_app = <<SCRIPT
#!/bin/bash
set -o nounset -o errexit -o pipefail -o errtrace
trap 'error "${BASH_SOURCE}" "${LINENO}"' ERR
echo 127.0.0.1 front.gandalf.dev | sudo tee -a /etc/hosts
sudo /bin/bash /vagrant/puppet/initial/local/init.sh
SCRIPT

class swap(
  $ensure         = 'present',
  $swapfile       = '/mnt/swap.1', # Where to create the swapfile.
  $swapfilesize   = 1024 # Size in MB. Defaults to memory size.
) {
  if $ensure == 'present' {
    exec { 'Create swap file':
      command     => "/bin/dd if=/dev/zero of=${swapfile} bs=1M count=${swapfilesize}",
      creates     => $swapfile,
    }

    exec { 'Attach swap file':
      command => "/sbin/mkswap ${swapfile} && /sbin/swapon ${swapfile}",
      require => Exec['Create swap file'],
      unless  => "/sbin/swapon -s | grep ${swapfile}",
    }
  }
  elsif $ensure == 'absent' {
    exec { 'Detach swap file':
      command => "/sbin/swapoff ${swapfile}",
      onlyif  => "/sbin/swapon -s | grep ${swapfile}",
    }

    file { $swapfile:
      ensure  => absent,
      require => Exec['Detach swap file'],
    }
  }
}

node default {

  $host_name = "front.gandalf.dev"

  include stdlib
  include apt
  include git
  class {'swap' : }
  package { 'install uuid-runtime': name    => 'uuid-runtime',ensure  => installed, }
  package { "openssh-server": ensure => "installed" }

  file { ["/www", "/var/www", "/var/www/.ssh", "/var/log", "/var/log/www"]:
    ensure => "directory",
    owner  => "vagrant",
    group  => "vagrant",
    mode   => 755
  } ->

  file { "/etc/hostname":
    ensure  => present,
    owner   => root,
    group   => root,
    mode    => 644,
    content => "$host_name\n",
    notify  => Exec["set-hostname"],
  }

  exec { "set-hostname":
    command => "/bin/hostname -F /etc/hostname",
    unless  => "/usr/bin/test `hostname` = `/bin/cat /etc/hostname`",
  }

  class { 'nginx':
    daemon_user         => 'vagrant',
    worker_processes    => 4,
    pid                 => '/run/nginx.pid',
    worker_connections  => 4000,
    multi_accept        => 'on',
    events_use          => 'epoll',
    sendfile            => 'on',
    http_tcp_nopush     => 'on',
    http_tcp_nodelay    => 'on',
    keepalive_timeout   => '65',
    types_hash_max_size => '2048',
    server_tokens       => 'off',
  }

  exec { "apt-get update":
    command => "/usr/bin/apt-get update",
  } ->

  package { 'libnotify-bin':
    name    => 'libnotify-bin',
    ensure  => installed,
    require => Exec['apt-get update']
  } ->
  package { 'ruby-dev':
    name    => 'ruby-dev',
    ensure  => installed,
    require => Exec['apt-get update']
  } ->
  package { 'compass':
    ensure   => 'installed',
    provider => 'gem',
    require => Package['ruby-dev']
  }
  package { 'npm':
    name    => 'npm',
    ensure  => latest,
    require => Exec['apt-get update']
  } ->
  package { 'bower':
    provider => 'npm',
    require  => Package['npm']
  } ->
  package { 'gulp':
    provider => 'npm',
    require  => Package['npm']
  } ->
  package { 'n':
    provider => 'npm',
    require  => Package['npm']
  } ->
  exec { 'new-node':
    command => "/usr/local/bin/n v5.10.1"
  } ->
  file { '/usr/bin/npm':
    ensure => 'link',
    target => '/usr/local/n/versions/node/5.10.1/bin/npm',
  } ->
  file { '/usr/bin/node':
    ensure => 'link',
    target => '/usr/local/n/versions/node/5.10.1/bin/node',
  }
}

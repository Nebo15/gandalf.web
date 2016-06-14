node default {

  $host_name = "gndf.io"

  include stdlib
  include apt
  include git

  package { 'install uuid-runtime': name    => 'uuid-runtime',ensure  => installed, }
  package { "openssh-server": ensure => "installed" }

  service { "ssh":
    ensure  => "running",
    enable  => "true",
    require => Package["openssh-server"]
  }

  file_line { 'change_ssh_port':
    path   => '/etc/ssh/sshd_config',
    line   => "Port 2020",
    match  => '^Port *',
    notify => Service["ssh"]
  }
  class { 'nebo15_users': } ->
  file { ["/www", "/var/www", "/var/www/.ssh", "/var/log", "/var/log/www"]:
    ensure => "directory",
    owner  => "deploybot",
    group  => "deploybot",
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

  file { ["/etc/sudoers.d/deploybot"]:
    ensure => "directory",
    owner  => root,
    group  => root,
    mode   => 0440
  }->
  file { "/etc/sudoers.d/deploybot/first":
    content => "\
Cmnd_Alias        API_PUPPET = /usr/bin/puppet
Cmnd_Alias        API_SERVICE = /usr/bin/service
deploybot  ALL=NOPASSWD: API_PUPPET
deploybot  ALL=NOPASSWD: API_SERVICE
Defaults env_keep += \"FACTER_newrelic_key\"
",
    mode    => 0440,
    owner   => root,
    group   => root,
  } ->
  file { "/etc/sudoers.d/deploybot-user":
    content => "\
#includedir /etc/sudoers.d/deploybot
",
    mode    => 0440,
    owner   => root,
    group   => root,
  }


  exec { "set-hostname":
    command => "/bin/hostname -F /etc/hostname",
    unless  => "/usr/bin/test `hostname` = `/bin/cat /etc/hostname`",
  }

  class { 'nginx':
    daemon_user         => 'deploybot',
    worker_processes    => 4,
    pid                 => '/run/nginx.pid',
    worker_connections  => 1024,
    multi_accept        => 'on',
    events_use          => 'epoll',
    sendfile            => 'on',
    http_tcp_nopush     => 'on',
    http_tcp_nodelay    => 'on',
    keepalive_timeout   => '65',
    types_hash_max_size => '2048',
    server_tokens       => 'off',
    gzip                => 'off'
  } ->
  file { "/etc/nginx/conf.d/ssl.conf":
    content => "\
ssl_dhparam /etc/ssl/dhparam.pem;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA';
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 10m;
  ssl_prefer_server_ciphers on;
",
    mode    => 0440,
    owner   => root,
    group   => root,
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
    require  => Package['ruby-dev']
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

  file { "gandalf_config":
    path    => "/etc/nginx/sites-enabled/gandalf.web.conf",
    content => "
server {
    listen 80 default_server;
    server_name apps.gndf.io;
    rewrite ^/(.*)$ https://apps.gndf.io/\$1 permanent;
}
    server {
    listen 443 ssl;
    server_name apps.gndf.io;

    ssl_certificate      /etc/ssl/STAR_gndf_io.crt;
    ssl_certificate_key  /etc/ssl/STAR_gndf_io.key;
    ssl on;
    gzip on;
    gzip_types text/css text/plain application/javascript application/json;

    location / {
        root  /www/gandalf.web/current/www;
        index index.html;
        charset utf-8;
    }

    location ~ ^/api/(?<api_path>.*)$ {
        set \$proxy_host_name \"api.gndf.io\";
        set \$proxy_api_path \"/api/\";
        set \$proxy_host_scheme \"https\";

        resolver 8.8.8.8;
        proxy_set_header Host \$proxy_host_name;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Scheme \$scheme;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_pass \$proxy_host_scheme://\$proxy_host_name\$proxy_api_path\$api_path?\$query_string;
        proxy_redirect off;
    }

}
    ",
    notify  => Service["nginx"]
  }
}

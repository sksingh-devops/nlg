#!/bin/bash
# redirect stdout/stderr to a file
exec &> /var/log/bootscript.log

# sendmail fix for ubuntu
sed -i 's/# deb-src http:/deb-src http:/g' /etc/apt/sources.list
sed -i 's/# deb http:/deb http:/g' /etc/apt/sources.list
sed -e '/backports/ s/^#*/# /' -i /etc/apt/sources.list
#disable auto -upgrades
sed -i 's/APT::Periodic::Unattended-Upgrade "1";/APT::Periodic::Unattended-Upgrade "0";/g' /etc/apt/apt.conf.d/20auto-upgrades
#remove file for docker on plesk to work
rm -rf /etc/systemd/system/docker.service.d/godaddy.conf

export NYDUS_PATH=/opt/nydus
export NYDUS_BIN=${NYDUS_PATH}/pyvenv/bin
export NYDUS_CONSTRAINT=">=4.0.0,<7.0.0"
export REINSTALL_NYDUS_ONLY=false
export PASSWORD="1pv5oGDO7Y2BOaeE4PdOlmyN2gZB00"
[ -d ${NYDUS_PATH} ] && FIRST_TIME_SETUP=false || FIRST_TIME_SETUP=true

export_python() {
    if [ -x /opt/python38/bin/python3.8 ]; then
        PYTHON=/opt/python38/bin/python3.8
        PIP=/opt/python38/bin/pip3.8
    else
        PYTHON=/opt/python35/bin/python3.5
        PIP=/opt/python35/bin/pip3.5
    fi
    ${PYTHON} -V
    export PYTHON PIP
}

install_update_nydus() {
    getent group nydus >/dev/null || groupadd -r nydus
    getent passwd nydus >/dev/null || \
        useradd -r -g nydus -d ${NYDUS_PATH} -s /sbin/nologin \
        -c "Nydus service account" nydus
    install -o nydus -g nydus -d ${NYDUS_PATH} /var/log/nydus

    install -o root -g root -d /etc/nydus
    PIP_CONF=/etc/nydus/pip.conf
    cat > ${PIP_CONF} <<EOF2
[global]

index-url = https://hfs-public.secureserver.net/simple
extra-index-url =
    https://hfs-public.secureserver.net/simple
EOF2
    chmod 644 ${PIP_CONF}

    INSTALLER=${NYDUS_PATH}/install-nydus
    cat > ${INSTALLER} <<'INSTALLER_EOF'
#!/bin/bash
install -d ${NYDUS_PATH}/{bin,delayqueue,executor,ssl}
install -d ${NYDUS_PATH}/executor/{queue,store}

NYDUS_VENV=${NYDUS_PATH}/pyvenv
${PYTHON} -m venv ${NYDUS_VENV}
. ${NYDUS_VENV}/bin/activate

if [ "${PYTHON}" = "/opt/python35/bin/python3.5" ]; then
    PIP_CONFIG_FILE=/etc/nydus/pip.conf pip install --upgrade "pip==20.2.4" "jsonschema==2.6.0" "chardet==3.0.4" "primordial==1.4.0" "requests==2.24.0" "urllib3<1.26" "certifi==2020.6.20" "archon==4.5.2" "voluptuous==0.12.0" "wheel==0.35.1" "nydus${1}"
else
    PIP_CONFIG_FILE=/etc/nydus/pip.conf pip install --upgrade pip "nydus${1}"
fi

export INSTALL_PATH=${NYDUS_VENV}/lib/$(basename ${PYTHON})/site-packages/nydus
bash ${INSTALL_PATH}/scripts/post-install

touch ${NYDUS_PATH}/restart

cat > ${NYDUS_PATH}/README.TXT <<EOF
Nydus refers to a pair of agent applications (nydus-ex and nydus-ex-api) running on your server that communicate with the server dashboard, providing resource metrics and performing server operations you've requested. The agent listens on port 2224.

Because the server dashboard and upgrades rely on these applications, blocking port 2224 - or removing these applications from the server - stops these features from working.
EOF

INSTALLER_EOF
    chmod +x ${INSTALLER}
    sudo -u nydus -H NYDUS_PATH=${NYDUS_PATH} PYTHON=${PYTHON} -- ${INSTALLER} ${NYDUS_CONSTRAINT}
    ${NYDUS_BIN}/install-op customer-local-ops
}

update_sudoers() {
    mkdir -p /etc/sudoers.d
    chmod 750 /etc/sudoers.d
    cat > /etc/sudoers.d/nydus <<'EOF'
nydus ALL = (ALL) NOPASSWD: \
    /opt/nydus/pyvenv/lib/python3.8/site-packages/nydus/scripts/install-pkg *, \
    /*/systemctl status nydus-ex, \
    /*/systemctl start nydus-ex, \
    /*/systemctl stop nydus-ex, \
    /*/systemctl restart nydus-ex, \
    /*/systemctl status nydus-ex.service, \
    /*/systemctl start nydus-ex.service, \
    /*/systemctl stop nydus-ex.service, \
    /*/systemctl restart nydus-ex.service, \
    /*/service nydus-ex status, \
    /*/service nydus-ex start, \
    /*/service nydus-ex stop, \
    /*/service nydus-ex restart, \
    /*/mkdir -p /usr/lib/systemd/system, \
    /*/cp /opt/nydus/pyvenv/lib/python3.8/site-packages/nydus/daemon/agent/systemd/* /usr/lib/systemd/system/, \
    /*/chown root\: /usr/lib/systemd/system/nydus-*, \
    /*/chmod 644 /usr/lib/systemd/system/nydus-*, \
    /*/cp /opt/nydus/pyvenv/lib/python3.8/site-packages/nydus/daemon/agent/sysv/* /etc/rc.d/init.d/, \
    /*/chown root\: /etc/rc.d/init.d/nydus-*, \
    /*/chmod 755 /etc/rc.d/init.d/nydus-*

EOF
}

install_python() {
    wget https://hfs-public.secureserver.net/-/Ubuntu/20.04/python38_3.8.6-1_amd64.deb; apt-get update -y; apt-get install -y -f $PWD/python38_3.8.6-1_amd64.deb
    export_python
    date
    apt-get install -y -f -o Acquire::ForceIPv4=true sudo unzip
}

stop_nydus() {
    systemctl stop nydus-ex
    systemctl stop nydus-ex-api
}

uninstall_nydus() {
    rm -rf ${NYDUS_PATH}
}

enable_nydus() {
    systemctl enable nydus-ex
    systemctl enable nydus-ex-api
}

start_nydus() {
    systemctl start nydus-ex
    systemctl start nydus-ex-api
}

add_nydus_certs() {
    cat > /opt/nydus/ssl/executor.key <<'EOF2'
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEArky2mN9Y8CeuBWdlM724T/eB33MaZ3WkARbpv18ywP/xCczY
gbcxcI673lYGSh4adNahq9pqfyUlsYuHA3hyhbdHu1pKBde3s5lqziaiogb2JQmC
HOlEZRfN6uBj3jMN8QZuFEGb7N5G0kjgDZi9WGqzcBVzXjZpqXTkNL1O2CKHp+Y4
T5BVLq+rsigOSgDxtEeoeFAyX9hCIDODLGLGH/KPywdSUAL93n2cgnHetMcBbUEK
KyO6BLRPvIvuZbTr6Xjhpo5HgwGhi0BlYv9k799VEvDauj/tKLvUmnWAwk8OCODO
ozQL8i/+2av+5yhT+D+qHQM+9zdQxTVnZHULQwIDAQABAoIBAAHTJlZR8jheoH+U
ZHv6eDrpgP4Unjbo0V8r2DjBVxRpkUOqZBU46dOJ+rgZpcI1qy1G0xarygEDUzvn
kMc0UdvOthExNDnlLIwpy3zQ2gfQWEntFsxvZIs7z/SfnVdPZnOdJ04QpwoNwg+m
UgDaJFpgmkS7o0cIqAZtUXBReAbeF1NZNW6H35MfJouLr+fJii6bHFzCRLSXYbqe
KzSNRYVd6zxaaMLVb4G0+1ozDLx+bkEHumq4bf0vG1zCr1Oa/rHPovhwtD8WYuCq
HlBYNKHwaqGmeNZkBJjFVpH+GJazlq8jkFAyixeXl7Kt9BiNOYJOnLPsUzpvNuuf
tahe64ECgYEA3Te3mkiXsYaeOqsu6vwWSryCvI0RZ8jYqtk8oJsMxmmHIMI6FNNg
R0n0yYCYYE0Zu84LOIrB+DoALgGojTFCL8EG9gZqEtvbFW5qs80xu3I37L79daRs
8k1u+eW72gbeu44hMpqXMbkv6ngZ3J7r8GO8DwLBLA7z0Tslr0QLSMMCgYEAybR9
SWiJGJtXAx2JGX7j3ymyoygG3cDprd7+0+ZQ+emNB8aOPTk1nj2R+Iwkov6j3ZhH
ox/so/9fa0nf1JD9eWjcsmFTPoj/MMzDZFFBQgRa4WBXl7MNkcDzimKdM+B4GnaJ
uianKeubvJz7xcU1/S2Pc6hRk8uHMgHQnUR3C4ECgYAgPTF9w5yP262NoUr6Jfjd
tXFcJzblKCkjZPtn8JDBDboKtSOfy1pZqVaKUzphtnrMmu+Zsucn1NQX4Ff/E7Gw
ofHwwuiMjQv1qJzWTU41IiUyVHc9wNO70DsfIjLpSF0HemQuKsdkELgB9LTYKTT7
WJ2clmsuj5NK59LLIyB93wKBgHCsKwRTqameNJff6tLcJ+xkPY6YcGV1OtPOamjy
Ei/YP9ilGJWonIP9fsnpdxm5xs2lH/dGgQkHQUUMakUyjPVCF25poXegTXT0HP2v
yhVXm3CkQanS8nSF5UVbWtc8v7qAluTubJilLUTKKHZMeKEpzyVbU96MZcQQcXk4
YouBAoGAM2R4tqv2As+fMsjHkwFoLaRqk6Hz4UKUSsIfyTfjxV+AaNSCi5itfDGf
7LYM8ALXPsn2c3G24NZHQGzYbgdSQBvVs5pz+P0elmnVWP2VxH3Eh1GsIjtbqyUy
mLNuXXtpN7wELqovQG/AADIE6NggjK3SwdPyqN1KtTYqg88dIWs=
-----END RSA PRIVATE KEY-----

EOF2
chown nydus: /opt/nydus/ssl/executor.key
chmod 400 /opt/nydus/ssl/executor.key

cat > /opt/nydus/ssl/executor.crt <<'EOF2'
-----BEGIN CERTIFICATE-----
MIIEIzCCAwugAwIBAgIUA4JZTcs3r9jngpGTNJPXGsITB+UwDQYJKoZIhvcNAQEL
BQAwgY4xCzAJBgNVBAYTAlVTMRAwDgYDVQQIDAdBcml6b25hMRMwEQYDVQQHDApT
Y290dHNkYWxlMRowGAYDVQQKDBFHb0RhZGR5LmNvbSwgSW5jLjEQMA4GA1UECwwH
SG9zdGluZzEqMCgGA1UEAwwhTnlkdXMgQ3VzdG9tZXIgU2VydmljZXMgKFAzLVBS
T0QpMB4XDTIzMDcyNjE2NTg0M1oXDTMzMDcyMzE2NTg0M1owgYwxCzAJBgNVBAYT
AlVTMQswCQYDVQQIDAJBWjETMBEGA1UEBwwKU2NvdHRzZGFsZTEaMBgGA1UECgwR
R29EYWRkeS5jb20sIEluYy4xEDAOBgNVBAsMB0hvc3RpbmcxLTArBgNVBAMMJDAw
MGVlMzgzLWEzOTctNDAzNS1iNWU1LTQzM2UwMzg4NDZlZjCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBAK5MtpjfWPAnrgVnZTO9uE/3gd9zGmd1pAEW6b9f
MsD/8QnM2IG3MXCOu95WBkoeGnTWoavaan8lJbGLhwN4coW3R7taSgXXt7OZas4m
oqIG9iUJghzpRGUXzergY94zDfEGbhRBm+zeRtJI4A2YvVhqs3AVc142aal05DS9
Ttgih6fmOE+QVS6vq7IoDkoA8bRHqHhQMl/YQiAzgyxixh/yj8sHUlAC/d59nIJx
3rTHAW1BCisjugS0T7yL7mW06+l44aaOR4MBoYtAZWL/ZO/fVRLw2ro/7Si71Jp1
gMJPDgjgzqM0C/Iv/tmr/ucoU/g/qh0DPvc3UMU1Z2R1C0MCAwEAAaN5MHcwDAYD
VR0TAQH/BAIwADAOBgNVHQ8BAf8EBAMCBaAwFgYDVR0lAQH/BAwwCgYIKwYBBQUH
AwEwPwYDVR0RAQH/BDUwM6QxMC8xLTArBgNVBAMMJDAwMGVlMzgzLWEzOTctNDAz
NS1iNWU1LTQzM2UwMzg4NDZlZjANBgkqhkiG9w0BAQsFAAOCAQEAGxT4N7IKDhro
xl8H91YUHXVGdLl5RscRHp5NxnaVj/FwRRON2lCHGGrKt3u8z+d3LWyGEWuI4HW1
mDsmuwX1jnUJ1VNsd5XB4X7Mj5z2ELizO0SXj5i2twxV7d4zpHKBWkZEDhgLEy/w
PxdjgT13fiOl51hzwFM1CM+frU67D49XtGLhgJxDpQJS+8n/WXL9Fvq0w4NJZw13
eeTMjxtk5Fg9qVj8+52t7oydftv6n37DMQ7DDLZCbqYJSXW9w05PWQhukh8gFio3
n9QrJkEbQI+fysOCS7w7DFymka07RDlrWjnAnRVoCyj6KlQJJSO+Dbxp59vQSVkn
rtdqcOI9nQ==
-----END CERTIFICATE-----

EOF2
chown nydus: /opt/nydus/ssl/executor.crt
chmod 440 /opt/nydus/ssl/executor.crt

cat > /opt/nydus/ssl/client_ca.crt <<'EOF2'
-----BEGIN CERTIFICATE-----
MIIFJTCCAw2gAwIBAgIBAjANBgkqhkiG9w0BAQsFADCBjTELMAkGA1UEBhMCVVMx
EDAOBgNVBAgMB0FyaXpvbmExEzARBgNVBAcMClNjb3R0c2RhbGUxGjAYBgNVBAoM
EUdvRGFkZHkuY29tLCBJbmMuMRAwDgYDVQQLDAdIb3N0aW5nMSkwJwYDVQQDDCBO
eWR1cyBSb290IENlcnRpZmljYXRlIChQMy1QUk9EKTAiGA8yMDE2MDQwMTAwMDAw
MFoYDzIwNDEwNDAxMDAwMDAwWjCBiTELMAkGA1UEBhMCVVMxEDAOBgNVBAgMB0Fy
aXpvbmExEzARBgNVBAcMClNjb3R0c2RhbGUxGjAYBgNVBAoMEUdvRGFkZHkuY29t
LCBJbmMuMRAwDgYDVQQLDAdIb3N0aW5nMSUwIwYDVQQDDBxOeWR1cyBIRlMgU2Vy
dmljZXMgKFAzLVBST0QpMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
wLvXzbdnuhPLOMnEOPXOxTotGZFLb2kkaMmC4SX0ebudrh7vrFMgcI61qc/o2hk/
0eAlrfuKDti+cv3IezaF5lusHlD7yKiNU5/gAZMuEtjetPyctd7eNpvr9qQ8jSFN
0Z83uAyoafK3rH4QGyjqny0CwVTDBfTrGoG2XD9I+nrdfGDXmvAC3deNoceqb/Zt
ijAqo+eiR8/sxcNwR1RGmUNzhs36WBx4T0CWTF4ynXF9b5qd+HHWKbstgPOx++BI
JrDXgQm6mk+bMXQUDaImi/ZXghTXltCzsQo33mWUMTqC9NmHhKo9MqYZNQYbVMHy
KKHpaYCxI/or/0nFHQ+7iwIDAQABo4GNMIGKMA8GA1UdEwEB/wQFMAMBAf8wDgYD
VR0PAQH/BAQDAgEGMB0GA1UdDgQWBBThfjcWjqVtiKLNZzRLzFkIa2qKZjAnBgNV
HREEIDAeghxOeWR1cyBIRlMgU2VydmljZXMgKFAzLVBST0QpMB8GA1UdIwQYMBaA
FEdvcQS/Emaa9gxAniCaqwVImDuxMA0GCSqGSIb3DQEBCwUAA4ICAQAzNlkJdV03
a5lnfOoha9sx7U+g5KOZc62Y3Ct5ZL9gEhFgxsUNEJ2md5zdgUNTGRdXq7aCywn2
qUbHsibC8Nipdv3yzYloRbkYWbVKJNN6OrxJLXR+H71FDrPrburBWvTDTcRQpu8E
WWIFSgyhW7gyEWrhUYXQSeomTWaMb7OMEW/chcEDmSyNM/ctly3iccYS8c1G46Mb
qz3mvnnVohat9oenIXe3CrwNLGYoMqi0p8JSHdb0ysJ8q6n7E0lYSuuxKFI5Z73o
aY85+1ALYA7EodCb3+Ih1V9fsU6WGr7ElYqIv1ACptMJDzbKC6HY9Fmzr25l6TIq
nbKUoxljCezCNlRL06vDTKisreKVrn5S77zBTgqipmd4hqZW6MeRqDgpnPVubHit
P+EhrNN8gO5/lU9QuYmiHnzA2ZXlfV/By0OA9/D3GtBMxYO5UXsWLdtz96zTJMfr
ukfg1CxC3rqn1Z4tAQmY5c2plBGip0c3nDOS+Du8N3FRcGr15Csbno821QwAJ9aJ
XEQ+2CjUiKxkxOu6pjfhl+dMgwmSebUol1cgu1DulhHhCkr7kqoRILP2VEcSLjrq
ImeTioNN52SJGNQHu0vjQPX8l8apWbk/ib8teij58PrOtjMQOD1OJNGD4JxTav7b
hgkvqHG0DOi5z9pdxyFPCXxB4tMZ99YMRA==
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
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
gA==
-----END CERTIFICATE-----


EOF2
chown nydus: /opt/nydus/ssl/client_ca.crt
chmod 440 /opt/nydus/ssl/client_ca.crt
}

clear_motd() {
    # clear motd for OVH issue
    echo "" > /etc/motd
}

verify_network() {
    #verify network is up
    networkUp=false
    while [ $networkUp == false ]; do
        wget -q --tries=10 --timeout=20 --spider http://google.com
        if [[ $? -eq 0 ]]; then
            echo "Online"
            networkUp=true
        else
            echo "Offline"
            sleep 1
        fi
    done
}

install_sysstat() {
    # Install sysstat for usagestats
    apt-get install -y -f -o Acquire::ForceIPv4=true sysstat
}

update_cloud_init_config() {
    if [ -f /etc/cloud/cloud.cfg ]; then
        # Disable automatic hostname update to preserve hostname of VMs created from snapshots
        sed -i -e /update_hostname/d /etc/cloud/cloud.cfg
        sed -i -e /set_hostname/d /etc/cloud/cloud.cfg
        sed -i 's/^preserve_hostname:.*$/preserve_hostname: true/' /etc/cloud/cloud.cfg
        echo 'preserve_hostname: true' > /etc/cloud/cloud.cfg.d/50_preserve_hostname.cfg
    fi
}

add_temp_admin_user() {
    #setup temp admin
    getent passwd temphfsadmin || useradd -m temphfsadmin
    echo "temphfsadmin:${PASSWORD}" | chpasswd
    echo 'temphfsadmin ALL=(ALL) NOPASSWD: ALL' > /etc/sudoers.d/temphfsadmin
    chmod 440 /etc/sudoers.d/temphfsadmin
}

if $REINSTALL_NYDUS_ONLY; then
    umask 0022
    echo "Reinstalling Nydus"
    stop_nydus
    uninstall_nydus
    update_sudoers
    install_python
    install_update_nydus
    add_nydus_certs
    enable_nydus
    start_nydus
else
    echo "Running Default Bootscript"
    umask 0022
    add_temp_admin_user
    if $FIRST_TIME_SETUP; then
        update_sudoers
        clear_motd
        verify_network

        # Pre-reqs
        date
        pwd
        install_python

        install_sysstat
        date
        REINSTALL_NYDUS=0
    else
        export_python
        [ -f ${NYDUS_BIN}/python ] && ${NYDUS_BIN}/python -c "import pkg_resources, sys; from distutils.versionpredicate import VersionPredicate as VP; v = VP('nydus (%s)' % sys.argv[1]); not v.satisfied_by(pkg_resources.get_distribution('nydus').version) and sys.exit(9)" ${NYDUS_CONSTRAINT} &> /dev/null
        REINSTALL_NYDUS=$?
    fi

    # To support create-from-snapshot, stop Nydus before writing its new SSL
    # files so it uses the new ones when it starts.
    stop_nydus

    if [ ${REINSTALL_NYDUS} -ne 0 ]; then
        uninstall_nydus
    fi

    install_update_nydus

    cat > /opt/nydus/ssl/executor.key <<'EOF2'
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEArky2mN9Y8CeuBWdlM724T/eB33MaZ3WkARbpv18ywP/xCczY
gbcxcI673lYGSh4adNahq9pqfyUlsYuHA3hyhbdHu1pKBde3s5lqziaiogb2JQmC
HOlEZRfN6uBj3jMN8QZuFEGb7N5G0kjgDZi9WGqzcBVzXjZpqXTkNL1O2CKHp+Y4
T5BVLq+rsigOSgDxtEeoeFAyX9hCIDODLGLGH/KPywdSUAL93n2cgnHetMcBbUEK
KyO6BLRPvIvuZbTr6Xjhpo5HgwGhi0BlYv9k799VEvDauj/tKLvUmnWAwk8OCODO
ozQL8i/+2av+5yhT+D+qHQM+9zdQxTVnZHULQwIDAQABAoIBAAHTJlZR8jheoH+U
ZHv6eDrpgP4Unjbo0V8r2DjBVxRpkUOqZBU46dOJ+rgZpcI1qy1G0xarygEDUzvn
kMc0UdvOthExNDnlLIwpy3zQ2gfQWEntFsxvZIs7z/SfnVdPZnOdJ04QpwoNwg+m
UgDaJFpgmkS7o0cIqAZtUXBReAbeF1NZNW6H35MfJouLr+fJii6bHFzCRLSXYbqe
KzSNRYVd6zxaaMLVb4G0+1ozDLx+bkEHumq4bf0vG1zCr1Oa/rHPovhwtD8WYuCq
HlBYNKHwaqGmeNZkBJjFVpH+GJazlq8jkFAyixeXl7Kt9BiNOYJOnLPsUzpvNuuf
tahe64ECgYEA3Te3mkiXsYaeOqsu6vwWSryCvI0RZ8jYqtk8oJsMxmmHIMI6FNNg
R0n0yYCYYE0Zu84LOIrB+DoALgGojTFCL8EG9gZqEtvbFW5qs80xu3I37L79daRs
8k1u+eW72gbeu44hMpqXMbkv6ngZ3J7r8GO8DwLBLA7z0Tslr0QLSMMCgYEAybR9
SWiJGJtXAx2JGX7j3ymyoygG3cDprd7+0+ZQ+emNB8aOPTk1nj2R+Iwkov6j3ZhH
ox/so/9fa0nf1JD9eWjcsmFTPoj/MMzDZFFBQgRa4WBXl7MNkcDzimKdM+B4GnaJ
uianKeubvJz7xcU1/S2Pc6hRk8uHMgHQnUR3C4ECgYAgPTF9w5yP262NoUr6Jfjd
tXFcJzblKCkjZPtn8JDBDboKtSOfy1pZqVaKUzphtnrMmu+Zsucn1NQX4Ff/E7Gw
ofHwwuiMjQv1qJzWTU41IiUyVHc9wNO70DsfIjLpSF0HemQuKsdkELgB9LTYKTT7
WJ2clmsuj5NK59LLIyB93wKBgHCsKwRTqameNJff6tLcJ+xkPY6YcGV1OtPOamjy
Ei/YP9ilGJWonIP9fsnpdxm5xs2lH/dGgQkHQUUMakUyjPVCF25poXegTXT0HP2v
yhVXm3CkQanS8nSF5UVbWtc8v7qAluTubJilLUTKKHZMeKEpzyVbU96MZcQQcXk4
YouBAoGAM2R4tqv2As+fMsjHkwFoLaRqk6Hz4UKUSsIfyTfjxV+AaNSCi5itfDGf
7LYM8ALXPsn2c3G24NZHQGzYbgdSQBvVs5pz+P0elmnVWP2VxH3Eh1GsIjtbqyUy
mLNuXXtpN7wELqovQG/AADIE6NggjK3SwdPyqN1KtTYqg88dIWs=
-----END RSA PRIVATE KEY-----

EOF2
chown nydus: /opt/nydus/ssl/executor.key
chmod 400 /opt/nydus/ssl/executor.key

cat > /opt/nydus/ssl/executor.crt <<'EOF2'
-----BEGIN CERTIFICATE-----
MIIEIzCCAwugAwIBAgIUA4JZTcs3r9jngpGTNJPXGsITB+UwDQYJKoZIhvcNAQEL
BQAwgY4xCzAJBgNVBAYTAlVTMRAwDgYDVQQIDAdBcml6b25hMRMwEQYDVQQHDApT
Y290dHNkYWxlMRowGAYDVQQKDBFHb0RhZGR5LmNvbSwgSW5jLjEQMA4GA1UECwwH
SG9zdGluZzEqMCgGA1UEAwwhTnlkdXMgQ3VzdG9tZXIgU2VydmljZXMgKFAzLVBS
T0QpMB4XDTIzMDcyNjE2NTg0M1oXDTMzMDcyMzE2NTg0M1owgYwxCzAJBgNVBAYT
AlVTMQswCQYDVQQIDAJBWjETMBEGA1UEBwwKU2NvdHRzZGFsZTEaMBgGA1UECgwR
R29EYWRkeS5jb20sIEluYy4xEDAOBgNVBAsMB0hvc3RpbmcxLTArBgNVBAMMJDAw
MGVlMzgzLWEzOTctNDAzNS1iNWU1LTQzM2UwMzg4NDZlZjCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBAK5MtpjfWPAnrgVnZTO9uE/3gd9zGmd1pAEW6b9f
MsD/8QnM2IG3MXCOu95WBkoeGnTWoavaan8lJbGLhwN4coW3R7taSgXXt7OZas4m
oqIG9iUJghzpRGUXzergY94zDfEGbhRBm+zeRtJI4A2YvVhqs3AVc142aal05DS9
Ttgih6fmOE+QVS6vq7IoDkoA8bRHqHhQMl/YQiAzgyxixh/yj8sHUlAC/d59nIJx
3rTHAW1BCisjugS0T7yL7mW06+l44aaOR4MBoYtAZWL/ZO/fVRLw2ro/7Si71Jp1
gMJPDgjgzqM0C/Iv/tmr/ucoU/g/qh0DPvc3UMU1Z2R1C0MCAwEAAaN5MHcwDAYD
VR0TAQH/BAIwADAOBgNVHQ8BAf8EBAMCBaAwFgYDVR0lAQH/BAwwCgYIKwYBBQUH
AwEwPwYDVR0RAQH/BDUwM6QxMC8xLTArBgNVBAMMJDAwMGVlMzgzLWEzOTctNDAz
NS1iNWU1LTQzM2UwMzg4NDZlZjANBgkqhkiG9w0BAQsFAAOCAQEAGxT4N7IKDhro
xl8H91YUHXVGdLl5RscRHp5NxnaVj/FwRRON2lCHGGrKt3u8z+d3LWyGEWuI4HW1
mDsmuwX1jnUJ1VNsd5XB4X7Mj5z2ELizO0SXj5i2twxV7d4zpHKBWkZEDhgLEy/w
PxdjgT13fiOl51hzwFM1CM+frU67D49XtGLhgJxDpQJS+8n/WXL9Fvq0w4NJZw13
eeTMjxtk5Fg9qVj8+52t7oydftv6n37DMQ7DDLZCbqYJSXW9w05PWQhukh8gFio3
n9QrJkEbQI+fysOCS7w7DFymka07RDlrWjnAnRVoCyj6KlQJJSO+Dbxp59vQSVkn
rtdqcOI9nQ==
-----END CERTIFICATE-----

EOF2
chown nydus: /opt/nydus/ssl/executor.crt
chmod 440 /opt/nydus/ssl/executor.crt

cat > /opt/nydus/ssl/client_ca.crt <<'EOF2'
-----BEGIN CERTIFICATE-----
MIIFJTCCAw2gAwIBAgIBAjANBgkqhkiG9w0BAQsFADCBjTELMAkGA1UEBhMCVVMx
EDAOBgNVBAgMB0FyaXpvbmExEzARBgNVBAcMClNjb3R0c2RhbGUxGjAYBgNVBAoM
EUdvRGFkZHkuY29tLCBJbmMuMRAwDgYDVQQLDAdIb3N0aW5nMSkwJwYDVQQDDCBO
eWR1cyBSb290IENlcnRpZmljYXRlIChQMy1QUk9EKTAiGA8yMDE2MDQwMTAwMDAw
MFoYDzIwNDEwNDAxMDAwMDAwWjCBiTELMAkGA1UEBhMCVVMxEDAOBgNVBAgMB0Fy
aXpvbmExEzARBgNVBAcMClNjb3R0c2RhbGUxGjAYBgNVBAoMEUdvRGFkZHkuY29t
LCBJbmMuMRAwDgYDVQQLDAdIb3N0aW5nMSUwIwYDVQQDDBxOeWR1cyBIRlMgU2Vy
dmljZXMgKFAzLVBST0QpMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
wLvXzbdnuhPLOMnEOPXOxTotGZFLb2kkaMmC4SX0ebudrh7vrFMgcI61qc/o2hk/
0eAlrfuKDti+cv3IezaF5lusHlD7yKiNU5/gAZMuEtjetPyctd7eNpvr9qQ8jSFN
0Z83uAyoafK3rH4QGyjqny0CwVTDBfTrGoG2XD9I+nrdfGDXmvAC3deNoceqb/Zt
ijAqo+eiR8/sxcNwR1RGmUNzhs36WBx4T0CWTF4ynXF9b5qd+HHWKbstgPOx++BI
JrDXgQm6mk+bMXQUDaImi/ZXghTXltCzsQo33mWUMTqC9NmHhKo9MqYZNQYbVMHy
KKHpaYCxI/or/0nFHQ+7iwIDAQABo4GNMIGKMA8GA1UdEwEB/wQFMAMBAf8wDgYD
VR0PAQH/BAQDAgEGMB0GA1UdDgQWBBThfjcWjqVtiKLNZzRLzFkIa2qKZjAnBgNV
HREEIDAeghxOeWR1cyBIRlMgU2VydmljZXMgKFAzLVBST0QpMB8GA1UdIwQYMBaA
FEdvcQS/Emaa9gxAniCaqwVImDuxMA0GCSqGSIb3DQEBCwUAA4ICAQAzNlkJdV03
a5lnfOoha9sx7U+g5KOZc62Y3Ct5ZL9gEhFgxsUNEJ2md5zdgUNTGRdXq7aCywn2
qUbHsibC8Nipdv3yzYloRbkYWbVKJNN6OrxJLXR+H71FDrPrburBWvTDTcRQpu8E
WWIFSgyhW7gyEWrhUYXQSeomTWaMb7OMEW/chcEDmSyNM/ctly3iccYS8c1G46Mb
qz3mvnnVohat9oenIXe3CrwNLGYoMqi0p8JSHdb0ysJ8q6n7E0lYSuuxKFI5Z73o
aY85+1ALYA7EodCb3+Ih1V9fsU6WGr7ElYqIv1ACptMJDzbKC6HY9Fmzr25l6TIq
nbKUoxljCezCNlRL06vDTKisreKVrn5S77zBTgqipmd4hqZW6MeRqDgpnPVubHit
P+EhrNN8gO5/lU9QuYmiHnzA2ZXlfV/By0OA9/D3GtBMxYO5UXsWLdtz96zTJMfr
ukfg1CxC3rqn1Z4tAQmY5c2plBGip0c3nDOS+Du8N3FRcGr15Csbno821QwAJ9aJ
XEQ+2CjUiKxkxOu6pjfhl+dMgwmSebUol1cgu1DulhHhCkr7kqoRILP2VEcSLjrq
ImeTioNN52SJGNQHu0vjQPX8l8apWbk/ib8teij58PrOtjMQOD1OJNGD4JxTav7b
hgkvqHG0DOi5z9pdxyFPCXxB4tMZ99YMRA==
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
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
gA==
-----END CERTIFICATE-----


EOF2
chown nydus: /opt/nydus/ssl/client_ca.crt
chmod 440 /opt/nydus/ssl/client_ca.crt

    enable_nydus
    start_nydus

    update_cloud_init_config
fi

# Reset /etc/hosts for new hostname to get written
cat > /etc/hosts <<'EOF2'
127.0.0.1       localhost
EOF2

for ip in $(hostname -I); do
    echo -e "$ip	temp.secureserver.net" >> /etc/hosts
done

cat >> /etc/hosts <<'EOF2'

# The following lines are desirable for IPv6 capable hosts
::1 ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
ff02::3 ip6-allhosts
EOF2


echo -n "Waiting for dpkg unlock."
while lsof /var/lib/dpkg/lock >/dev/null; do echo -n '.'; sleep .3; done
echo "done!"

# pre-run sar
sed -i -e 's/5-55\/10 \* \* \* \* root /\*\/5 \* \* \* \* root /' /etc/cron.d/sysstat
sed -i -e 's/ENABLED="false"/ENABLED="true"/' /etc/default/sysstat
systemctl restart sysstat
systemctl restart cron
/usr/lib/sysstat/sa1

systemctl daemon-reload

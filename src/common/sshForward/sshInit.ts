import ssh2 from 'ssh2-promise';
// import SSHConfig from "ssh2-promise/lib/sshConfig";

const sshConfig: any = {
  host: process.env.SSH_HOST,
  port: 22,
  username: process.env.SSH_USERNAME,
  password: process.env.SSH_PASSWORD,
};

export const sshInit = async () => {
  try {
    const sshConnection = new ssh2(sshConfig);
    return await sshConnection.addTunnel({
      remoteAddr: process.env.MYSQL_HOST_REMOTE,
      remotePort: parseInt(process.env.MYSQL_PORT_REMOTE) || 3306,
      localPort: parseInt(process.env.MYSQL_PORT_FORWARD) || 3307,
    });
  } catch (error) {
    throw error;
  }
};

const host = 'http://justdb.top:8080/';
// const host = 'http://192.168.1.103:8081/';

const commonapi = {
	hostUrl: host,
	login: host + 'login',
	upload: host + 'upload',
	userregister: host + 'userregister',
	loginLog: host + 'loginlog',
	getuserlist: host + 'getuserlist',
	deleteuser: host + 'deleteuser',
	updateuser: host + 'updateuser',
	operationLog: host + 'operationlog',
}
export {
	commonapi
}